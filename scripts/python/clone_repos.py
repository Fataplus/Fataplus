import os
import subprocess

repos = [
    "https://github.com/Fataplus/Fataplus",
    "https://github.com/Fataplus/FP-11",
    "https://github.com/Fataplus/fataplus-web25",
    "https://github.com/Fataplus/Fataplus-Agritech-Platform",
    "https://github.com/Fataplus/fataplus-builder",
    "https://github.com/Fataplus/fataplus-cms",
    "https://github.com/Fataplus/Fataplus-Web",
    "https://github.com/Fataplus/fataplus-app",
    "https://github.com/Fataplus/Fataplus---Tsena-ny-tantsaha",
    "https://github.com/Fataplus/fataplus-react",
    "https://github.com/Fataplus/fataplus-5faf2816"
]

target_dir = "/Users/fefe/Documents/Fataplus/Repos"
os.makedirs(target_dir, exist_ok=True)

for repo in repos:
    name = repo.split("/")[-1]
    repo_path = os.path.join(target_dir, name)
    if os.path.exists(repo_path):
        print(f"Checking {name}...")
        # simple check if it's a git repo
        if os.path.exists(os.path.join(repo_path, ".git")):
            print(f"Pulling {name}...")
            subprocess.run(["git", "pull"], cwd=repo_path)
        else:
             print(f"{name} exists but no .git found. Skipping pull.")
    else:
        print(f"Cloning {name}...")
        subprocess.run(["git", "clone", repo, repo_path])
