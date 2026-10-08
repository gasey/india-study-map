"""Check the Group B library, key comparison, recovered figures and marking."""
import base64
import json
import os
import socket
import struct
import time
import urllib.request

pages = json.load(urllib.request.urlopen('http://127.0.0.1:9222/json', timeout=10))
page = next(p for p in pages if p.get('type') == 'page' and '/udc-ldc' in p.get('url', ''))
path = page['webSocketDebuggerUrl'].split('127.0.0.1:9222', 1)[1]
s = socket.create_connection(('127.0.0.1', 9222), timeout=15)
key = base64.b64encode(os.urandom(16)).decode()
s.sendall((f'GET {path} HTTP/1.1\r\nHost: 127.0.0.1:9222\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\nOrigin: http://127.0.0.1:9222\r\n\r\n').encode())
head = b''
while b'\r\n\r\n' not in head:
    head += s.recv(4096)
assert b' 101 ' in head, head[:250]
serial = 0
exceptions = []

def exact(n):
    data = b''
    while len(data) < n:
        data += s.recv(n - len(data))
    return data

def command(method, params=None):
    global serial
    serial += 1
    data = json.dumps({'id': serial, 'method': method, 'params': params or {}}).encode()
    mask = os.urandom(4)
    n = len(data)
    hdr = bytes([0x81, 0x80 | n]) if n < 126 else bytes([0x81, 0x80 | 126]) + struct.pack('!H', n)
    s.sendall(hdr + mask + bytes(byte ^ mask[i % 4] for i, byte in enumerate(data)))
    while True:
        h = exact(2)
        length = h[1] & 127
        if length == 126:
            length = struct.unpack('!H', exact(2))[0]
        elif length == 127:
            length = struct.unpack('!Q', exact(8))[0]
        message = json.loads(exact(length))
        if message.get('method') == 'Runtime.exceptionThrown':
            exceptions.append(message)
        if message.get('id') == serial:
            assert 'error' not in message, message
            return message.get('result', {})

def evaluate(js):
    result = command('Runtime.evaluate', {'expression': js, 'returnByValue': True, 'awaitPromise': True})
    assert 'exceptionDetails' not in result, result
    return result['result'].get('value')

def wait_for(js):
    for _ in range(100):
        if evaluate(js):
            return
        time.sleep(.2)
    raise AssertionError(js)

def click_tab(name):
    evaluate(f"[...document.querySelectorAll('.udc-tabs button')].find(b=>b.textContent.trim()==={json.dumps(name)}).click()")
    time.sleep(.2)

def browse(exam, subject):
    click_tab('Group B papers')
    evaluate(f"[...document.querySelectorAll('.udc-library-sitting')].find(a=>a.querySelector('h3').textContent.includes({json.dumps(exam)})).querySelectorAll('.udc-library-paper').forEach(p=>{{if(p.querySelector('strong').textContent.includes({json.dumps(subject)}))p.querySelector('button')?.click()}})")
    wait_for("!!document.querySelector('.udc-question-card')")

command('Runtime.enable')
command('Page.enable')
command('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 900, 'deviceScaleFactor': 1, 'mobile': True})
evaluate('location.reload()')
wait_for("document.querySelector('.udc-hero h1')?.textContent.includes('Group B')")
click_tab('Group B papers')
assert evaluate("document.querySelectorAll('.udc-library-paper').length") == 49
assert evaluate("document.body.scrollWidth <= innerWidth")
assert evaluate("document.querySelector('.udc-ldc-page').scrollHeight > document.querySelector('.udc-ldc-page').clientHeight")
assert evaluate("[...document.querySelectorAll('.udc-library-paper')].some(p=>p.innerText.includes('source review'))")
browse('Junior Accounts Officer (JAO)', 'Arithmetic')
assert evaluate("document.querySelectorAll('.udc-question-card').length") == 100
evaluate("document.querySelector('.udc-question-card .udc-option-label').closest('button').click()")
wait_for("document.querySelector('.udc-answer-sources')?.innerText.includes('Answers agree')")
assert evaluate("document.querySelector('.udc-answer-sources').innerText.includes('MPSC final key')")
assert evaluate("(async()=>{let a=document.querySelector('.udc-answer-sources a');return (await fetch(a.href)).status})()") == 200
browse('Group B (non-gazetted)', 'Arithmetic')
assert evaluate("document.querySelectorAll('.udc-question-card').length") == 100
assert evaluate("document.querySelectorAll('.udc-question-card img').length") == 6
evaluate("document.querySelectorAll('.udc-question-card')[74].scrollIntoView({block:'start'})")
wait_for("document.querySelectorAll('.udc-question-card')[74].querySelector('img').complete")
assert evaluate("document.querySelectorAll('.udc-question-card')[74].querySelector('img').naturalWidth > 500")
assert evaluate("document.querySelectorAll('.udc-question-card')[83].innerText.includes('investments')")
assert evaluate("(async()=>{let a=document.querySelectorAll('.udc-question-card')[83].querySelector('a');return (await fetch(a.href)).status})()") == 200
evaluate("document.querySelectorAll('.udc-question-card')[74].querySelector('.udc-option-label').closest('button').click()")
wait_for("document.querySelectorAll('.udc-question-card')[74].innerText.includes('Answers agree')")
with open('/tmp/group-b-mobile-check.png', 'wb') as image:
    image.write(base64.b64decode(command('Page.captureScreenshot', {'format': 'png'})['data']))
evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Filters')).click()")
wait_for("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Answers differ'))")
evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Clear paper selection')).click()")
evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Answers differ')).click()")
assert evaluate("document.querySelectorAll('.udc-question-card').length > 0")
click_tab('exam')
evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sub-Inspector of Statistics')&&b.textContent.includes('Paper II')).click()")
wait_for("document.body.innerText.includes('0/100 answered')")
evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Submit').click()")
assert evaluate("document.body.innerText.includes('0 / 100')")
assert evaluate("document.body.innerText.includes('Arithmetic')&&document.body.innerText.includes('General Knowledge')")
command('Emulation.setDeviceMetricsOverride', {'width': 1280, 'height': 900, 'deviceScaleFactor': 1, 'mobile': False})
click_tab('Group B papers')
assert evaluate("document.body.scrollWidth <= innerWidth")
assert evaluate("document.querySelector('.udc-library-progress').innerText.includes('1,667 ready to practise')")
assert evaluate("document.querySelector('.udc-library-progress').innerText.includes('1,555 with official answers')")
browse('Stenographer Grade III, Lokayukta', 'General Knowledge')
assert evaluate("document.querySelectorAll('.udc-question-card').length === 100")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('DP&AR (SSW)')")
assert evaluate("!document.querySelectorAll('.udc-question-card')[99].innerText.includes('Text extraction needs comparison')")
browse('Sub-Inspector of Excise & Narcotics', 'General English')
excise_count = evaluate("document.querySelectorAll('.udc-question-card').length")
assert excise_count == 33, excise_count  # 30 MCQs plus three reviewed written prompts.
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Write a précis'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('formal letter'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Little Tramp'))")
evaluate("document.querySelectorAll('.udc-question-card')[23].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[23].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[23].innerText.includes('comparative rather than a complex clause')")
browse('Assistant Audit & Accounts Officer', 'General Knowledge')
assert evaluate("document.querySelectorAll('.udc-question-card').length") == 100
assert evaluate("document.querySelectorAll('.udc-question-card')[2].innerText.includes('The Esya Centre')")
assert evaluate("document.querySelectorAll('.udc-question-card')[87].innerText.includes('Jayalalithaa')")
assert evaluate("document.querySelectorAll('.udc-question-card')[1].innerText.includes('Bharat Diwas')")
assert evaluate("document.querySelectorAll('.udc-question-card')[10].innerText.includes('10 February 2020')")
assert evaluate("document.querySelectorAll('.udc-question-card')[98].innerText.includes('Generally Accepted Accounting Principles')")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('12,742 km')")
evaluate("document.querySelectorAll('.udc-question-card')[12].querySelector('.udc-option-label').closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[12].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[12].querySelector('.udc-answer-sources').innerText.includes('B / D')")
evaluate("document.querySelectorAll('.udc-question-card')[72].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[72].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[72].innerText.includes('Text and option order checked')")
assert evaluate("document.querySelectorAll('.udc-question-card')[72].querySelector('.udc-answer-sources a').href.includes('corrigendum')")
assert evaluate("(async()=>{let a=document.querySelectorAll('.udc-question-card')[72].querySelector('.udc-answer-sources a');return (await fetch(a.href)).status})()") == 200
browse('Assistant Audit & Accounts Officer', 'General English')
assert evaluate("document.querySelectorAll('.udc-question-card').length") == 100
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('I __________ this task by lunch')")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('future perfect')")
assert evaluate("document.querySelectorAll('.udc-question-card')[1].innerText.includes('held out from scoring')")
assert evaluate("document.querySelectorAll('.udc-question-card')[22].innerText.includes('held out from scoring')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('most honest of all') && card.innerText.includes('held out from scoring'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Cats are tenacious') && card.innerText.includes('held out from scoring'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Given below are four jumbled sentences'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('antonym of “waver”'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Come in the way of') && card.innerText.includes('held out from scoring'))")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('LATENT')")
browse('Assistant Audit & Accounts Officer', 'Arithmetic')
assert evaluate("document.querySelectorAll('.udc-question-card').length") >= 41
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('value of √2')")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[0].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('three decimal places')")
evaluate("document.querySelectorAll('.udc-question-card')[6].querySelectorAll('.udc-option-label')[3].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[6].querySelector('.udc-answer-sources')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('number of terms in the sequence') && card.innerText.includes('Legacy inferred candidate gives C'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('speed of a moving car is 36 km/hr'))")
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('How many bricks'));if(!c)throw Error('Q30 not rendered');c.querySelectorAll('.udc-option-label')[0].closest('button').click()})()")
wait_for("!!Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('How many bricks'))?.querySelector('.udc-answer-sources')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('How many bricks') && card.innerText.includes('Compensated · not scored') && card.innerText.includes('held out from scoring'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('frequency distribution table') && card.innerText.includes('median class'))")
click_tab('exam')
assert evaluate("![...document.querySelectorAll('button')].some(b=>b.textContent.includes('Assistant Audit & Accounts Officer'))")
assert evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Stenographer Grade III'))")
assert not exceptions, exceptions
print('Browser passed: 49 paper sources, progress totals, reviewed Stenographer GK practice and Exam mode, Excise explanation display, AAO GK transcription, Q13 multi-answer exclusion, Q73 corrigendum scoring/link, official comparison, six recovered figures, source PDFs, disagreement filter, Statistics scoring, mobile and desktop layout; no runtime exceptions.')
s.close()
