import os
import subprocess
import re

directory = "./docs"
search_terms = ["Cohorte", "Liste", "Lauréat", "Gagnant", "Startups"]

print(f"Scanning {directory} for PDFs containing keywords or email addresses...")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.lower().endswith(".pdf"):
            path = os.path.join(root, file)
            try:
                # Convert whole pdf to text
                result = subprocess.run(
                    ["pdftotext", path, "-"], capture_output=True, text=True
                )
                content = result.stdout

                found_terms = []
                for term in search_terms:
                    if term.lower() in content.lower():
                        found_terms.append(term)

                email_count = content.count("@")

                if found_terms or email_count > 5:
                    print(f"\nFile: {path}")
                    if found_terms:
                        print(f"  Keywords found: {', '.join(found_terms)}")
                    if email_count > 0:
                        print(f"  Email count: {email_count}")

                    # Print a snippet if interesting
                    if "Liste" in found_terms or "Startups" in found_terms:
                        print("  Snippet (first 200 chars):")
                        print(content[:200].replace("\n", " "))

            except Exception as e:
                pass
