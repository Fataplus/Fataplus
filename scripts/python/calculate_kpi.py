import re
from collections import defaultdict
from datetime import datetime

def parse_amount(amount_str):
    if not amount_str or amount_str.strip() == '-':
        return 0.0
    # Clean string: remove " Ar", replace "," with "" if it's thousands separator? 
    # The format in the file is like "1,068,048.02", "16,384.00"
    # Actually looking at the file: "1,068,048.02" -> 
    # French format? No, looks like "1 068 048,02" or "1,068,048.02"
    # In the file snippet: "1,068,048.02 Ar" -> Remove " Ar"
    # Wait, check step 15 output: "| 11/11/2025 | ... | 60,000,00 |"
    # It seems to be "60,000,00" -> This is ambiguous. Is it 60k?
    # "60,000,00" -> comma might be decimal separator if it ends with ,00? 
    # But "1,068,048.02" uses dot.
    
    # Let's look at a clear line: "| 08-Dec-2025 | ... | 1,500,00 |" -> 1500.00?
    # "| 16/04/2025 | ... | 170,000,00 |" -> 170,000.00
    # It seems key is to remove commas that are thousands separators.
    # But wait, "60,000,00" has a comma at the end.
    
    clean = amount_str.replace(' Ar', '').strip()
    
    # Heuristic: replace ',' with '.' if it is the last punctuation and followed by 2 digits
    # But "1,068,048.02" has dot.
    
    # Let's try checking if there is a dot.
    if '.' in clean:
        # American format: 1,000.00 -> remove comma
        return float(clean.replace(',', ''))
    else:
        # Maybe French style "1 000,00" or just "1000,00"?
        # "60,000,00" -> This is weird. 60,000.00?
        # Let's assume it's "1,234.56" format but sometimes with ',' as decimal?
        # Actually in the snippet: "60,000,00" -> probably 60000.00
        # "1,500,00" -> 1500.00
        # "268,962.00" -> has dot.
        
        # Strategy: Replace all ',' with '' EXCEPT the last one if it is followed by exactly 2 digits?
        # Or just replace all ',' with '.'? No.
        
        # Let's normalize: 
        # If string contains '.', assume '.' is decimal. Remove ','
        # If string does NOT contain '.', assume ',' is decimal IF it's at the end.
        pass

    # Re-reading Step 15 carefully:
    # Line 24: "60,000,00" -> Comma as decimal? No, 60k is likely an integer amount.
    # Line 26: "566,804,90" -> 566k or 566? 
    # Line 9: "1,068,048.02 Ar" -> Has dot.
    # Line 24: "60,000,00" -> Has only commas.
    
    # Hypothesis: The file has mixed formats.
    # 1. "X,XXX.YY"
    # 2. "X,XXX,YY" (common in some exports)
    
    if '.' in clean:
        return float(clean.replace(',', ''))
    else:
        # Replace last comma with dot
        parts = clean.rsplit(',', 1)
        if len(parts) == 2:
            return float(parts[0].replace(',', '') + '.' + parts[1])
        else:
            return float(clean.replace(',', ''))

def get_quarter(date_obj):
    return (date_obj.month - 1) // 3 + 1

def parse_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Split by headers
    sections = content.split('### ')
    
    data = defaultdict(lambda: {'revenu': 0.0, 'infra': 0.0})
    
    for section in sections:
        lines = section.split('\n')
        title = lines[0].strip()
        
        is_revenu = "Revenus & Entrées" in title
        is_infra = "Infrastructure & Outils" in title
        
        if not (is_revenu or is_infra):
            continue
            
        print(f"Processing section: {title}")
        
        for line in lines:
            if not line.strip().startswith('|'): continue
            if 'Date' in line or '---' in line: continue
            
            parts = [p.strip() for p in line.split('|')]
            if len(parts) < 5: continue
            
            date_str = parts[1]
            if date_str == 'nan': continue
            
            # Parse Date
            try:
                # Formats: 11/11/2025, 11-Nov-2025
                if '-' in date_str:
                    try:
                        dt = datetime.strptime(date_str, "%d-%b-%Y")
                    except:
                        # French months?
                        dt = datetime.strptime(date_str, "%d-%m-%Y") # Fallback
                else:
                    dt = datetime.strptime(date_str, "%d/%m/%Y")
            except Exception as e:
                # print(f"Error parsing date {date_str}: {e}")
                continue
                
            if dt.year != 2025: continue
            
            debit = parse_amount(parts[3])
            credit = parse_amount(parts[4])
            
            q = get_quarter(dt)
            
            if is_revenu:
                data[q]['revenu'] += credit
            if is_infra:
                data[q]['infra'] += debit

    return data

results = parse_file('/Users/fefe/Documents/Fataplus/Documentation/docs/rapport_financier.md')

print("\n## Résultats 2025")
for q in sorted(results.keys()):
    vals = results[q]
    print(f"Q{q}: Revenue={vals['revenu']:,.2f} Ar, Infra={vals['infra']:,.2f} Ar")

