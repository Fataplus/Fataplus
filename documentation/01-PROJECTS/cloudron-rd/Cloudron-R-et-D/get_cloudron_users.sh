#!/bin/bash

# Script to extract all users from Cloudron server and export as CSV with group categorization
# Run this script on your Cloudron server via SSH

echo "🔍 Extracting user information from Cloudron server..."
echo "This may take a few moments..."

# Function to get all users and their groups
get_users_csv() {
    echo "Username,Full Name,Email,Groups,User ID,Home Directory,Shell,Last Login"

    # Get all system users (excluding system accounts)
    getent passwd | while IFS=: read -r username password uid gid full_name home shell; do
        # Skip system users (UID < 1000) and common system accounts
        if [[ $uid -lt 1000 ]] || [[ "$username" =~ ^(root|daemon|bin|sys|sync|games|man|lp|mail|news|uucp|proxy|www-data|backup|list|irc|gnats|nobody|systemd|mysql|redis|postgres|mongodb|nginx|apache|www|git|gitolite|sshd)$ ]]; then
            continue
        fi

        # Get user email from LDAP if available
        email=""
        if command -v ldapsearch &> /dev/null; then
            email=$(ldapsearch -x -b "dc=cloudron,dc=local" "(uid=$username)" mail | grep "^mail:" | head -1 | cut -d' ' -f2- || echo "")
        fi

        # Get groups for this user
        groups=$(groups "$username" 2>/dev/null | cut -d: -f2 | sed 's/^ //' | tr ' ' ';')

        # Get last login
        last_login=""
        if command -v lastlog &> /dev/null; then
            last_login=$(lastlog -u "$username" | tail -1 | awk '{print $4,$5,$6,$7,$8,$9}' | xargs)
        fi

        # Clean up full name (remove extra info)
        clean_name=$(echo "$full_name" | cut -d',' -f1 | sed 's/,,*//' | xargs)

        # Escape commas in CSV fields
        clean_name=$(echo "$clean_name" | sed 's/,/;/g')
        groups=$(echo "$groups" | sed 's/,/;/g')

        echo "\"$username\",\"$clean_name\",\"$email\",\"$groups\",\"$uid\",\"$home\",\"$shell\",\"$last_login\""
    done
}

# Function to get LDAP users specifically (Cloudron users)
get_ldap_users_csv() {
    echo "Cloudron Username,Display Name,Email,Groups,LDAP DN,Account Status"

    if command -v ldapsearch &> /dev/null; then
        ldapsearch -x -b "ou=users,dc=cloudron,dc=local" "(objectClass=posixAccount)" uid cn mail dn userPassword | \
        awk '
        /^dn:/ {dn=$0; sub(/^dn: /, "", dn)}
        /^uid:/ {uid=$0; sub(/^uid: /, "", uid)}
        /^cn:/ {cn=$0; sub(/^cn: /, "", cn)}
        /^mail:/ {mail=$0; sub(/^mail: /, "", mail)}
        /^userPassword:/ {
            password=$0; sub(/^userPassword: /, "", password)
            # Check if password starts with {SASL} (disabled account) or is empty
            if (password ~ /^{SASL}/ || password == "") {
                status="Disabled"
            } else {
                status="Active"
            }
            # Try to get groups for this user
            cmd="groups " uid " 2>/dev/null"
            cmd | getline groups_output
            close(cmd)
            if (groups_output) {
                split(groups_output, arr, ": ")
                groups=arr[2]
                gsub(/ /, ";", groups)
            } else {
                groups=""
            }
            print "\"" uid "\",\"" cn "\",\"" mail "\",\"" groups "\",\"" dn "\",\"" status "\""
        }
        ' || echo "LDAP search failed - LDAP may not be configured or accessible"
    else
        echo "LDAP tools not available on this system"
    fi
}

# Function to categorize users by primary group
categorize_by_group() {
    echo "📊 Categorizing users by primary group..."

    # Create temporary files
    temp_file=$(mktemp)
    system_users=$(mktemp)
    cloudron_users=$(mktemp)

    # Get system users
    echo "System Users:" > "$system_users"
    getent passwd | awk -F: '$3 >= 1000 && $1 !~ /^(root|daemon|bin|sys|sync|games|man|lp|mail|news|uucp|proxy|www-data|backup|list|irc|gnats|nobody|systemd|mysql|redis|postgres|mongodb|nginx|apache|www|git|gitolite|sshd)$/ {print $1 "," $4 "," $5}' >> "$system_users"

    # Get Cloudron LDAP users if available
    echo -e "\nCloudron Users:" > "$cloudron_users"
    if command -v ldapsearch &> /dev/null; then
        ldapsearch -x -b "ou=users,dc=cloudron,dc=local" "(objectClass=posixAccount)" uid gidNumber | \
        awk '
        /^uid:/ {uid=$0; sub(/^uid: /, "", uid)}
        /^gidNumber:/ {gid=$0; sub(/^gidNumber: /, "", gid); print uid "," gid}
        ' >> "$cloudron_users" 2>/dev/null || echo "LDAP query failed" >> "$cloudron_users"
    fi

    # Combine and categorize
    {
        echo "=== USER CATEGORIZATION REPORT ==="
        echo "Generated on: $(date)"
        echo "Server: $(hostname)"
        echo ""

        # Count total users
        total_users=$(getent passwd | awk -F: '$3 >= 1000 && $1 !~ /^(root|daemon|bin|sys|sync|games|man|lp|mail|news|uucp|proxy|www-data|backup|list|irc|gnats|nobody|systemd|mysql|redis|postgres|mongodb|nginx|apache|www|git|gitolite|sshd)$/' | wc -l)
        echo "Total regular users: $total_users"
        echo ""

        # Group by primary GID
        echo "Users by Primary Group:"
        getent passwd | awk -F: '$3 >= 1000 && $1 !~ /^(root|daemon|bin|sys|sync|games|man|lp|mail|news|uucp|proxy|www-data|backup|list|irc|gnats|nobody|systemd|mysql|redis|postgres|mongodb|nginx|apache|www|git|gitolite|sshd)$/ {print $1 ":" $4}' | \
        sort -t: -k2 | \
        awk -F: '
        {
            gid=$2
            user=$1
            if (!(gid in groups)) {
                groups[gid] = user
                count[gid] = 1
            } else {
                groups[gid] = groups[gid] ", " user
                count[gid]++
            }
        }
        END {
            for (gid in groups) {
                group_name = ""
                # Try to get group name
                cmd = "getent group " gid " | cut -d: -f1"
                cmd | getline group_name
                close(cmd)
                if (group_name == "") group_name = "GID:" gid
                print "  " group_name " (" count[gid] " users): " groups[gid]
            }
        }
        '

        echo ""
        echo "=== DETAILED USER LIST ==="
    } > "$temp_file"

    cat "$temp_file"

    # Cleanup
    rm -f "$temp_file" "$system_users" "$cloudron_users"
}

# Main execution
echo "🚀 Starting Cloudron user extraction..."
echo ""

# Create output directory
OUTPUT_DIR="./cloudron_users_export_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo "📁 Output directory: $OUTPUT_DIR"
echo ""

# Generate main CSV file
echo "📝 Generating system users CSV..."
get_users_csv > "$OUTPUT_DIR/system_users.csv"

# Generate LDAP users CSV if available
echo "📝 Generating Cloudron LDAP users CSV..."
get_ldap_users_csv > "$OUTPUT_DIR/cloudron_users.csv"

# Generate categorization report
categorize_by_group > "$OUTPUT_DIR/user_categorization_report.txt"

echo ""
echo "✅ Export completed!"
echo ""
echo "📂 Files generated:"
echo "  - $OUTPUT_DIR/system_users.csv (All system users with groups)"
echo "  - $OUTPUT_DIR/cloudron_users.csv (Cloudron-specific users)"
echo "  - $OUTPUT_DIR/user_categorization_report.txt (Summary by groups)"
echo ""
echo "📊 Summary:"
total_system=$(wc -l < "$OUTPUT_DIR/system_users.csv")
total_cloudron=$(wc -l < "$OUTPUT_DIR/cloudron_users.csv")
echo "  - System users found: $((total_system - 1)) (excluding header)"
echo "  - Cloudron users found: $((total_cloudron - 1)) (excluding header)"
echo ""
echo "💡 Tip: Use 'scp' to download these files to your local machine:"
echo "   scp -r $(whoami)@$(hostname):$OUTPUT_DIR ./"
echo ""
echo "🔒 Remember to clean up sensitive data after use!"
