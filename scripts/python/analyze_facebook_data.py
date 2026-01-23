import csv
import re
from datetime import datetime

file_path = '/Users/fefe/Documents/Fataplus/temp_scraper/facebookdata.csv'

def parse_date(date_str):
    # Example: "Publiée • 30 sept. 2025" or "Crossposté • 14 juil. 2025"
    # Removing "Publiée • " or "Crossposté • "
    clean_date = re.sub(r'^(Publiée|Crossposté).*?•\s*', '', date_str).strip()
    
    # French month mapping
    months = {
        'janv.': '01', 'févr.': '02', 'mars': '03', 'avr.': '04', 'mai': '05', 'juin': '06',
        'juil.': '07', 'août': '08', 'sept.': '09', 'oct.': '10', 'nov.': '11', 'déc.': '12'
    }
    
    for name, num in months.items():
        if name in clean_date:
            clean_date = clean_date.replace(name, num)
            break
            
    try:
        # Try parsing "30 09 2025"
        return datetime.strptime(clean_date, "%d %m %Y").strftime("%Y-%m-%d")
    except ValueError:
        return date_str

def safe_int(val):
    try:
        # Handle "1 788" -> 1788
        return int(val.replace('\u202f', '').replace(' ', ''))
    except (ValueError, AttributeError):
        return 0

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        # It seems to be tab delimited based on the preview
        reader = csv.reader(f, delimiter='\t')
        header = next(reader)
        
        posts = []
        for row in reader:
            if not row: continue
            
            # Handling rows with potential varying lengths
            if len(row) < 6: continue
            
            post = {
                'url': row[0],
                'text': row[1][:100] + '...' if len(row[1]) > 100 else row[1],
                'date_raw': row[4],
                'date': parse_date(row[4]),
                'reaction_count': safe_int(row[5]) if len(row) > 5 else 0,
                'comment_count': safe_int(row[7]) if len(row) > 7 else 0,
                'share_count': safe_int(row[9]) if len(row) > 9 else 0
            }
            posts.append(post)

    import json
    with open('social_media_archive.json', 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(posts)} posts to social_media_archive.json")
    print("-" * 50)
    
    # Sort by date if possible
    posts.sort(key=lambda x: x['date'], reverse=True)
    
    total_reactions = sum(p['reaction_count'] for p in posts)
    
    print(f"Total Reactions: {total_reactions}")
    print(f"Date Range: {posts[-1]['date']} to {posts[0]['date']}\n")
    
    print("Latest 5 Posts:")
    for p in posts[:5]:
        print(f"[{p['date']}] Reacs: {p['reaction_count']} | {p['text'].replace(chr(10), ' ')}")

except Exception as e:
    print(f"Error analyzing file: {e}")
