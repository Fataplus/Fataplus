import os
import subprocess

search_term = "Cohorte"
directory = "./docs/business"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.lower().endswith(".pdf"):
            path = os.path.join(root, file)
            try:
                # Convert first page or two to text to check
                # We use pdftotext -l 5 to read first 5 pages
                result = subprocess.run(
                    ["pdftotext", "-l", "5", path, "-"], capture_output=True, text=True
                )
                if search_term.lower() in result.stdout.lower():
                    print(f"Found '{search_term}' in: {path}")
                    # Print context around the term
                    lines = result.stdout.split("\n")
                    for i, line in enumerate(lines):
                        if search_term.lower() in line.lower():
                            print(f"  Context: {line.strip()}")
            except Exception as e:
                print(f"Error processing {path}: {e}")
