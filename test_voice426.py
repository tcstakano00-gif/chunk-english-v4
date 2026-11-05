"""Browser tests for capped native voices, independent avatar selection, preview, and migration."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
root=Path(__file__).parent
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844})
    page.set_content(root.joinpath('index.html').read_text(encoding='utf-8'),wait_until='domcontentloaded')
    page.evaluate('''() => {window.__voicesTest=[
      {name:'Samantha',lang:'en-US',voiceURI:'v-samantha',localService:true},
      {name:'Ava',lang:'en-US',voiceURI:'v-ava',localService:true},
      {name:'Daniel',lang:'en-GB',voiceURI:'v-daniel',localService:true},
      {name:'Alex',lang:'en-US',voiceURI:'v-alex',localService:true},
      {name:'Synthetic AI',lang:'en-US',voiceURI:'v-ai',localService:true},
      {name:'Bad News',lang:'en-US',voiceURI:'v-bad',localService:true},
      {name:'Extra English',lang:'en-US',voiceURI:'v-extra',localService:true},
      {name:'Japanese',lang:'ja-JP',voiceURI:'v-ja',localService:true}
     ];Object.defineProperty(window.speechSynthesis,'getVoices',{value:()=>window.__voicesTest,configurable:true}); go('settings')}''')
    assert page.locator('.study-voice-avatars img').count()==2
    assert page.locator('.study-voice-choice').count()==6 # standard + 5 real available voices
    assert 'Bad News' not in page.locator('#studyVoicePicker').inner_text()
    assert 'Japanese' not in page.locator('#studyVoicePicker').inner_text()
    assert page.locator('.study-voice-choice input[type=radio]').count()==6
    page.locator('input[name=studyVoice][value="v-daniel"]').check()
    assert page.evaluate('settings.voiceURI')=='v-daniel'
    before=page.locator('.study-voice-avatars img').first.get_attribute('src')
    page.evaluate("changeSetting('coachAvatar','ai1')")
    after=page.locator('.study-voice-avatars img').first.get_attribute('src')
    assert before!=after
    assert page.evaluate('settings.voiceURI')=='v-daniel'
    assert page.locator('.study-voice-avatars img').last.get_attribute('src')
    chosen=page.evaluate('studyVoiceCandidates().map(c=>c.voice.voiceURI)')
    assert len(chosen)==5 and len(set(chosen))==5
    page.evaluate("go('pron')")
    page.evaluate("go('settings')")
    assert page.evaluate('settings.voiceURI')=='v-daniel'
    assert page.evaluate('settings.coachAvatar')=='ai1'
    print(json.dumps({'checks':9,'result':'PASS','voices':chosen},ensure_ascii=False))
    browser.close()
server.shutdown()
