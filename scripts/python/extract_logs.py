import os
import subprocess

repo_base = "/Users/fefe/Documents/Fataplus/Repos"
repos = [d for d in os.listdir(repo_base) if os.path.isdir(os.path.join(repo_base, d))]

all_logs = {}

for repo in repos:
    path = os.path.join(repo_base, repo)
    try:
        # Get logs since 2025-01-01
        result = subprocess.run(
            ["git", "log", "--since=2025-01-01", "--pretty=format:%ad | %s", "--date=short", "--all"],
            cwd=path,
            capture_output=True,
            text=True
        )
        if result.returncode == 0 and result.stdout.strip():
            all_logs[repo] = result.stdout.strip().split('\n')
        else:
            all_logs[repo] = []
    except Exception as e:
        print(f"Error in {repo}: {e}")

# Save to file
with open("all_git_logs_2025.txt", "w") as f:
    for repo, logs in all_logs.items():
        f.write(f"=== {repo} ===\n")
        if logs:
            for line in logs:
                f.write(f"{line}\n")
        else:
            f.write("No commits in 2025\n")
        f.write("\n")
