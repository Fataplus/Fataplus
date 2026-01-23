#!/bin/bash
# Fataplus Migration Rollback Script
# Generated: 2026-01-15
# Run this script to undo the folder reorganization

set -e
cd /Users/fefe/Documents/Fataplus

echo "Starting rollback..."

# Phase 1: Restore Applications
mv apps/web/agency-web Agency-Web
mv apps/web/fataplus-os fataplus-os
mv apps/tools/facebook-scraper temp_scraper
mv apps/tools/master-dashboard Fataplus-Master-Dashboard

# Phase 2: Restore Repositories
mkdir -p Repos
mv apps/mobile/tsena-ny-tantsaha "Repos/Fataplus---Tsena-ny-tantsaha"
# Note: Original repos structure was lost - manual restore may be needed

# Phase 3: Restore Documentation
mv docs/business fataplus
mv docs/proposals CodeAndScale
mkdir -p Facturation
mv docs/financial/invoices/* Facturation/
mv docs/justifications Documents

# Phase 4: Restore Data
mv data/banking "Bank docs"
mv data/social/fb_posts_2025.json .
mv data/social/social_media_archive.json .
mv data/exports/all_git_logs_2025.txt .

# Phase 5: Restore Scripts
mv scripts/python/analyze_facebook_data.py .
mv scripts/python/calculate_kpi.py .
mv scripts/python/scrape_facebook.py .
mv scripts/python/scrape_test.py .
mv scripts/python/clone_repos.py .
mv scripts/python/extract_logs.py .

# Phase 6: Restore Resources
mv resources Resources

# Phase 7: Restore docs folder
mkdir -p docs
mv docs/strategy/* docs/ 2>/dev/null

# Clean up empty directories
rm -rf apps repos archive scripts resources data/exports data/social data/banking

echo "Rollback complete!"
echo "Note: Some manual restoration may be required for the Repos directory."
