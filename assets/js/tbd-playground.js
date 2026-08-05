/*
 * Genre / pattern picker for the Learn playground.
 *
 * This is a thin controller: it owns no audio, no clock and no grid state. It
 * calls public methods on an existing <tbd-seq> and lets that element remain
 * the single source of truth, exactly as the virtual panel does. If this file
 * fails to load the sequencer below it still works — you just program it by
 * hand instead of loading a starting point.
 *
 * The patterns are the classic public-domain drum-machine grooves (the same
 * set circulated as "Pocket Operations"). Steps are 1-indexed to match the
 * numbers printed on the device and the `data-pattern` spec.
 *
 * Voices are the generic teaching set, NOT device machine names: the browser
 * player approximates a drum machine, it does not run the tbd 16's engines.
 * Two source voices have no row here — cowbell folds into `ride` and toms into
 * `rim`, which affects six notes across three patterns.
 */
(function () {
  'use strict';

  var GENRES = [
    {
      name: 'Foundations',
      blurb: 'Where everything starts. The <b>kick</b> carries the pulse, the <b>snare</b> lands on beats 2 and 4 — the backbeat — and the <b>hats</b> run in eighths.',
      patterns: [
        { n: 'Boots ’n’ Cats', bpm: 118, swing: 0, tip: 'Say it out loud: “boots and cats and boots and cats.” Kick–hat–snare–hat.', p: 'kick:1,9|snare:5,13|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Four on the Floor', bpm: 122, swing: 0, tip: 'Kick on every quarter note (1·5·9·13). The foundation of nearly all dance music.', p: 'kick:1,5,9,13|hho:3,7,11,15' },
        { n: 'Pop Backbeat', bpm: 110, swing: 0, tip: 'Snare on 2 and 4 is the heart of every pop and rock song. Simple, and it carries everything.', p: 'kick:1,4,7,11|snare:5,13|hhc:1,3,5,7,9,11,13,15' }
      ]
    },
    {
      name: 'House',
      blurb: '<b>Four-on-the-floor</b> kick, <b>clap</b> on 2 and 4, and those characteristic <b>offbeat open hats</b> — always on the “and”. 120–126 BPM.',
      patterns: [
        { n: 'Classic House', bpm: 124, swing: 0, tip: 'Kick straight through, open hat on every offbeat. That “tss” between the kicks is the whole groove.', p: 'kick:1,5,9,13|clap:5,13|hho:3,7,11,15' },
        { n: 'Deep House', bpm: 122, swing: 0, tip: 'Softer and rolling: extra closed hats add movement, and a clap replaces the snare.', p: 'kick:1,5,9,13|clap:5,13|hhc:2,8,10|hho:3,7,11,15' },
        { n: 'French House', bpm: 123, swing: 0, tip: 'Filter-house feel: continuous hats plus offbeat open hats, with a shaker driving underneath.', p: 'kick:1,5,9,13|clap:5,13|hhc:1,3,5,7,9,11,13,15|hho:3,7,11,15|shk:1,5,9,13' }
      ]
    },
    {
      name: 'Techno',
      blurb: 'Driving and hypnotic. Kick on every quarter plus a <b>ghost kick</b> just before the bar ends (step 15). Offbeat open hats. 130–138 BPM.',
      patterns: [
        { n: 'Techno', bpm: 134, swing: 0, tip: 'The extra kick on step 15 is what pushes you into the next bar.', p: 'kick:1,5,9,13,15|hho:3,7,11,15|hhc:10' },
        { n: 'Peak-Time Techno', bpm: 136, swing: 0, tip: 'Stomping: kick throughout, clap on 2 and 4, hats all the way. Not much, but heavy.', p: 'kick:1,5,9,13|clap:5,13|hho:3,7,11,15|hhc:2,4,6,8,10,12,14,16' }
      ]
    },
    {
      name: 'Electro',
      blurb: 'No four-on-the-floor here: <b>syncopated kicks</b> under a straight snare on 2 and 4. Electronic, funky, around 128 BPM.',
      patterns: [
        { n: 'Electro', bpm: 128, swing: 0, tip: 'The kick jumps (1·7·11·14) instead of running straight — that is the nervous electro bounce.', p: 'kick:1,7,11,14|snare:5,13|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Miami Bass', bpm: 126, swing: 0, tip: '808 territory: kick and snare as a backbeat, with sixteenth-note accents in the hats.', p: 'kick:1,7,11,14|snare:5,13|hhc:1,3,4,5,7,8,9,11,12,13,15,16' }
      ]
    },
    {
      name: 'Hip-Hop / Boom Bap',
      blurb: 'Relaxed tempo (85–95 BPM) with fat <b>kick and snare</b> grooves. Often lightly <b>swung</b> — push the swing slider to about 20%.',
      patterns: [
        { n: 'Boom Bap', bpm: 88, swing: 18, tip: 'Hard kick on 1, snare on 2 and 4. Add a little swing and it turns into a head-nod immediately.', p: 'kick:1,7,11|snare:5,13|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Hip Hop Groove', bpm: 90, swing: 16, tip: 'More kicks (1·3·7·8·15) make the groove more talkative.', p: 'kick:1,3,7,8,15|snare:5,13|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Lo-Fi', bpm: 82, swing: 32, tip: 'Slow and dragging — turn the swing up. A rim instead of a hard snare keeps it soft.', p: 'kick:1,8,11|snare:5,13|hhc:1,4,5,8,9,12,13,16|hho:7' }
      ]
    },
    {
      name: 'Trap',
      blurb: '<b>Halftime feel</b>: the snare or clap arrives on beat 3 (step 9). Fast <b>hat rolls</b> do the rest. Around 140 BPM — which feels half as fast.',
      patterns: [
        { n: 'Trap', bpm: 140, swing: 0, tip: 'Snare in the middle of the bar (step 9) is what makes it halftime. Sparse 808 kick, busy hats.', p: 'kick:1,7,13|clap:9|hhc:1,3,5,7,9,10,11,13,15,16' },
        { n: 'Drill', bpm: 142, swing: 0, tip: 'Sliding 808 kicks (3·5·11) and that characteristic displaced snare.', p: 'kick:3,5,11|clap:9|hhc:1,3,5,7,9,11,13,15' }
      ]
    },
    {
      name: 'Drum & Bass / Jungle',
      blurb: 'Very fast (170–176 BPM), but the snare on 2 and 4 makes it <b>feel half as fast</b>. The “Amen” break is the heart of it.',
      patterns: [
        { n: 'Amen Break', bpm: 174, swing: 0, tip: 'The most famous break in the world. All those snares (5·8·10·13·16) are the rolling chaos.', p: 'kick:1,3,11,12|snare:5,8,10,13,16|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Jungle', bpm: 162, swing: 0, tip: 'Choppy and raw: displaced kicks, snare with ghost notes, open hat on the 1.', p: 'kick:1,3,11|snare:5,8,10,15|hhc:1,3,5,7,9,11,13,15|hho:1' },
        { n: 'Liquid D&B', bpm: 174, swing: 0, tip: 'A clean two-step: clear kick-snare-kick-snare structure, good for listening into.', p: 'kick:1,4,8,10,11,16|snare:5,13|hhc:1,3,5,7,9,11,13,15' }
      ]
    },
    {
      name: 'Funk / Breakbeat',
      blurb: 'The groove lives on <b>ghost notes</b> — quiet snares between the loud ones — and <b>syncopated kicks</b>. 95–130 BPM. A little swing helps.',
      patterns: [
        { n: 'Funky Drummer', bpm: 100, swing: 14, tip: 'The most sampled break there is. Those snare ghost notes are the whole magic.', p: 'kick:1,3,7,11,14|snare:5,8~,10~,12~,13,16~|hhc:1,2,3,4,5,6,7,9,10,11,12,13,15,16|hho:8,14' },
        { n: 'Impeach the President', bpm: 95, swing: 10, tip: 'Simple and dry — a hip-hop favourite. The open hat on 11 is its signature.', p: 'kick:1,8,9,15|snare:5,13|hhc:1,3,5,7,8,9,13,15|hho:11' },
        { n: 'Big Beat', bpm: 128, swing: 0, tip: 'Fat and wide: kick up front, hats only on 2 and 4.', p: 'kick:1,4,7,9|snare:5,13|hhc:5,13' }
      ]
    },
    {
      name: 'Rock / Pop',
      blurb: 'Straight-ahead <b>backbeat</b>, eighth-note hats running throughout, <b>crash on the 1</b>. 110–130 BPM.',
      patterns: [
        { n: 'Rock', bpm: 120, swing: 0, tip: 'The standard rock beat: kick on 1, snare on 2 and 4, crash to open.', p: 'kick:1,8,9,11|snare:5,13|hhc:1,3,5,7,9,11,13,15|ride:1' },
        { n: 'Pop', bpm: 110, swing: 0, tip: 'A little more kick movement up front. The basis of countless chart songs.', p: 'kick:1,2,4,8,11|snare:5,13|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Disco', bpm: 120, swing: 0, tip: 'Four-on-the-floor with offbeat open hats — the direct ancestor of house.', p: 'kick:1,5,9,13|snare:5,13|hho:3,7,11,15|hhc:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16' }
      ]
    },
    {
      name: 'Reggaeton / Dancehall',
      blurb: 'The <b>“dembow”</b>: kick on the quarters, snare syncopated in a “tra–pa–pa” shape (4·7·12·15). 90–100 BPM.',
      patterns: [
        { n: 'Reggaeton (Dembow)', bpm: 95, swing: 0, tip: 'That snare pattern — 4·7 then 12·15 — is the dembow. You will hear it all over latin pop.', p: 'kick:1,5,9,13|snare:4,7,12,15|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Dancehall', bpm: 98, swing: 0, tip: 'Related, but sparser in the kick. The rim adds a woody accent.', p: 'kick:1,9|snare:4,7,12,15|rim:3,11|hhc:1,3,5,7,9,11,13,15' }
      ]
    },
    {
      name: 'Reggae / Dub',
      blurb: 'Relaxed, 70–80 BPM. The <b>“one drop”</b> deliberately leaves out beat 1: kick and snare land together on beat 3 (step 9).',
      patterns: [
        { n: 'One Drop', bpm: 75, swing: 0, tip: 'No kick on 1 at all. Kick and snare together on the 3 — that is what defines the reggae pulse.', p: 'kick:9|snare:9|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Steppers', bpm: 78, swing: 0, tip: 'More driving: kick on every quarter (“steppers”), snare still on the 3.', p: 'kick:1,5,9,13|snare:9|hhc:1,3,5,7,9,11,13,15' }
      ]
    },
    {
      name: 'Latin / Afro-Cuban',
      blurb: 'Everything revolves around the <b>clave</b> — a 3-2 pattern on the <b>rim</b>. A ride and a dancing kick run over it. 100–130 BPM.',
      patterns: [
        { n: 'Bossa Nova', bpm: 130, swing: 0, tip: 'The rim clave (1·4·7·11·14) is the backbone. Ride throughout, kick pulsing softly.', p: 'rim:1,4,7,11,14|kick:1,4,5,8,9,12,13,16|ride:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16' },
        { n: 'Son Clave (3-2)', bpm: 100, swing: 0, tip: 'The classic 3-2 clave on the rim — listen for the “X · · X · · X · · · X · X” feel.', p: 'rim:1,4,7,11,13|kick:1,9|hhc:1,3,5,7,9,11,13,15' },
        { n: 'Songo', bpm: 110, swing: 0, tip: 'Cuban groove: the bell leads, snare accents, kick syncopated.', p: 'kick:1,5,9,13,15|rim:3,4,7,8,11,12,15,16|ride:1,4,7,11,15' }
      ]
    },
    {
      name: 'UK Garage',
      blurb: 'Syncopated and shuffled — <b>turn the swing up</b>. Displaced kicks, clap on 2 and 4, choppy hats. 130–138 BPM.',
      patterns: [
        { n: '2-Step Garage', bpm: 135, swing: 40, tip: 'Kick only on 1 and 11 — the “skip”. Swing around 40% is where the garage feel lives.', p: 'kick:1,11|clap:5,13|hhc:3,4,7,11,15,16|rim:2,8,14,6,12' }
      ]
    },
    {
      name: 'Dubstep',
      blurb: '<b>Halftime</b> like trap, but harder: snare on beat 3 (step 9), sparse kicks, lots of space. Around 140 BPM.',
      patterns: [
        { n: 'Dubstep', bpm: 140, swing: 0, tip: 'Kick on 1, snare on 9 — everything between them is room for the bass. Less is more.', p: 'kick:1,11|snare:9|hhc:2,3,7,12,15|hho:5,14' }
      ]
    }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function build(root) {
    var seq = document.getElementById(root.dataset.target);
    if (!seq) return;

    var genreSel = el('select', 'tbd-playground__select');
    genreSel.id = root.id + '-genre';
    var patternSel = el('select', 'tbd-playground__select');
    patternSel.id = root.id + '-pattern';
    var blurb = el('div', 'tbd-playground__blurb');

    // The description belongs below the instrument, not between the picker and
    // the device — otherwise choosing a genre pushes the device down the page.
    // Fall back to the picker only if a page did not provide the container.
    var blurbHost = document.getElementById(root.id + '-info') || root;

    function field(labelText, control) {
      var wrap = el('div', 'tbd-playground__field');
      var label = el('label', 'tbd-playground__label', labelText);
      label.setAttribute('for', control.id);
      wrap.appendChild(label);
      wrap.appendChild(control);
      return wrap;
    }

    GENRES.forEach(function (g, i) {
      genreSel.appendChild(new Option(g.name, String(i)));
    });

    function currentGenre() { return GENRES[Number(genreSel.value) || 0]; }
    function currentPattern() {
      var g = currentGenre();
      return g.patterns[Number(patternSel.value) || 0] || g.patterns[0];
    }

    function fillPatterns() {
      patternSel.innerHTML = '';
      currentGenre().patterns.forEach(function (p, i) {
        patternSel.appendChild(new Option(p.n, String(i)));
      });
    }

    function describe() {
      var g = currentGenre();
      var p = currentPattern();
      blurb.innerHTML = g.blurb + ' <span class="tbd-playground__tip"><b>' + p.n + ':</b> ' + p.tip + '</span>';
    }

    // Loading is explicit. Changing a dropdown updates the description but does
    // not overwrite whatever the learner has just built by hand.
    function load() {
      var p = currentPattern();
      if (typeof seq.applyPreset !== 'function') return;
      seq.applyPreset(p.p, {
        bpm: p.bpm,
        swing: p.swing,
        announce: p.n + ' loaded at ' + p.bpm + ' BPM'
      });
    }

    genreSel.addEventListener('change', function () { fillPatterns(); describe(); });
    patternSel.addEventListener('change', describe);

    var loadBtn = el('button', 'tbd-playground__btn tbd-playground__btn--primary', 'Load pattern');
    loadBtn.type = 'button';
    loadBtn.addEventListener('click', load);

    var clearBtn = el('button', 'tbd-playground__btn', 'Clear');
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', function () {
      if (typeof seq.clearGrid === 'function') seq.clearGrid();
    });

    var randomBtn = el('button', 'tbd-playground__btn', 'Surprise me');
    randomBtn.type = 'button';
    randomBtn.addEventListener('click', function () {
      if (typeof seq.randomise === 'function') seq.randomise();
    });

    var row = el('div', 'tbd-playground__row');
    row.appendChild(field('Genre', genreSel));
    row.appendChild(field('Pattern', patternSel));
    var actions = el('div', 'tbd-playground__actions');
    actions.appendChild(loadBtn);
    actions.appendChild(clearBtn);
    actions.appendChild(randomBtn);
    row.appendChild(actions);

    root.appendChild(row);
    blurbHost.appendChild(blurb);

    fillPatterns();
    describe();
  }

  function init() {
    var roots = document.querySelectorAll('.tbd-playground[data-target]');
    for (var i = 0; i < roots.length; i++) build(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
