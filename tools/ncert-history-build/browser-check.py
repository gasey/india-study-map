"""Small local Chrome DevTools check for the NCERT History interaction path."""
import base64, json, os, socket, struct, time, urllib.request

pages=json.load(urllib.request.urlopen('http://127.0.0.1:9222/json',timeout=10))
page=next(p for p in pages if p.get('type')=='page' and '/ncert-history' in p.get('url',''))
url=page['webSocketDebuggerUrl'];host='127.0.0.1';port=9222;path=url.split(f'{host}:{port}',1)[1]
s=socket.create_connection((host,port),timeout=10)
key=base64.b64encode(os.urandom(16)).decode()
s.sendall((f'GET {path} HTTP/1.1\r\nHost: {host}:{port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\nOrigin: http://127.0.0.1:9222\r\n\r\n').encode())
head=b''
while b'\r\n\r\n' not in head:head+=s.recv(4096)
assert b'HTTP/1.1 101' in head,head[:300]

def exact(n):
    b=b''
    while len(b)<n:
        chunk=s.recv(n-len(b))
        if not chunk:raise RuntimeError('Browser closed')
        b+=chunk
    return b

def send(obj):
    data=json.dumps(obj).encode();mask=os.urandom(4);n=len(data)
    hdr=bytes([0x81,0x80 | n]) if n<126 else bytes([0x81,0x80 | 126])+struct.pack('!H',n)
    s.sendall(hdr+mask+bytes(byte^mask[i%4] for i,byte in enumerate(data)))

def recv():
    h=exact(2);n=h[1]&127
    if n==126:n=struct.unpack('!H',exact(2))[0]
    if n==127:n=struct.unpack('!Q',exact(8))[0]
    mask=exact(4) if h[1]&128 else None
    data=exact(n)
    if mask:data=bytes(byte^mask[i%4] for i,byte in enumerate(data))
    return json.loads(data)

serial=0
def command(method, params):
    global serial
    serial+=1;send({'id':serial,'method':method,'params':params})
    while True:
        msg=recv()
        if msg.get('id')==serial:
            if 'error' in msg:raise RuntimeError(msg['error'])
            return msg.get('result',{})
def evaluate(js):
    result=command('Runtime.evaluate',{'expression':js,'returnByValue':True})
    if 'exceptionDetails' in result:raise RuntimeError(result['exceptionDetails'])
    return result['result'].get('value')

command('Emulation.setDeviceMetricsOverride',{'width':390,'height':900,'deviceScaleFactor':1,'mobile':True})
evaluate('location.reload()')
for _ in range(20):
    time.sleep(.2)
    if evaluate("document.querySelectorAll('.nh-list>.nh-card').length") == 80:break
assert evaluate("document.body.innerText.includes('80') && document.body.innerText.includes('History MCQ Practice')")
assert evaluate("document.querySelectorAll('.nh-list>.nh-question-card').length") == 80
assert evaluate("document.querySelector('.ncert-history').getBoundingClientRect().width <= window.innerWidth")
print('Mobile geometry:',evaluate("({viewport:innerWidth,body:document.body.scrollWidth,page:document.querySelector('.ncert-history').getBoundingClientRect().width})"))
assert evaluate("document.body.scrollWidth <= innerWidth")
assert evaluate("document.querySelector('.clb-section')?.dataset.tab === 'ncert'")
assert evaluate('document.querySelector(".mobile-bottom-bar a[href=\'/ncert-history\']")?.getAttribute("aria-current") === "page"')
assert evaluate("!document.querySelector('.clb-section[data-tab=bank]')")
assert evaluate("document.querySelector('.ncert-history').scrollHeight > document.querySelector('.ncert-history').clientHeight")
assert evaluate("(document.querySelector('.ncert-history').scrollTop = 500) > 0")
assert evaluate("document.querySelector('.ncert-history').scrollTop > 0")
evaluate("document.querySelector('.nh-list>.nh-question-card').scrollIntoView({block:'start'})")
assert evaluate("document.querySelector('.nh-list>.nh-question-card .nh-options button') !== null")
with open('/tmp/ncert-history-mobile-check.png','wb') as image:
    image.write(base64.b64decode(command('Page.captureScreenshot',{'format':'png'})['data']))
evaluate("document.querySelector('.nh-list>.nh-question-card .nh-options button').click()")
assert evaluate("!!document.querySelector('.nh-list>.nh-question-card .nh-feedback')")
assert evaluate("document.querySelector('.nh-list>.nh-question-card .nh-feedback a')?.href.includes('ncert.nic.in')")
evaluate("document.querySelectorAll('.nh-tabs button')[1].click()")
assert evaluate("document.body.innerText.includes('80 matching questions')")
evaluate("document.querySelector('.nh-list-heading button').click()")
assert evaluate("document.body.innerText.includes('QUESTION 1 OF 10')")
evaluate("document.querySelector('.nh-options button').click()")
assert evaluate("!!document.querySelector('.nh-feedback')")
assert evaluate("document.querySelector('.nh-feedback a')?.href.includes('ncert.nic.in')")
evaluate("document.querySelector('.nh-feedback .nh-actions button').click()")
assert evaluate("document.body.innerText.includes('QUESTION 2 OF 10')")
command('Emulation.setDeviceMetricsOverride',{'width':1024,'height':768,'deviceScaleFactor':1,'mobile':False})
time.sleep(.2)
print('Desktop geometry:',evaluate("({viewport:innerWidth,body:document.body.scrollWidth,header:document.querySelector('.app-header').scrollWidth,tabs:document.querySelector('.app-header .clb-tabs').getBoundingClientRect().width})"))
assert evaluate("document.querySelector('.app-header .clb-tab[href=\"/ncert-history\"]')?.getAttribute('aria-current') === 'page'")
assert evaluate("document.body.scrollWidth <= innerWidth")
print('Browser passed: separate NCERT tab, vertical scroll, browse, quiz, feedback, source link, next question and desktop layout.')
s.close()
