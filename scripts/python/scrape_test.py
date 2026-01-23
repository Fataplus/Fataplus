from facebook_scraper import get_posts
import datetime
import json

def serialize_datetime(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

posts = []
print("Scraping posts...")
try:
    for post in get_posts('mg.fataplus', pages=3, options={'comments': False}):
        print(f"Found post: {post.get('time')} - {post.get('text')[:50]}...")
        if post.get('time') and post['time'].year == 2025:
            posts.append(post)
        elif post.get('time') and post['time'].year < 2025:
            # We went back far enough
            pass 
            # Note: Facebook posts aren't always strictly chronological, so catching a few older ones is fine.
            # But normally we stop if we see 2024. However, pinned posts complicate this.
            # For now, just scrape 3 pages.
except Exception as e:
    print(f"Error: {e}")

print(f"Found {len(posts)} posts from 2025.")
with open('fb_posts_2025.json', 'w') as f:
    json.dump(posts, f, default=serialize_datetime, indent=2)
