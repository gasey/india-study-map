import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../../public/', import.meta.url);
const context = { window: {} };
for (const file of ['syllabus','concepts','questions','calc']) vm.runInNewContext(fs.readFileSync(new URL(`mpsc-system-analyst/data/${file}.js`, root), 'utf8'), context);
const original = JSON.stringify(context.window.SYLLABUS);
for (const file of ['past-papers','module','lessons']) vm.runInNewContext(fs.readFileSync(new URL(`mpsc-informatics-officer/${file}.js`, root), 'utf8'), context);
const {SYLLABUS:s, QUESTIONS:q, CONCEPTS:c, TRAINER_CONFIG:config} = context.window;
assert.equal(s.papers.reduce((n,p)=>n+p.marks,0)+s.interview.marks,900);
assert.equal(s.papers.length,5);
for (const p of s.papers) {
  assert.equal(p.units.reduce((n,u)=>n+u.marks,0),p.marks,p.id);
  assert.equal(p.duration_hours,3);
  assert.equal(p.counts_for_merit,true);
}
for (const rows of [q,c]) {
  assert.equal(new Set(rows.map(r=>r.id)).size,rows.length,'duplicate IDs');
  for (const r of rows) assert.ok(s.papers.find(p=>p.id===r.paper)?.units.find(u=>u.no===String(r.unit)),r.id);
}
const imported=q.filter(q=>q.id.startsWith('MUDAL_SA_2026_'));
assert.equal(imported.length,400);
assert.equal(imported.filter(q=>q.ans).length,390);
for(const p of ['TECH1','TECH2','TECH3','GS']) assert.equal(imported.filter(q=>q.paper===p).length,100);
assert.deepEqual(Array.from(imported.filter(q=>q.compensated),q=>q.no),[56,57,58,59,60,61,62,63,64,65]);
for(const r of imported) {
  assert.ok(r.q.trim().length>12,r.id);
  assert.deepEqual(Object.keys(r.opts).sort(),['A','B','C','D']);
  assert.ok(r.compensated || r.opts[r.ans],r.id);
  assert.ok(!/Set-A: Page|Series-|Answer Key/.test(r.q+Object.values(r.opts).join(' ')),r.id);
}
assert.notEqual(config.storageKey,'mpsc_sa_v1');
assert.equal(config.negativeMarking,1/3);
assert.ok(!JSON.stringify(s).includes('qualifying only'));
const source={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('mpsc-system-analyst/data/syllabus.js',root),'utf8'),source);
assert.equal(JSON.stringify(source.window.SYLLABUS),original);
console.log(JSON.stringify({questions:q.length,answerable:q.filter(q=>q.ans?.length===1).length,concepts:c.length,
  papers:s.papers.map(p=>({paper:p.id,questions:q.filter(q=>q.paper===p.id).length,concepts:c.filter(c=>c.paper===p.id).length,
    units:p.units.map(u=>({name:u.title,questions:q.filter(q=>q.paper===p.id&&q.unit===u.no&&q.ans).length,concepts:c.filter(c=>c.paper===p.id&&c.unit===u.no).length}))}))},null,2));
