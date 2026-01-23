from facebook_scraper import get_posts
import json
import datetime
import argparse

def default_converter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()

def scrape_page(page_name, limit=100):
    posts = []
    print(f"Scraping {page_name} (limit={limit})...")
    
    try:
        # options={'comments': True} can be added if needed, but it's slower
        for post in get_posts(page_name, pages=limit, options={'posts_per_page': 10}):
            post_date = post.get('time')
            print(f"Found post: {post_date} - {post.get('text')[:30]}...")
            if post_date and post_date.year == 2025:
                print(f"Keeping post from {post_date}")
                posts.append(post)
            elif post_date and post_date.year < 2025:
                # Assuming chronological order, we might stop here, 
                # but pinned posts can be old, so best to just filter or use a safer break condition
                pass 
                
            if len(posts) >= limit:
                break
                
    except Exception as e:
        print(f"Error scraping: {e}")

    return posts

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape Facebook Page')
    parser.add_argument('--page', type=str, default='mg.fataplus', help='Page name or ID')
    parser.add_argument('--limit', type=int, default=50, help='Max number of posts to scrape')
    parser.add_argument('--output', type=str, default='social_media_archive.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    scraped_data = scrape_page(args.page, args.limit)
    
    print(f"Scraped {len(scraped_data)} posts.")
    
    if scraped_data:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(scraped_data, f, indent=4, default=default_converter, ensure_ascii=False)
        print(f"Saved to {args.output}")
    else:
        print("No data found or scraped.")
