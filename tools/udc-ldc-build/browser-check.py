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
assert evaluate("document.querySelector('.udc-library-progress').innerText.includes('2,076 ready to practise')")
assert evaluate("document.querySelector('.udc-library-progress').innerText.includes('1,614 with official answers')")
browse('Stenographer Grade II, MPSC', 'General English')
assert evaluate("document.querySelectorAll('.udc-question-card').length === 44")
assert evaluate("document.querySelectorAll('.udc-question-card')[35].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[36].innerText.includes('Held unscored')")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[2].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('functions as an adverb')")
browse('Motor Vehicle Inspector', 'General Knowledge')
assert evaluate("document.querySelectorAll('.udc-question-card').length === 100")
assert evaluate("document.querySelectorAll('.udc-question-card')[17].innerText.includes('re-elected at Tripuri in 1939')&&document.querySelectorAll('.udc-question-card')[17].innerText.includes('Held unscored')")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[3].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('Mizoram was officially declared India’s first fully literate state')")
assert evaluate("document.querySelectorAll('.udc-question-card')[27].innerText.includes('most native speakers')&&document.querySelectorAll('.udc-question-card')[27].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[31].innerText.includes('The Indus river flows')&&document.querySelectorAll('.udc-question-card')[31].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[46].innerText.includes('both Education and Industries are outside the State List')&&document.querySelectorAll('.udc-question-card')[46].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[64].innerText.includes('Held unscored')&&document.querySelectorAll('.udc-question-card')[64].innerText.includes('formal term')")
assert evaluate("document.querySelectorAll('.udc-question-card')[67].innerText.includes('Which pollutant is not included')")
assert evaluate("document.querySelectorAll('.udc-question-card')[68].innerText.includes('According to the 2022 All India Tiger Estimation')&&document.querySelectorAll('.udc-question-card')[69].innerText.includes('Biosphere Reserves')")
assert evaluate("document.querySelectorAll('.udc-question-card')[71].innerText.includes('Pala Wetland site in Mizoram')&&document.querySelectorAll('.udc-question-card')[78].innerText.includes('Held unscored')")
evaluate("document.querySelectorAll('.udc-question-card')[67].querySelectorAll('.udc-option-label')[3].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[67].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[67].innerText.includes('Carbon dioxide is not on that list')")
evaluate("document.querySelectorAll('.udc-question-card')[71].querySelectorAll('.udc-option-label')[2].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[71].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[71].innerText.includes('1,850 hectares')")
evaluate("document.querySelectorAll('.udc-question-card')[65].querySelectorAll('.udc-option-label')[0].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[65].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[65].innerText.includes('An invasive species is introduced outside its native range')")
evaluate("document.querySelectorAll('.udc-question-card')[21].querySelectorAll('.udc-option-label')[2].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[21].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[21].innerText.includes('Gandhi gave the “Do or Die” call')")
browse('Stenographer Grade II, DP&AR', 'General Knowledge')
assert evaluate("document.querySelectorAll('.udc-question-card').length === 100")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('longest ever serving Chief Minister')")
assert evaluate("document.querySelectorAll('.udc-question-card')[5].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[54].innerText.includes('Mohun Bagan')&&document.querySelectorAll('.udc-question-card')[54].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[43].innerText.includes('Latvia joined on 1 January 2014')&&document.querySelectorAll('.udc-question-card')[43].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[68].innerText.includes('Bharat Ratna is awarded')&&document.querySelectorAll('.udc-question-card')[68].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[70].innerText.includes('Emile Berliner')&&document.querySelectorAll('.udc-question-card')[70].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[80].innerText.includes('first laptop')&&document.querySelectorAll('.udc-question-card')[80].innerText.includes('Held unscored')")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('Headquarters of the UN')&&document.querySelectorAll('.udc-question-card')[99].innerText.includes('Held unscored')")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('served as chief minister of Sikkim continuously')")
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
evaluate("document.querySelectorAll('.udc-question-card')[36].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[36].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[36].innerText.includes('tenacious of life')")
evaluate("document.querySelectorAll('.udc-question-card')[76].querySelectorAll('.udc-option-label')[3].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[76].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[76].innerText.includes('obstruct or hinder')")
assert evaluate("document.querySelectorAll('.udc-question-card').length") == 100
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('I __________ this task by lunch')")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('future perfect')")
assert evaluate("document.querySelectorAll('.udc-question-card')[1].innerText.includes('held out from scoring')")
assert evaluate("document.querySelectorAll('.udc-question-card')[22].innerText.includes('held out from scoring')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('most honest of all') && card.innerText.includes('held out from scoring'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Cats are tenacious') && !card.innerText.includes('held out from scoring'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Given below are four jumbled sentences'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('antonym of “waver”'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('Come in the way of') && !card.innerText.includes('held out from scoring'))")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('LATENT')")
browse('Assistant Audit & Accounts Officer', 'Arithmetic')
evaluate("document.querySelectorAll('.udc-question-card')[74].querySelectorAll('.udc-option-label')[3].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[74].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[74].innerText.includes('8:12:15')")
assert evaluate("document.querySelectorAll('.udc-question-card').length") == 100
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
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('Evaluate')&&card.innerText.includes('4096'));if(!c)throw Error('Q52 not rendered');c.querySelectorAll('.udc-option-label')[1].closest('button').click()})()")
wait_for("!!Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('Evaluate')&&card.innerText.includes('4096'))?.querySelector('.udc-answer-sources')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('4096') && card.innerText.includes('∛64=4'))")
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('probability of drawing a white ball'));if(!c)throw Error('Q63 not rendered');c.querySelectorAll('.udc-option-label')[3].closest('button').click()})()")
wait_for("!!Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('probability of drawing a white ball'))?.querySelector('.udc-answer-sources')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('probability of drawing a white ball') && card.innerText.includes('g=4'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('How many like hockey only') && card.innerText.includes('does not say this'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('a:b=2:3') && card.innerText.includes('scale 2:3 to 8:12'))")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('3 m broad')")
evaluate("document.querySelectorAll('.udc-question-card')[99].querySelectorAll('.udc-option-label')[3].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[99].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[99].innerText.includes('15,000 litres')")
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('A and B can do a job together in 12 days'));if(!c)throw Error('Q93 not rendered');c.querySelectorAll('.udc-option-label')[3].closest('button').click()})()")
wait_for("!!Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('A and B can do a job together in 12 days'))?.querySelector('.udc-answer-sources')")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card => card.innerText.includes('A and B can do a job together in 12 days') && card.innerText.includes('36 days'))")
browse('Sub-Inspector of Police (Un-armed Branch)', 'General Knowledge & Reasoning')
assert evaluate("document.querySelectorAll('.udc-question-card').length == 100")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('Which diagram shows the relationship')&&card.querySelector('img')?.src.includes('si-police-2026-p2-q089.png'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('survey of 300 students')&&card.innerText.includes('Held out:')&&card.querySelector('img')?.src.includes('si-police-2026-p2-q096.png'))")
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('arrow matrix'));if(!c||!c.querySelector('img')?.src.includes('si-police-2026-p2-q097.png'))throw Error('Q97 image missing');c.querySelectorAll('.udc-option-label')[1].closest('button').click()})()")
wait_for("Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('arrow matrix'))?.innerText.includes('Figure 2 has two upward arrows')")
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('shading pattern'));if(!c||!c.querySelector('img')?.src.includes('si-police-2026-p2-q098.png'))throw Error('Q98 image missing');c.querySelectorAll('.udc-option-label')[0].closest('button').click()})()")
wait_for("Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('shading pattern'))?.innerText.includes('right half')")
browse('Sub-Inspector of Police (Un-armed Branch)', 'General English')
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('The detrimental effects of social media')&&card.innerText.includes('The impact of Artificial Intelligence'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('Write a précis')&&card.innerText.includes('Reading is one of the most valuable habits'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('Which kind of human beings denounce studies?')&&card.innerText.includes('According to the author, why should one read?')&&card.innerText.includes('weigh and consider'))")
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('She ______ a lot of books')&&card.innerText.includes('official key accepts B and D'))")
evaluate("(()=>{const c=Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('They said that they took the bus every day'));if(!c)throw Error('Q48 missing');c.querySelectorAll('.udc-option-label')[3].closest('button').click()})()")
wait_for("Array.from(document.querySelectorAll('.udc-question-card')).find(card=>card.innerText.includes('They said that they took the bus every day'))?.innerText.includes('official final key has no answer')")
browse('Sub-Inspector of Police (Un-armed Branch)', 'General Knowledge & Reasoning')
assert evaluate("Array.from(document.querySelectorAll('.udc-question-card')).some(card=>card.innerText.includes('A sum becomes ₹2,400')&&card.innerText.includes('₹1,935.48'))")
browse('Inspector of Statistics', 'General Knowledge & General Mathematics')
assert evaluate("document.querySelectorAll('.udc-question-card').length == 100")
evaluate("document.querySelectorAll('.udc-question-card')[0].querySelectorAll('.udc-option-label')[0].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[0].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[0].innerText.includes('sites in Haryana')")
evaluate("document.querySelectorAll('.udc-question-card')[1].querySelectorAll('.udc-option-label')[2].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[1].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[1].innerText.includes('National Assembly came first')")
evaluate("document.querySelectorAll('.udc-question-card')[16].querySelectorAll('.udc-option-label')[0].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[16].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[16].innerText.includes('Yuktdhara supports geospatial planning')")
assert evaluate("document.querySelectorAll('.udc-question-card')[17].innerText.includes('Held out because')")
evaluate("document.querySelectorAll('.udc-question-card')[19].querySelectorAll('.udc-option-label')[0].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[19].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[19].innerText.includes('Consumer Price Index measures changes')")
evaluate("document.querySelectorAll('.udc-question-card')[20].querySelectorAll('.udc-option-label')[0].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[20].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[20].innerText.includes('Blue carbon is carbon captured')")
assert evaluate("document.querySelectorAll('.udc-question-card')[26].innerText.includes('in 2025 launched Parker Solar Probe')&&document.querySelectorAll('.udc-question-card')[26].innerText.includes('The scan states')&&document.querySelectorAll('.udc-question-card')[26].innerText.includes('NASA')")
assert evaluate("document.querySelectorAll('.udc-question-card')[27].innerText.includes('no “I, II, III and IV” answer')")
assert evaluate("document.querySelectorAll('.udc-question-card')[36].innerText.includes('Health statistical data are drawn')&&document.querySelectorAll('.udc-question-card')[36].innerText.includes('Held out')")
evaluate("document.querySelectorAll('.udc-question-card')[37].querySelectorAll('.udc-option-label')[1].closest('button').click()")
wait_for("!!document.querySelectorAll('.udc-question-card')[37].querySelector('.udc-answer-sources')")
assert evaluate("document.querySelectorAll('.udc-question-card')[37].innerText.includes('train travels 12.5 m/s')&&document.querySelectorAll('.udc-question-card')[37].innerText.includes('245 m')")
click_tab('exam')
assert evaluate("![...document.querySelectorAll('button')].some(b=>b.textContent.includes('Assistant Audit & Accounts Officer'))")
assert evaluate("[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Stenographer Grade III'))")
assert not exceptions, exceptions
print('Browser passed: 49 paper sources, progress totals, Motor Vehicle Inspector 2025 and Stenographer Grade-II source-review gating and explanations, reviewed Stenographer Grade-III practice and Exam mode, Excise explanation display, AAO GK transcription, Q13 multi-answer exclusion, Q73 corrigendum scoring/link, official comparison, six recovered figures, source PDFs, disagreement filter, Statistics scoring, mobile and desktop layout; no runtime exceptions.')
s.close()
