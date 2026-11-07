// Unit-level rendering and scoring checks with a minimal DOM stub.
// This does not replace a visual/browser check.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../../public/', import.meta.url);
function boot(io) {
  const elements = new Map(), storage = new Map([['mpsc_sa_v1', JSON.stringify({version:1,questions:{sentinel:{att:1,ok:1}}})]]);
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {innerHTML:'',textContent:'',value:'',dataset:{},
      addEventListener(){}, querySelector:s=>element(s), querySelectorAll:()=>[], classList:{toggle(){},add(){},remove(){}}, focus(){}});
    return elements.get(selector);
  };
  const context = vm.createContext({window:{scrollTo(){}},console,Date,Math,
    document:{querySelector:element,querySelectorAll:()=>[],documentElement:{dataset:{}}},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},confirm:()=>true});
  function load(path) {vm.runInContext(fs.readFileSync(new URL(path,root),'utf8'),context,{filename:path});}
  for(const f of ['syllabus','concepts','questions','id-migration','modes','repeats','calc']) load(`mpsc-system-analyst/data/${f}.js`);
  if(io) for(const f of ['past-papers','module','lessons']) load(`mpsc-informatics-officer/${f}.js`);
  load('mpsc-system-analyst/app.js');
  return {context,element,storage,run:s=>vm.runInContext(s,context)};
}
const io=boot(true);
assert.ok(io.element('#main').innerHTML.includes('Merit total 900'));
assert.ok(!io.element('#main').innerHTML.includes('Qualifying only'));
assert.equal(io.element('#countdown').textContent,'ICT syllabus · 30 July 2026');
assert.equal(io.run('Object.keys(S.questions).length'),0,'IO must not inherit SA progress');
for(const view of ['dash','mock','sources','papers','study','calc','review','progress']) {
  io.run(`go('${view}')`);
  assert.ok(io.element('#main').innerHTML.length>100,view);
}
io.run("go('mock')");
assert.ok(io.element('#main').innerHTML.includes('MCQ practice component'));
assert.ok(io.element('#main').innerHTML.includes('50 questions · 100 MCQ marks'));
assert.ok(!io.element('#main').innerHTML.includes('data-mock="GE"'));
io.run("browsePaper(QS.filter(q=>q.srcKey === 'MUDAL_SA_2026_TECH1_A'))");
assert.equal((io.element('#main').innerHTML.match(/compensated · excluded from tests/g)||[]).length,10);
assert.ok(io.element('#main').innerHTML.includes('View source page'));
assert.equal(io.run("ANSWERABLE.filter(q=>q.compensated).length"),0);
const grade=io.run("quizMarks([{paper:'TECH1',ans:'A'},{paper:'TECH1',ans:'A'},{paper:'GS',ans:'A'},{paper:'GS',ans:'A'}],['A','B','B',null])");
assert.equal(grade.total,6); assert.ok(Math.abs(grade.earned-1)<1e-10);
assert.equal(io.run("quizMarks([{paper:'TECH1',ans:'A'}],[null]).earned"),0);
assert.ok(Math.abs(io.run("quizMarks([{paper:'TECH1',ans:'A'}],['B']).earned")+2/3)<1e-10);
const sample=io.run("weightedPick(ANSWERABLE.filter(q=>q.paper==='TECH1'),50,mulberry(123)).map(q=>q.unit)");
assert.deepEqual(['1','2','3','4'].map(u=>sample.filter(x=>x===u).length),[10,10,15,15]);
for(const g of io.context.window.CALC_DRILLS) {
  assert.ok(io.context.window.SYLLABUS.papers.find(p=>p.id===g.paper)?.units.find(u=>u.no===g.unit),g.id);
  assert.ok(g.gen(io.run("mulberry(123)")),g.id);
}
const sa=boot(false);
assert.equal(sa.run('KEY'),'mpsc_sa_v1');
assert.equal(sa.run('S.questions.sentinel.att'),1);
assert.ok(sa.element('#main').innerHTML.includes('Qualifying only'));
assert.equal(sa.run("quizMarks([{paper:'TECH1',ans:'A'}],['B']).earned"),0);
for(const view of ['dash','mock','papers','study','calc']) sa.run(`go('${view}')`);
console.log('PASS: IO/SA initialisation, view templates, separate storage, source browsing, compensated exclusions, negative marking, weighted sample and 53 calculation generators. Browser verification remains separate.');
