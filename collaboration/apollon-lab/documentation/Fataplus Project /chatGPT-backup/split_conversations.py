#!/usr/bin/env python3
"""
Script to split large conversations.json file into smaller parts.
Uses streaming JSON parsing to handle large files efficiently.
"""

import json
import os
import sys
from typing import Iterator, Dict, Any
import ijson  # For streaming JSON parsing

def stream_conversations(file_path: str) -> Iterator[Dict[str, Any]]:
    """
    Stream conversations from a large JSON file without loading it entirely into memory.
    Assumes the JSON structure is {"conversations": [...]}
    """
    try:
        with open(file_path, 'rb') as file:
            # Parse the conversations array iteratively
            parser = ijson.items(file, 'conversations.item')
            for conversation in parser:
                yield conversation
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

def count_conversations(file_path: str) -> int:
    """Count total number of conversations in the file."""
    count = 0
    print("Counting conversations...")
    for _ in stream_conversations(file_path):
        count += 1
        if count % 1000 == 0:
            print(f"  Counted {count} conversations so far...")
    return count

def split_conversations(input_file: str, conversations_per_file: int = 100):
    """
    Split large conversations.json into smaller files.
    
    Args:
        input_file: Path to the large conversations.json file
        conversations_per_file: Number of conversations per output file
    """
    # Create output directory
    output_dir = os.path.dirname(input_file)
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    
    # First, count total conversations
    total_conversations = count_conversations(input_file)
    print(f"\nTotal conversations: {total_conversations}")
    
    # Calculate number of output files needed
    num_files = (total_conversations + conversations_per_file - 1) // conversations_per_file
    print(f"Will create {num_files} files with up to {conversations_per_file} conversations each")
    
    # Stream through conversations again and write to files
    print("\nSplitting conversations...")
    conversation_iter = stream_conversations(input_file)
    
    for file_num in range(1, num_files + 1):
        output_file = os.path.join(output_dir, f"{base_name}_split_{file_num:04d}.json")
        
        # Collect conversations for this file
        conversations_chunk = []
        for _ in range(conversations_per_file):
            try:
                conversation = next(conversation_iter)
                conversations_chunk.append(conversation)
            except StopIteration:
                break
        
        # Write chunk to file
        if conversations_chunk:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"conversations": conversations_chunk}, f, ensure_ascii=False, indent=2)
            
            print(f"  Created {output_file} with {len(conversations_chunk)} conversations")
    
    print(f"\nSuccessfully split {input_file} into {num_files} files!")

def main():
    """Main function to run the script."""
    # Check if ijson is installed
    try:
        import ijson
    except ImportError:
        print("Error: ijson module is not installed.")
        print("Please install it using: pip install ijson")
        sys.exit(1)
    
    # Configuration
    input_file = "conversations.json"
    conversations_per_file = 500  # Adjust based on your needs
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found!")
        print("Make sure you're running this script from the chatGPT-backup directory")
        sys.exit(1)
    
    # Get file size
    file_size_mb = os.path.getsize(input_file) / (1024 * 1024)
    print(f"Input file size: {file_size_mb:.2f} MB")
    
    # Confirm with user
    print(f"\nThis will split {input_file} into multiple files")
    print(f"Each file will contain up to {conversations_per_file} conversations")
    response = input("Continue? (y/n): ")
    
    if response.lower() != 'y':
        print("Operation cancelled.")
        sys.exit(0)
    
    # Perform the split
    split_conversations(input_file, conversations_per_file)

if __name__ == "__main__":
    main()
