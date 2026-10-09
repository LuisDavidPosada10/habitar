import sys
from playwright.sync_api import sync_playwright
url=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(channel='msedge'); pg=b.new_page(viewport={'width':480,'height':800},device_scale_factor=2)
    pg.goto(url); pg.wait_for_timeout(1500)
    pg.screenshot(path='scratch/s2.png',full_page=True)
    print(pg.evaluate("""()=>{const root=document.querySelector('h1').closest('div');const k=root.getBoundingClientRect().width/941;const o=[];
    root.querySelectorAll('h1,p').forEach(e=>{const r=document.createRange();r.selectNodeContents(e);const b=r.getBoundingClientRect();o.push([e.textContent.slice(0,14),Math.round(b.left/k),Math.round(b.right/k),Math.round((b.top-root.getBoundingClientRect().top)/k),Math.round((b.bottom-root.getBoundingClientRect().top)/k)])});return o}"""))
    for w,h in [(360,780),(390,844),(393,852),(412,915),(430,932)]:
        pg.set_viewport_size({'width':w,'height':h}); pg.wait_for_timeout(200)
        print(w,h,pg.evaluate("document.documentElement.scrollHeight-innerHeight"))
    b.close()
