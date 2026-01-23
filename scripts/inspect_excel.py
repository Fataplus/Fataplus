import pandas as pd
import sys
import os

def inspect_excel(file_path):
    print(f"Inspecting: {file_path}")
    if not os.path.exists(file_path):
        print("File not found.")
        return

    try:
        # Load the excel file
        xl = pd.ExcelFile(file_path)
        print(f"Sheet names: {xl.sheet_names}")

        for sheet in xl.sheet_names:
            print(f"\n--- Sheet: {sheet} ---")
            df = xl.parse(sheet, nrows=5) # Inspect first 5 rows to get headers
            print("Columns:")
            for col in df.columns:
                print(f"  - {col}")
            print("First 2 rows of data:")
            print(df.head(2).to_string())
            
    except Exception as e:
        print(f"Error reading excel file: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_excel(sys.argv[1])
    else:
        print("Please provide a file path.")
