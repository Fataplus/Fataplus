#!/usr/bin/env python3
"""
Simple script to split large conversations.json file into smaller parts.
This version doesn't require external dependencies but may use more memory.
"""

import json
import os
import sys
import gc  # For garbage collection

def split_conversations_simple(input_file: str, conversations_per_file: int = 500):
    """
    Split large conversations.json into smaller files.
    This version loads the entire file into memory.
    
    Args:
        input_file: Path to the large conversations.json file
        conversations_per_file: Number of conversations per output file
    """
    # Get file info
    file_size_mb = os.path.getsize(input_file) / (1024 * 1024)
    print(f"Loading {input_file} ({file_size_mb:.2f} MB)...")
    
    try:
        # Load the entire file
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract conversations list
        if isinstance(data, dict) and 'conversations' in data:
            conversations = data['conversations']
        elif isinstance(data, list):
            conversations = data
        else:
            print("Error: Unexpected JSON structure")
            return
        
        total_conversations = len(conversations)
        print(f"Loaded {total_conversations} conversations")
        
        # Clear the original data from memory
        del data
        gc.collect()
        
    except MemoryError:
        print("Error: File is too large to load into memory!")
        print("Please use the streaming version (split_conversations.py) with ijson installed")
        return
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format - {e}")
        return
    except Exception as e:
        print(f"Error loading file: {e}")
        return
    
    # Calculate number of output files
    num_files = (total_conversations + conversations_per_file - 1) // conversations_per_file
    print(f"Will create {num_files} files with up to {conversations_per_file} conversations each")
    
    # Create output directory path
    output_dir = os.path.dirname(input_file)
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    
    # Split and write files
    print("\nSplitting conversations...")
    for file_num in range(num_files):
        start_idx = file_num * conversations_per_file
        end_idx = min(start_idx + conversations_per_file, total_conversations)
        
        # Extract chunk
        chunk = conversations[start_idx:end_idx]
        
        # Create output filename
        output_file = os.path.join(output_dir, f"{base_name}_split_{file_num + 1:04d}.json")
        
        # Write chunk to file
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"conversations": chunk}, f, ensure_ascii=False, indent=2)
            
            print(f"  Created {output_file} with {len(chunk)} conversations")
            
            # Clear chunk from memory
            del chunk
            gc.collect()
            
        except Exception as e:
            print(f"Error writing {output_file}: {e}")
            return
    
    print(f"\nSuccessfully split {input_file} into {num_files} files!")
    
    # Clear conversations from memory
    del conversations
    gc.collect()

def main():
    """Main function to run the script."""
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
    
    if file_size_mb > 500:
        print("\nWARNING: This file is very large and may cause memory issues!")
        print("Consider using the streaming version (split_conversations.py) instead")
    
    # Confirm with user
    print(f"\nThis will split {input_file} into multiple files")
    print(f"Each file will contain up to {conversations_per_file} conversations")
    response = input("Continue? (y/n): ")
    
    if response.lower() != 'y':
        print("Operation cancelled.")
        sys.exit(0)
    
    # Perform the split
    split_conversations_simple(input_file, conversations_per_file)

if __name__ == "__main__":
    main() 