
import PyPDF2
import re
import csv
import os
import glob

def parse_amount(amount_str):
    """
    Parses amount string like '10 000,00' or '24 609,08' to float.
    Removes spaces and replaces comma with dot.
    """
    if not amount_str:
        return 0.0
    clean_str = amount_str.replace(' ', '').replace(',', '.')
    try:
        return float(clean_str)
    except ValueError:
        return 0.0

def categorize_transaction(tx):
    desc = tx['Description'].lower()
    
    # Income Categories
    if tx['Credit']:
        if 'mvola' in desc: return 'Mvola'
        if 'riake' in desc: return 'Riake'
        if 'refund' in desc: return 'Refund'
        if 'virement' in desc: return 'Transfer'
        return 'Other Income'
    
    # Expense Categories
    if tx['Debit']:
        if 'mvola' in desc or 'transfer bank to wallet' in desc: return 'Mvola Out'
        if 'db vente' in desc: return 'Card Payment'
        if 'retrait' in desc: return 'Withdrawal'
        if 'frais' in desc: return 'Fees'
        if 'tva' in desc: return 'Tax'
        return 'Other Expense'
        
    return 'Uncategorized'

def process_pdfs(directory):
    # ... (Keep existing code unchanged up to writing) ...
    pdf_files = glob.glob(os.path.join(directory, "*.pdf"))
    all_transactions = []
    
    print(f"Found {len(pdf_files)} PDF files.")

    # Regex for start of transaction: Date Date Description...
    start_pattern = re.compile(r'^(\d{2}/\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+(.*)')
    
    # Regex for end of transaction: ... Amount Balance
    # French number format: 1 234,56 or 1234,56 or 123,45.
    # We use non-greedy matching for the spaces inside the number.
    # Structure: (Number) spaces (Number) end
    # Number Regex: \d{1,3}(?: ?\d{3})*,\d{2}
    # Note: Use \s to match non-breaking spaces often found in PDFs.
    
    number_re = r'\d{1,3}(?:[\s]?\d{3})*,\d{2}'
    end_pattern = re.compile(rf'({number_re})\s+({number_re})$')

    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        print(f"Processing {filename}...")
        
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                full_text = ""
                for page in reader.pages:
                    full_text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            continue

        lines = full_text.split('\n')
        
        # Try to find initial balance
        current_balance = None
        for line in lines:
            if "Solde Précédent" in line:
                try:
                    parts = line.split("Solde Précédent")
                    if len(parts) > 1:
                        # Might be followed by dates if on same line, or just number
                        # "Solde Précédent 397 426,77"
                        # Clean up any trailing text if needed? Usually it is just the number.
                        # Check if regex matches number
                        bal_str = parts[1].strip().split(' ')[0] # naive, might fail if space in number
                        # better: use regex to find the number in remainder
                        bal_match = re.search(r'([\d\s]+,\d{2})', parts[1])
                        if bal_match:
                            current_balance = parse_amount(bal_match.group(1))
                            print(f"  Initial Balance: {current_balance:,.2f}")
                            break
                except:
                    pass
        
        # State machine
        current_tx = None
        
        for line_idx, line in enumerate(lines):
            line = line.strip()
            if not line: continue
            
            # Check for start of new tx
            start_match = start_pattern.match(line)
            if start_match:
                # If we were already in a tx and didn't find amounts, we have to decide.
                # Usually means we missed the end of previous one.
                if current_tx:
                    pass # Or handle error?
                
                # Check for inline end
                end_match_inline = end_pattern.search(line)
                if end_match_inline:
                    amount_str = end_match_inline.group(1)
                    balance_str = end_match_inline.group(2)
                    desc = start_match.group(3)
                    # Remove amounts from desc if they were captured
                    desc = desc.replace(amount_str, '').replace(balance_str, '').strip()
                    
                    current_tx = {
                        'Date': start_match.group(1),
                        'Value Date': start_match.group(2),
                        'Description': desc,
                        'AmountStr': amount_str,
                        'BalanceStr': balance_str
                    }
                    _process_tx(current_tx, current_balance, all_transactions, filename)
                    new_bal = parse_amount(current_tx['BalanceStr'])
                    current_balance = new_bal
                    current_tx = None
                    continue
                else:
                    current_tx = {
                        'Date': start_match.group(1),
                        'Value Date': start_match.group(2),
                        'Description': start_match.group(3)
                    }
                    continue

            # If inside a transaction, check if this line is the end (amounts)
            if current_tx:
                end_match = end_pattern.search(line)
                if end_match:
                    amount_str = end_match.group(1)
                    balance_str = end_match.group(2)
                    
                    # Add current line text to description (excluding the amounts)
                    line_text = line[:end_match.start()].strip()
                    current_tx['Description'] += " " + line_text
                    current_tx['AmountStr'] = amount_str
                    current_tx['BalanceStr'] = balance_str
                    
                    _process_tx(current_tx, current_balance, all_transactions, filename)
                    current_balance = parse_amount(balance_str)
                    current_tx = None
                else:
                    # just description text
                    current_tx['Description'] += " " + line

    # Categorize all transactions
    for tx in all_transactions:
        tx['Category'] = categorize_transaction(tx)

    # Write to CSV
    if not all_transactions:
        print("No transactions found!")
        return

    keys = ['Date', 'Value Date', 'Description', 'Category', 'Debit', 'Credit', 'Balance', 'SourceFile']
    output_file = 'unified_bank_data.csv'
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(all_transactions)
        
    print(f"Successfully wrote {len(all_transactions)} transactions to {output_file}")

    # Also write JSON for Dashboard
    import json
    json_path = 'data.js'
    with open(json_path, 'w', encoding='utf-8') as f:
        json_data = json.dumps(all_transactions, ensure_ascii=False)
        f.write(f"window.bankData = {json_data};")
    print(f"Successfully wrote data to {json_path}")

def _process_tx(tx, current_balance, all_transactions, filename):
    amount = parse_amount(tx['AmountStr'])
    new_balance = parse_amount(tx['BalanceStr'])
    
    debit = 0.0
    credit = 0.0
    
    # Heuristic: Difference
    if current_balance is not None:
        diff = new_balance - current_balance
        if abs(diff + amount) < 1.0: # Close enough
            debit = amount
        elif abs(diff - amount) < 1.0:
            credit = amount
        else:
            # Fallback: if new < old, likely debit
            if new_balance < current_balance:
                debit = amount
            else:
                credit = amount
    else:
        # Fallback Keywords
        desc = tx['Description'].lower()
        if any(x in desc for x in ["db ","retrait","frais","tva","transfer to wallet"]):
            debit = amount
        else:
            credit = amount # Risky default?
    
    all_transactions.append({
        'Date': tx['Date'],
        'Value Date': tx['Value Date'],
        'Description': tx['Description'].strip(),
        'Debit': debit if debit > 0 else '',
        'Credit': credit if credit > 0 else '',
        'Balance': new_balance,
        'SourceFile': filename
    })

if __name__ == "__main__":
    process_pdfs('.')
