#!/usr/bin/env python3
"""
Automatic script to split large conversations.json file into smaller parts.
This version runs without user interaction.
"""

import json
import os
import sys
import gc  # For garbage collection

def split_conversations_auto(input_file: str = "conversations.json", conversations_per_file: int = 500):
    """
    Split large conversations.json into smaller files automatically.
    
    Args:
        input_file: Path to the large conversations.json file
        conversations_per_file: Number of conversations per output file
    """
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found!")
        return False
    
    # Get file info
    file_size_mb = os.path.getsize(input_file) / (1024 * 1024)
    print(f"Processing {input_file} ({file_size_mb:.2f} MB)...")
    print(f"Will split into files with {conversations_per_file} conversations each")
    
    try:
        # Load the entire file
        print("Loading file...")
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract conversations list
        if isinstance(data, dict) and 'conversations' in data:
            conversations = data['conversations']
        elif isinstance(data, list):
            conversations = data
        else:
            print("Error: Unexpected JSON structure")
            return False
        
        total_conversations = len(conversations)
        print(f"Loaded {total_conversations} conversations")
        
        # Clear the original data from memory
        del data
        gc.collect()
        
    except MemoryError:
        print("Error: File is too large to load into memory!")
        print("Please use the streaming version (split_conversations.py) with ijson installed")
        return False
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format - {e}")
        return False
    except Exception as e:
        print(f"Error loading file: {e}")
        return False
    
    # Calculate number of output files
    num_files = (total_conversations + conversations_per_file - 1) // conversations_per_file
    print(f"Creating {num_files} files...")
    
    # Create output directory path
    output_dir = os.path.dirname(input_file) if os.path.dirname(input_file) else '.'
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    
    # Split and write files
    print("\nSplitting conversations:")
    success_count = 0
    
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
            
            print(f"  ✓ Created {output_file} with {len(chunk)} conversations")
            success_count += 1
            
            # Clear chunk from memory
            del chunk
            gc.collect()
            
        except Exception as e:
            print(f"  ✗ Error writing {output_file}: {e}")
    
    # Clear conversations from memory
    del conversations
    gc.collect()
    
    # Summary
    print(f"\n{'='*60}")
    print(f"SUMMARY:")
    print(f"  Total conversations: {total_conversations}")
    print(f"  Files created: {success_count}/{num_files}")
    print(f"  Conversations per file: {conversations_per_file}")
    print(f"{'='*60}")
    
    return success_count == num_files

def main():
    """Main function to run the script."""
    print("Automatic JSON Split Script")
    print("=" * 60)
    
    # Run the split
    success = split_conversations_auto()
    
    if success:
        print("\n✅ Successfully completed!")
        sys.exit(0)
    else:
        print("\n❌ Process failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 