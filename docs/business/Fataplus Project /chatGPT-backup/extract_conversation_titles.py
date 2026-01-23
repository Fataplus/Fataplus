import json
import os

INPUT_FILE = "chatGPT-backup/conversations_part1.json"
OUTPUT_FILE = "chatGPT-backup/conversation_titles.txt"

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    conversations = data.get("conversations", data)
    titles = []
    for conv in conversations:
        title = conv.get("title")
        if title and title.strip():
            titles.append(title.strip())
    # Dédupliquer et trier
    unique_titles = sorted(set(titles), key=lambda x: titles.index(x))
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out_f:
        for t in unique_titles:
            out_f.write(f"- {t}\n")
    print(f"Found {len(unique_titles)} unique titles. Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
