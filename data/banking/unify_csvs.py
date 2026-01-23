#!/usr/bin/env python3
"""
Unify all CSV files into a single CSV and generate a markdown summary.
"""
import csv
import os
import glob
from pathlib import Path
from datetime import datetime
from collections import defaultdict


def parse_amount(amount_str):
    """Parse amount string to float."""
    if not amount_str or amount_str == '':
        return 0.0
    clean_str = str(amount_str).replace(' ', '').replace(',', '.')
    try:
        return float(clean_str)
    except ValueError:
        return 0.0


def parse_date(date_str):
    """Parse date string DD/MM/YYYY."""
    try:
        parts = date_str.split('/')
        return f"{parts[2]}-{parts[1]}-{parts[0]}"  # YYYY-MM-DD
    except:
        return date_str


def categorize_transaction(row):
    """Categorize transaction based on description."""
    desc = row.get('Description', '').lower()
    debit = parse_amount(row.get('Débit', ''))
    credit = parse_amount(row.get('Crédit', ''))

    # Income categories
    if credit > 0:
        if 'mvola' in desc:
            return 'Mvola'
        elif 'riake' in desc:
            return 'Riake'
        elif 'refund' in desc or 'remboursement' in desc:
            return 'Remboursement'
        elif 'virement' in desc and 'entrant' in desc:
            return 'Virement entrant'
        return 'Autre revenu'

    # Expense categories
    if debit > 0:
        if 'mvola' in desc or 'transfer bank to wallet' in desc:
            return 'Mvola (sortie)'
        elif 'db ' in desc or 'carte' in desc:
            return 'Paiement carte'
        elif 'retrait' in desc:
            return 'Retrait'
        elif 'frais' in desc or 'tva' in desc:
            return 'Frais bancaires'
        elif 'prelev' in desc or 'prélèvement' in desc:
            return 'Prélèvement'
        elif 'virement' in desc:
            return 'Virement sortant'
        return 'Autre dépense'

    return 'Non catégorisé'


def load_all_csvs(input_dir):
    """Load all CSV files and return unified transactions."""
    all_transactions = []
    csv_files = sorted(glob.glob(os.path.join(input_dir, "*.csv")))

    for csv_path in csv_files:
        filename = os.path.basename(csv_path)
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if not row.get('Description'):
                        continue
                    row['Source'] = filename
                    row['Category'] = categorize_transaction(row)
                    all_transactions.append(row)
        except Exception as e:
            print(f"Error reading {filename}: {e}")

    # Sort by date
    all_transactions.sort(key=lambda x: parse_date(x.get('Date', '')))

    return all_transactions


def calculate_summary(transactions):
    """Calculate summary statistics."""
    summary = {
        'total_transactions': len(transactions),
        'total_debit': 0.0,
        'total_credit': 0.0,
        'net_balance': 0.0,
        'by_category': defaultdict(lambda: {'debit': 0.0, 'credit': 0.0, 'count': 0}),
        'by_month': defaultdict(lambda: {'debit': 0.0, 'credit': 0.0, 'count': 0}),
        'by_source': defaultdict(lambda: {'count': 0, 'debit': 0.0, 'credit': 0.0}),
    }

    for tx in transactions:
        debit = parse_amount(tx.get('Débit', ''))
        credit = parse_amount(tx.get('Crédit', ''))
        category = tx.get('Category', 'Non catégorisé')
        source = tx.get('Source', 'Unknown')

        # Totals
        summary['total_debit'] += debit
        summary['total_credit'] += credit
        summary['net_balance'] += (credit - debit)

        # By category
        summary['by_category'][category]['debit'] += debit
        summary['by_category'][category]['credit'] += credit
        summary['by_category'][category]['count'] += 1

        # By month
        try:
            date_parts = tx.get('Date', '').split('/')
            if len(date_parts) == 3:
                month_key = f"{date_parts[2]}-{date_parts[1]}"  # YYYY-MM
                summary['by_month'][month_key]['debit'] += debit
                summary['by_month'][month_key]['credit'] += credit
                summary['by_month'][month_key]['count'] += 1
        except:
            pass

        # By source
        summary['by_source'][source]['count'] += 1
        summary['by_source'][source]['debit'] += debit
        summary['by_source'][source]['credit'] += credit

    # Final balance from last transaction
    if transactions:
        last_balance = parse_amount(transactions[-1].get('Solde', '0'))
        summary['final_balance'] = last_balance

    return summary


def write_unified_csv(transactions, output_path):
    """Write unified transactions to CSV."""
    if not transactions:
        print("No transactions to write!")
        return

    keys = ['Date', 'Date de valeur', 'Description', 'Category', 'Débit', 'Crédit', 'Solde', 'Source']

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(transactions)

    print(f"Unified CSV written: {output_path} ({len(transactions)} transactions)")


def write_markdown_summary(transactions, summary, output_path):
    """Write summary to markdown file."""
    lines = [
        "# Résumé des Transactions Bancaires MCB",
        "",
        f"*Généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}*",
        "",
        "## Vue d'ensemble",
        "",
        f"| Métrique | Valeur |",
        f"|----------|--------|",
        f"| **Total des transactions** | {summary['total_transactions']:,} |",
        f"| **Total des débits** | {summary['total_debit']:,.2f} MGA |",
        f"| **Total des crédits** | {summary['total_credit']:,.2f} MGA |",
        f"| **Solde net** | {summary['net_balance']:,.2f} MGA |",
    ]

    if 'final_balance' in summary:
        lines.append(f"| **Solde final** | {summary['final_balance']:,.2f} MGA |")

    lines.extend([
        "",
        "## Par catégorie",
        "",
        "| Catégorie | Débits | Crédits | Nb. transactions |",
        "|-----------|--------|---------|-------------------|",
    ])

    # Sort by total amount
    sorted_categories = sorted(
        summary['by_category'].items(),
        key=lambda x: x[1]['debit'] + x[1]['credit'],
        reverse=True
    )

    for category, data in sorted_categories:
        lines.append(f"| {category} | {data['debit']:,.2f} | {data['credit']:,.2f} | {data['count']} |")

    lines.extend([
        "",
        "## Par mois",
        "",
        "| Mois | Débits | Crédits | Nb. transactions | Solde |",
        "|------|--------|---------|-------------------|-------|",
    ])

    for month in sorted(summary['by_month'].keys()):
        data = summary['by_month'][month]
        balance = data['credit'] - data['debit']
        lines.append(f"| {month} | {data['debit']:,.2f} | {data['credit']:,.2f} | {data['count']} | {balance:,.2f} |")

    lines.extend([
        "",
        "## Par fichier source",
        "",
        "| Fichier | Transactions | Débits | Crédits |",
        "|---------|--------------|--------|---------|",
    ])

    for source in sorted(summary['by_source'].keys()):
        data = summary['by_source'][source]
        lines.append(f"| {source} | {data['count']} | {data['debit']:,.2f} | {data['credit']:,.2f} |")

    lines.extend([
        "",
        "## Dernières transactions",
        "",
        "| Date | Description | Catégorie | Débit | Crédit | Solde |",
        "|------|-------------|-----------|-------|--------|-------|",
    ])

    # Show last 10 transactions
    for tx in transactions[-10:]:
        date = tx.get('Date', '')
        desc = tx.get('Description', '')[:40]
        category = tx.get('Category', '')
        debit = tx.get('Débit', '')
        credit = tx.get('Crédit', '')
        balance = tx.get('Solde', '')
        lines.append(f"| {date} | {desc} | {category} | {debit} | {credit} | {balance} |")

    lines.extend([
        "",
        "---",
        "",
        f"*Source: {len(summary['by_source'])} fichiers CSV consolidés*",
    ])

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"Summary written: {output_path}")


def main():
    """Main function."""
    script_dir = Path(__file__).parent
    input_dir = script_dir / "converted_csvs"
    csv_output = script_dir / "unified_all_transactions.csv"
    md_output = script_dir / "SUMMARY.md"

    print("Loading CSV files...")
    transactions = load_all_csvs(input_dir)
    print(f"Loaded {len(transactions)} transactions")

    print("Calculating summary...")
    summary = calculate_summary(transactions)

    print("Writing unified CSV...")
    write_unified_csv(transactions, csv_output)

    print("Writing markdown summary...")
    write_markdown_summary(transactions, summary, md_output)

    print("\nDone!")
    print(f"  - Unified CSV: {csv_output}")
    print(f"  - Summary: {md_output}")


if __name__ == "__main__":
    main()
