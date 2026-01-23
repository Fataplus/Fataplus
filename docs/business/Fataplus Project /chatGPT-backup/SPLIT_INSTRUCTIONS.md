# Instructions for Splitting Large JSON Files

This directory contains two Python scripts to split your large `conversations.json` file into smaller, more manageable parts.

## Scripts Available

1. **`split_conversations_simple.py`** - Simple version that doesn't require external dependencies
2. **`split_conversations.py`** - Advanced streaming version for very large files

## Option 1: Using the Simple Script (Recommended for files < 500MB)

This script loads the entire file into memory, so it's suitable for moderately large files.

### Steps:

1. Navigate to the chatGPT-backup directory:
   ```bash
   cd chatGPT-backup
   ```

2. Run the script:
   ```bash
   python3 split_conversations_simple.py
   ```

3. Follow the prompts. The script will:
   - Show you the file size
   - Ask for confirmation
   - Split the file into parts with 500 conversations each
   - Create files named `conversations_split_0001.json`, `conversations_split_0002.json`, etc.

## Option 2: Using the Streaming Script (Recommended for very large files)

This script uses streaming JSON parsing and is more memory-efficient for very large files.

### Steps:

1. Install the required dependency:
   ```bash
   pip install ijson
   # or
   pip install -r requirements.txt
   ```

2. Navigate to the chatGPT-backup directory:
   ```bash
   cd chatGPT-backup
   ```

3. Run the script:
   ```bash
   python3 split_conversations.py
   ```

4. Follow the prompts similar to the simple script.

## Configuration

Both scripts default to 500 conversations per file. You can modify this by editing the `conversations_per_file` variable in either script:

```python
conversations_per_file = 500  # Change this number as needed
```

Recommended values based on your needs:
- **100-200**: For easier manual review
- **500-1000**: Good balance of file size and number of files
- **2000-5000**: For fewer files but larger individual files

## Output

The scripts will create files in the same directory with the naming pattern:
- `conversations_split_0001.json`
- `conversations_split_0002.json`
- `conversations_split_0003.json`
- ... and so on

Each file will maintain the same JSON structure:
```json
{
  "conversations": [
    // Array of conversation objects
  ]
}
```

## Troubleshooting

### Memory Error
If you get a memory error with the simple script:
1. Use the streaming version instead
2. Or reduce the number of conversations per file
3. Or close other applications to free up memory

### JSON Decode Error
This means the JSON file might be corrupted:
1. Check if the file is complete
2. Try opening it in a text editor to see if it ends properly
3. Use a JSON validator to check for syntax errors

### ijson Installation Issues
If you can't install ijson:
1. Make sure you have pip installed: `python3 -m pip --version`
2. Try upgrading pip: `python3 -m pip install --upgrade pip`
3. Use the simple script instead if installation fails

## Validation

After splitting, you can validate the output files:

```bash
# Check if files are valid JSON
python3 -m json.tool conversations_split_0001.json > /dev/null
echo "File is valid JSON"

# Count conversations in a file
python3 -c "import json; print(len(json.load(open('conversations_split_0001.json'))['conversations']))"
```

## Notes

- The original `conversations.json` file is not modified
- Make sure you have enough disk space for the output files
- The scripts show progress as they work
- You can interrupt the process with Ctrl+C if needed 