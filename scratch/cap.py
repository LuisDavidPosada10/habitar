import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(channel='msedge'); pg=b.new_page(viewport={'width':480,'height':1100},device_scale_factor=2)
    pg.goto('http://localhost:5199/mon-1'); pg.wait_for_timeout(1200)
    pg.screenshot(path='scratch/s1.png',full_page=True)
    r=pg.evaluate("""()=>{const k=document.querySelector('h1').closest('div').getBoundingClientRect().width/941;const o={};
    const rg=(el)=>{const r=document.createRange();r.selectNodeContents(el);const b=r.getBoundingClientRect();return [Math.round(b.left/k),Math.round(b.right/k)]};
    o.title=rg(document.querySelector('h1'));document.querySelectorAll('p').forEach((e,i)=>o['p'+i]=rg(e));o.scroll=document.documentElement.scrollHeight;return o}""")
    print(r)
    for w,h in [(360,780),(390,844),(393,852),(412,915),(430,932)]:
        pg.set_viewport_size({'width':w,'height':h}); pg.wait_for_timeout(200)
        print(w,h,pg.evaluate("document.documentElement.scrollHeight-innerHeight"))
    b.close()
