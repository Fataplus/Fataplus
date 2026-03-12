#!/usr/bin/env python3
"""
Export Bootcamp UX/UI lessons from D1 database to Markdown, PDF and Slides
"""

import json
import os
import subprocess
import re

# Cloudflare D1 config
API_TOKEN = "BetcgTXyF0AZxRxYKabrl56o188JGYf_SkKTbq6_"
ACCOUNT_ID = "f30dd0d409679ae65e841302cc0caa8c"
DB_ID = "1f53fc52-e528-45c6-ada2-1ec3394203d4"

OUTPUT_DIR = "/root/lex-workspace/projects/Fataplus/bootcamp/bootcamp-uxui-2026/lessons-md"
PDF_DIR = "/root/lex-workspace/projects/Fataplus/bootcamp/bootcamp-uxui-2026/lessons-pdf"
SLIDES_DIR = "/root/lex-workspace/projects/Fataplus/bootcamp/bootcamp-uxui-2026/lessons-slides"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PDF_DIR, exist_ok=True)
os.makedirs(SLIDES_DIR, exist_ok=True)

def fetch_lessons():
    """Fetch all lessons from D1 database"""
    cmd = 'cd /root/lex-workspace/projects/fataplus-lms && CLOUDFLARE_API_TOKEN="BetcgTXyF0AZxRxYKabrl56o188JGYf_SkKTbq6_" npx wrangler d1 execute fataplus-db --remote --command "SELECT l.id, l.slug, l.title, l.content, m.title as module_title FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = \'course-bootcamp-uxui-2026\' ORDER BY m.\\"order\\", l.\\"order\\\"" --json'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    data = json.loads(result.stdout)
    if isinstance(data, list) and len(data) > 0 and "results" in data[0]:
        return data[0]["results"]
    return []

def json_to_markdown(lesson):
    """Convert lesson JSON content to Markdown"""
    content = lesson.get("content", "[]")
    if isinstance(content, str):
        try:
            blocks = json.loads(content)
        except:
            blocks = []
    else:
        blocks = content
    
    md = f"# {lesson['title']}\n\n"
    md += f"**Module:** {lesson['module_title']}\n"
    md += f"**Slug:** {lesson['slug']}\n\n"
    md += "---\n\n"
    
    for block in blocks:
        block_type = block.get("type", "text")
        block_content = block.get("content", "")
        
        if block_type == "text":
            # Clean up escaped characters
            text = block_content.replace("\\n", "\n").replace("\\t", "\t")
            md += text + "\n\n"
        elif block_type == "quiz":
            quiz = block_content if isinstance(block_content, dict) else json.loads(block_content)
            md += f"## 📝 Quiz: {quiz.get('title', 'Quiz')}\n\n"
            for i, q in enumerate(quiz.get("questions", []), 1):
                md += f"**{i}.** {q.get('question', '')}\n\n"
                for j, opt in enumerate(q.get("options", [])):
                    marker = "✅" if j == q.get("correct") else "⬜"
                    md += f"   {marker} {opt}\n"
                md += "\n"
                if q.get("explanation"):
                    md += f"*{q.get('explanation')}*\n\n"
    
    return md

def main():
    print("🎓 Export Bootcamp UX/UI Lessons")
    print("=" * 50)
    
    # Fetch lessons
    lessons = fetch_lessons()
    print(f"📚 Found {len(lessons)} lessons")
    
    # Export each lesson
    for lesson in lessons:
        lesson_id = lesson["id"]
        title = lesson["title"]
        slug = lesson["slug"]
        
        # Create filename
        filename = f"{lesson_id}-{slug}.md"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Convert to markdown
        md_content = json_to_markdown(lesson)
        
        # Write markdown file
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md_content)
        
        print(f"  ✅ {lesson_id}: {title}")
        
        # Generate PDF with pandoc
        pdf_path = os.path.join(PDF_DIR, f"{lesson_id}-{slug}.pdf")
        try:
            subprocess.run([
                "pandoc", filepath,
                "-o", pdf_path,
                "--pdf-engine=wkhtmltopdf",
                "-V", "geometry:margin=2cm",
                "--metadata", f"title={title}"
            ], check=True, capture_output=True)
        except Exception as e:
            print(f"    ⚠️ PDF failed: {e}")
        
        # Generate slides with pandoc (reveal.js format)
        slides_path = os.path.join(SLIDES_DIR, f"{lesson_id}-{slug}-slides.html")
        try:
            subprocess.run([
                "pandoc", filepath,
                "-o", slides_path,
                "-t", "revealjs",
                "-s",
                "--metadata", f"title={title}"
            ], check=True, capture_output=True)
        except Exception as e:
            print(f"    ⚠️ Slides failed: {e}")
    
    print("\n" + "=" * 50)
    print(f"✅ Export complete!")
    print(f"  📂 Markdown: {OUTPUT_DIR}")
    print(f"  📄 PDF: {PDF_DIR}")
    print(f"  🎞 Slides: {SLIDES_DIR}")

if __name__ == "__main__":
    main()
