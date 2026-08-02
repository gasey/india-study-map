/* Shared namespace + schema reference.
   Every data file does:  window.MPSC.units.push({...})

   {
     id:       'p4u1'                  // stable slug
     paper:    'Paper IV — Cyber Forensic'
     title:    'Computer Fundamentals, OS & File Systems'
     marks:    40                      // official mark weight
     syllabus: '…'                     // VERBATIM text from the approved syllabus PDF.
                                       // Never paraphrase this field — it is the ground truth
                                       // used to check coverage.
     notes:    [ { h:'Heading', b:'<p>html…</p>' } ]
     questions:[ { q:'stem', o:['a','b','c','d'], a:0, e:'<p>explanation html</p>' } ]
   }

   `a` is the 0-based index of the correct option.

   Provenance rule: no past JSO (Cyber Forensic) paper exists, so every question here is
   authored from the syllabus scope rather than transcribed. Where a question is modelled on
   a real MPSC paper from the archive, say so in the explanation.
*/
window.MPSC = window.MPSC || { units: [] };
