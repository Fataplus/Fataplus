#!/bin/bash

# One-liner version for direct SSH execution
# Run this on your Cloudron server: bash <(curl -s https://your-script-url.sh) or copy-paste the command

echo "Cloudron Users Export - $(date)"
echo "================================="
echo ""
echo "CSV Header: Username,Full Name,Email,Groups,User ID,Home Directory,Shell"
echo ""

# Extract users and format as CSV
getent passwd | awk -F: '
$3 >= 1000 && $1 !~ /^(root|daemon|bin|sys|sync|games|man|lp|mail|news|uucp|proxy|www-data|backup|list|irc|gnats|nobody|systemd|mysql|redis|postgres|mongodb|nginx|apache|www|git|gitolite|sshd)$/ {
    username=$1
    uid=$3
    gid=$4
    fullname=$5
    home=$6
    shell=$7

    # Clean full name
    split(fullname, nameparts, ",")
    cleanname = nameparts[1]
    gsub(/^[ \t]+|[ \t]+$/, "", cleanname)

    # Get groups
    cmd = "groups " username " 2>/dev/null"
    groups = ""
    while ((cmd | getline line) > 0) {
        if (line ~ /:/) {
            split(line, groupparts, ": ")
            groups = groupparts[2]
            break
        }
    }
    close(cmd)

    # Escape commas for CSV
    gsub(/,/, ";", cleanname)
    gsub(/,/, ";", groups)

    print username "," cleanname "," "" "," groups "," uid "," home "," shell
}
'

echo ""
echo "Group Summary:"
echo "=============="
getent passwd | awk -F: '
$3 >= 1000 && $1 !~ /^(root|daemon|bin|sys|sync|games|man|lp|mail|news|uucp|proxy|www-data|backup|list|irc|gnats|nobody|systemd|mysql|redis|postgres|mongodb|nginx|apache|www|git|gitolite|sshd)$/ {
    print $1 ":" $4
}
' | sort -t: -k2 | awk -F: '
{
    gid = $2
    user = $1
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
        cmd = "getent group " gid " | cut -d: -f1"
        groupname = ""
        while ((cmd | getline line) > 0) {
            groupname = line
        }
        close(cmd)
        if (groupname == "") groupname = "GID:" gid
        print groupname " (" count[gid] " users): " groups[gid]
    }
}
'
