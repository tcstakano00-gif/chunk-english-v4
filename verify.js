const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
const els=new Map();function el(id){if(!els.has(id))els.set(id,{innerHTML:'',textContent:'',hidden:false,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},appendChild(){},replaceWith(){},querySelector(){return null},querySelectorAll(){return []}});return els.get(id)}
const doc={getElementById:el,querySelectorAll(){return []},querySelector(){return null},createElement(){return el('temp')},documentElement:{style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}}},body:el('body')};
const win={addEventListener(){},scrollTo(){},SpeechRecognition:null,webkitSpeechRecognition:null};
const context={document:doc,window:win,navigator:{},location:{protocol:'file:',hostname:''},localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Date,Math,JSON,Array,Number,Object,String,Set,Map,RegExp,Intl,encodeURIComponent,decodeURIComponent,alert(){},confirm(){return true},setTimeout,clearTimeout,setInterval,clearInterval,URL,Blob,fetch:async()=>({ok:false})};
vm.createContext(context);for(let i=0;i<scripts.length;i++)vm.runInContext(scripts[i],context,{filename:'app-script-'+i+'.js'});
const pass=[];function test(name,func){try{func();pass.push(name)}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1}}
const cases=[['chunk','pron'],['exampleQuestion','example'],['example','example'],['registeredExample','example'],['question','conversation'],['aiReply','conversation'],['reply','conversation'],['scene','conversation']];
for(const [kind,page] of cases){test('result '+kind,()=>{vm.runInContext(`state.page='results';state.latest={kind:${JSON.stringify(kind)},target:'Sounds good.',heard:'Sounds good.',score:100,feedback:'良いです',date:'today'};render()`,context);assert.ok(el('app').innerHTML.includes('result-card'));assert.strictEqual(vm.runInContext(`resultReturnPage(${JSON.stringify(kind)})`,context),page)})}
for(const page of ['home','pron','example','conversation','list','history','settings'])test('page '+page,()=>{vm.runInContext(`state.page=${JSON.stringify(page)};render()`,context);assert.ok(el('app').innerHTML.length>100)});
// Fake Web Speech final event, test navigation and cancel for all supported areas.
win.SpeechRecognition=class{constructor(){win.__rec=this} start(){this.onstart?.()}abort(){} stop(){this.onend?.()}};
for(const [kind,page] of [['chunk','pron'],['exampleQuestion','example'],['example','example'],['question','conversation'],['aiReply','conversation']]){
test('speech success '+kind,()=>{vm.runInContext(`state.page=${JSON.stringify(page)};render();listen(${JSON.stringify(kind)})`,context);const r=win.__rec;const target=vm.runInContext(`target(${JSON.stringify(kind)})`,context);const item=[{transcript:target}];item.isFinal=true;r.onresult({results:[item]});r.onend();assert.strictEqual(vm.runInContext('state.page',context),'results');assert.ok(el('app').innerHTML.includes('result-card'))});
test('manual cancel '+kind,()=>{vm.runInContext(`state.page=${JSON.stringify(page)};render();listen(${JSON.stringify(kind)});finishListening()`,context);assert.strictEqual(vm.runInContext('state.page',context),page)})
}
console.log(JSON.stringify({tests:pass.length,passed:pass,failed:process.exitCode||0},null,2));
