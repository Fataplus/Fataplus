import json
import os

INPUT_FILE = "chatGPT-backup/conversations.json"
OUTPUT_FILE = "chatGPT-backup/conversations_sample.json"
SAMPLE_SIZE = 10

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        conversations = json.load(f)
    sample = conversations[:SAMPLE_SIZE]
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out_f:
        json.dump({"conversations": sample}, out_f, ensure_ascii=False, indent=2)
    print(f"Wrote {OUTPUT_FILE} ({len(sample)} conversations)")

if __name__ == "__main__":
    main()
