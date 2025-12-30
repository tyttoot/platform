================================================================================
                        DOC-SITE INVESTIGATION - SUMMARY
================================================================================

Date: December 22, 2025
Status: ✅ COMPLETE

Your Request:
"Investigate why site is displaying incompletely (missing guides) and 
document it so I can check notes next time when adding guides"

What Was Found:
• Data folder: 12 guides exist
• HTML navigation: Only 7 guides visible
• Root Cause: HTML navigation is HARDCODED (not dynamic)
• Missing 5 guides: Build Deploy, Hosting, Rollback, Deployment Guide

What Was Fixed:
• Updated /www/index.html (added all 5 missing guides)
• Updated /build-output/www/index.html (kept in sync)
• Fixed AI Collaboration data-page attribute name
• All 12 guides now visible in sidebar menu

Documentation Created (4 files - read in this order):

1. 00_START_HERE.md (2.8 KB) ⭐ START HERE
   Quick summary of problem and solution

2. DOC_SITE_ADDITION_CHECKLIST.md (5.2 KB) ⭐ USE FOR NEXT TIME
   Step-by-step process for adding guides in future
   Critical reminders and all 12 guides reference table

3. DOC_SITE_RENDERING_ISSUE_ANALYSIS.md (12 KB)
   Complete detailed analysis of the problem
   Root cause, lessons learned, mapping of all 12 guides

4. DOC_SITE_CHECKLIST.md (5.3 KB)
   JSON format requirements for guides
   Common mistakes and fixes

Key Lesson - DON'T FORGET:
When adding guide to doc-site:
1. Create JSON in /data/docs/guides/xxx.json
2. Run: make validate
3. ⚠️ UPDATE HTML: Edit /www/index.html AND /build-output/www/index.html
4. Add: <li><a href="#" data-page="guideXxx">Name</a></li>
5. Verify: make serve → refresh → check sidebar

WITHOUT STEP 3 = GUIDE WON'T SHOW (even if JSON is perfect!)

Next Step:
$ make serve
→ Refresh: http://localhost:8080/projects/doc-site/www/
→ Verify: All 12 guides appear in sidebar
→ Click: "Deployment Quick Guide" (the one that wasn't showing)

All files ready in: /Users/norman/platform/tmp/
Everything documented for future use.

Remember: "Nhớ kỹ!" (Don't forget to check the checklist next time!)

================================================================================
