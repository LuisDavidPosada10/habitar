import sys
from playwright.sync_api import sync_playwright
url=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(channel='msedge'); pg=b.new_page(viewport={'width':480,'height':800},device_scale_factor=2)
    pg.goto(url); pg.wait_for_timeout(1500)
    pg.screenshot(path='scratch/s3.png',full_page=True)
    print(pg.evaluate("""()=>{const root=document.querySelector('h1').closest('div');const rr=root.getBoundingClientRect();const k=rr.width/941;const o=[];
    root.querySelectorAll('h1,p,a span').forEach(e=>{if(e.children.length&&e.tagName!=='H1'&&e.tagName!=='P'&&!e.className.includes('f-'))return;const r=document.createRange();r.selectNodeContents(e);const b=r.getBoundingClientRect();if(!b.width)return;o.push([e.textContent.slice(0,16),Math.round((b.left-rr.left)/k),Math.round((b.right-rr.left)/k),Math.round((b.top-rr.top)/k)])});return o}"""))
    for w,h in [(360,780),(390,844),(393,852),(412,915),(430,932)]:
        pg.set_viewport_size({'width':w,'height':h}); pg.wait_for_timeout(200)
        print(w,h,pg.evaluate("document.documentElement.scrollHeight-innerHeight"))
    b.close()
