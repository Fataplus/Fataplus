import os
import json
import time
from datetime import datetime
import csv
import glob

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))  # Fataplus-Master-Dashboard
BASE_DIR = os.path.dirname(ROOT_DIR)  # Fataplus root

def get_project_info(path):
    """Extracts basic info from a project directory."""
    name = os.path.basename(path)
    last_modified = os.path.getmtime(path)
    
    # Try to find a description or better name
    description = ""
    tech = []
    
    # Check package.json
    pkg_path = os.path.join(path, "package.json")
    if os.path.exists(pkg_path):
        try:
            with open(pkg_path, 'r') as f:
                pkg_data = json.load(f)
                if 'description' in pkg_data:
                    description = pkg_data['description']
                if 'dependencies' in pkg_data:
                    tech = list(pkg_data['dependencies'].keys())[:5] # Top 5 deps
        except:
            pass
            
    # Check README.md if no description
    if not description:
        readme_path = os.path.join(path, "README.md")
        if os.path.exists(readme_path):
            with open(readme_path, 'r', errors='ignore') as f:
                first_line = f.readline().strip()
                if first_line.startswith('#'):
                    description = first_line.lstrip('#').strip()
    
    return {
        "name": name,
        "path": path.replace(BASE_DIR, ""), # Relative path for display
        "last_modified": last_modified,
        "description": description,
        "tech": tech
    }

def scan_repos():
    repos_dir = os.path.join(BASE_DIR, "Repos")
    projects = []
    
    if os.path.exists(repos_dir):
        for item in os.listdir(repos_dir):
            item_path = os.path.join(repos_dir, item)
            if os.path.isdir(item_path) and not item.startswith('.'):
                projects.append(get_project_info(item_path))
    
    # Also check other top level folders that might be projects
    for extra in ["Agency-Web", "fataplus-os"]:
        path = os.path.join(BASE_DIR, extra)
        if os.path.exists(path):
            projects.append(get_project_info(path))
            
    # Sort by modification time (newest first)
    projects.sort(key=lambda x: x['last_modified'], reverse=True)
    return projects

def scan_finance():
    # Try to find the unified bank data csv
    csv_path = os.path.join(BASE_DIR, "Bank docs", "unified_bank_data.csv")
    finance_data = {
        "total_income": 0,
        "total_expenses": 0,
        "balance": 0,
        "currency": "MGA"
    }
    
    if os.path.exists(csv_path):
        try:
            with open(csv_path, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Assuming CSV has 'Credit', 'Debit' columns
                    credit = float(row.get('Credit', 0) or 0)
                    debit = float(row.get('Debit', 0) or 0)
                    finance_data["total_income"] += credit
                    finance_data["total_expenses"] += debit
            
            finance_data["balance"] = finance_data["total_income"] - finance_data["total_expenses"]
        except Exception as e:
            print(f"Error reading finance data: {e}")
            
    return finance_data

def scan_activity():
    # Read the git logs file
    log_path = os.path.join(BASE_DIR, "all_git_logs_2025.txt")
    commits = []
    
    if os.path.exists(log_path):
        try:
            with open(log_path, 'r', errors='ignore') as f:
                lines = f.readlines()
                # Simple parser assuming standard git log format or similar
                # This is a heuristic based on the file name
                for line in lines[:20]: # Just grab top lines for now as sample
                    commits.append(line.strip())
        except Exception as e:
            print(f"Error reading activity log: {e}")
            
    return commits

def main():
    print("Scanning system...")
    data = {
        "generated_at": datetime.now().isoformat(),
        "projects": scan_repos(),
        "finance": scan_finance(),
        "activity": scan_activity()
    }
    
    output_path = os.path.join(ROOT_DIR, "data.json")
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Dashboard data generated at {output_path}")

if __name__ == "__main__":
    main()
