#!/usr/bin/env python3
"""
Convert MCB Bank Statement PDFs to individual CSV files.
"""
import PyPDF2
import re
import csv
import os
import glob
from pathlib import Path


def parse_amount(amount_str):
    """Parse French number format '10 000,00' to float."""
    if not amount_str:
        return 0.0
    clean_str = amount_str.replace(' ', '').replace(',', '.')
    try:
        return float(clean_str)
    except ValueError:
        return 0.0


def extract_transactions_from_pdf(pdf_path):
    """Extract transactions from a single PDF file."""
    transactions = []

    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            full_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
    except Exception as e:
        print(f"  Error reading PDF: {e}")
        return transactions

    lines = full_text.split('\n')

    # Patterns
    # Start: "DD/MM/YYYY DD/MM/YYYY Description"
    start_pattern = re.compile(r'^(\d{2}/\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+(.*)')

    # Number format: 1 234,56 or 1234,56 or 425,00
    # Handle non-breaking spaces (\u00A0) and regular spaces
    number_re = r'\d{1,3}(?:[\s\u00A0]?\d{3})*,\d{2}'

    # End: Amount Balance - at end of line or followed by more dates
    end_pattern = re.compile(rf'({number_re})\s+({number_re})(?:\s*$|\s+\d{{2}}/)')

    current_tx = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check for transaction start
        start_match = start_pattern.match(line)
        if start_match:
            # Look for amounts at the end of the line (from right to left)
            # We need to find the last two numbers that match the amount pattern
            remainder = start_match.group(3)

            # Find all number matches in the remainder
            all_numbers = list(re.finditer(number_re, remainder))

            if len(all_numbers) >= 2:
                # Take the last two as amount and balance
                amount_match = all_numbers[-2]
                balance_match = all_numbers[-1]

                # Description is everything before the amount
                desc = remainder[:amount_match.start()].strip()

                amount_str = amount_match.group()
                balance_str = balance_match.group()

                amount = parse_amount(amount_str)
                balance = parse_amount(balance_str)

                # Determine debit vs credit
                desc_lower = desc.lower()
                debit = credit = 0.0

                if any(x in desc_lower for x in ['db ', 'retrait', 'frais', 'tva', 'prelev', 'virement', 'mvola']):
                    debit = amount
                else:
                    credit = amount

                transactions.append({
                    'Date': start_match.group(1),
                    'Date de valeur': start_match.group(2),
                    'Description': desc,
                    'Débit': debit if debit > 0 else '',
                    'Crédit': credit if credit > 0 else '',
                    'Solde': balance
                })
                current_tx = None
                continue
            else:
                # Multi-line transaction start
                current_tx = {
                    'Date': start_match.group(1),
                    'Date de valeur': start_match.group(2),
                    'Description': remainder
                }
                continue

        # Check for end of multi-line transaction
        if current_tx:
            # Look for amounts at the end of the line
            all_numbers = list(re.finditer(number_re, line))

            if len(all_numbers) >= 2:
                # Take the last two as amount and balance
                amount_match = all_numbers[-2]
                balance_match = all_numbers[-1]

                # Add any text before amounts to description
                line_text = line[:amount_match.start()].strip()
                if line_text and line_text not in current_tx['Description']:
                    current_tx['Description'] += " " + line_text

                amount_str = amount_match.group()
                balance_str = balance_match.group()

                amount = parse_amount(amount_str)
                balance = parse_amount(balance_str)

                desc_lower = current_tx['Description'].lower()
                debit = credit = 0.0

                if any(x in desc_lower for x in ['db ', 'retrait', 'frais', 'tva', 'prelev', 'virement', 'mvola']):
                    debit = amount
                else:
                    credit = amount

                transactions.append({
                    'Date': current_tx['Date'],
                    'Date de valeur': current_tx['Date de valeur'],
                    'Description': current_tx['Description'].strip(),
                    'Débit': debit if debit > 0 else '',
                    'Crédit': credit if credit > 0 else '',
                    'Solde': balance
                })
                current_tx = None
            else:
                # Continuation of description
                if line not in current_tx['Description']:
                    current_tx['Description'] += " " + line

    return transactions


def convert_pdf_to_csv(pdf_path, output_dir):
    """Convert a single PDF to CSV."""
    filename = os.path.basename(pdf_path)
    csv_name = os.path.splitext(filename)[0] + '.csv'
    csv_path = os.path.join(output_dir, csv_name)

    transactions = extract_transactions_from_pdf(pdf_path)

    if not transactions:
        print(f"  No transactions found in {filename}")
        return False

    keys = ['Date', 'Date de valeur', 'Description', 'Débit', 'Crédit', 'Solde']

    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(transactions)

    print(f"  Converted {filename} -> {csv_name} ({len(transactions)} transactions)")
    return True


def main():
    """Convert all PDFs to CSVs."""
    script_dir = Path(__file__).parent
    pdf_dir = script_dir
    output_dir = script_dir / "converted_csvs"

    # Create output directory if it doesn't exist
    output_dir.mkdir(exist_ok=True)

    # Get all PDF files
    pdf_files = sorted(glob.glob(os.path.join(pdf_dir, "*.pdf")))

    # Filter out already converted files
    remaining_pdfs = []
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        csv_name = os.path.splitext(filename)[0] + '.csv'
        csv_path = os.path.join(output_dir, csv_name)

        if not os.path.exists(csv_path):
            remaining_pdfs.append(pdf_path)

    print(f"Found {len(remaining_pdfs)} PDFs to convert (out of {len(pdf_files)} total)")

    success_count = 0
    for pdf_path in remaining_pdfs:
        filename = os.path.basename(pdf_path)
        print(f"Processing {filename}...")
        if convert_pdf_to_csv(pdf_path, output_dir):
            success_count += 1

    print(f"\nDone! Converted {success_count}/{len(remaining_pdfs)} files")


if __name__ == "__main__":
    main()
