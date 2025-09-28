from playwright.sync_api import sync_playwright
import os

OUT_DIR = 'screenshots'
URL = 'http://localhost:8000'

os.makedirs(OUT_DIR, exist_ok=True)

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    context = browser.new_context()

    # Desktop
    page = context.new_page()
    page.set_viewport_size({"width":1366, "height":768})
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(OUT_DIR, 'desktop_1366x768.png'), full_page=True)
    page.close()

    # Tablet
    page = context.new_page()
    page.set_viewport_size({"width":768, "height":1024})
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(OUT_DIR, 'tablet_768x1024.png'), full_page=True)
    page.close()

    # Mobile
    page = context.new_page()
    page.set_viewport_size({"width":375, "height":812})
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(OUT_DIR, 'mobile_375x812.png'), full_page=True)
    page.close()

    browser.close()

print('Screenshots captured to', OUT_DIR)
