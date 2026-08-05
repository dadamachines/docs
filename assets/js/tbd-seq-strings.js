/*
 * UI strings for the tbd 16 Learn widget.
 *
 * Everything a learner reads *inside* the widget lives here, keyed by language.
 * Lesson prose lives in the markdown, never in the widget — so translating a
 * lesson means translating one .md file plus, once, the table below.
 *
 * The active language comes from `data-lang` on the tbd-seq.js script tag,
 * which Jekyll fills from the page's front-matter `lang`. Unknown languages
 * fall back to `en`.
 *
 * `{n}` placeholders are substituted positionally by fmt() in tbd-seq.js.
 */
window.TbdSeqStrings = {
  en: {
    play: 'Play',
    stop: 'Stop',
    tempo: 'Tempo',
    swing: 'Swing',
    bars: 'Bars',
    page: 'Page',
    clear: 'Clear',
    random: 'Random',
    reset: 'Reset pattern',
    bpmUnit: '{0} BPM',
    percentUnit: '{0}%',
    barsUnit: '{0} bars',

    // Accessible names. Kept explicit rather than clever — screen-reader users
    // need to know which row and which step without inspecting the grid.
    stepLabel: '{0}, step {1}',
    stepStateOff: 'off',
    stepStateOn: 'on',
    stepStateAccent: 'accent',
    stepStateGhost: 'ghost',
    muteLabel: 'Mute {0}',
    gridLabel: 'Step grid. Arrow keys move, space toggles a step.',
    knobLabel: '{0}, {1}',

    // role="status" announcements — fired on transport and pattern changes only
    statusPlaying: 'Playing {0} at {1} BPM',
    statusStopped: 'Stopped',
    statusVariant: 'Switched to {0}',
    statusReset: 'Pattern reset to the example',

    rowTop: 'Steps 1–8',
    rowBottom: 'Steps 9–16',
    loading: 'Loading player…',
    noScript: 'This player needs JavaScript. The pattern is described in the text above.',

    tracks: {
      kick: 'Kick',
      kick2: 'FM Kick',
      snare: 'Snare',
      clap: 'Clap',
      rim: 'Rimshot',
      hhc: 'Closed hat',
      hho: 'Open hat',
      ride: 'Ride',
      cow: 'Cowbell',
      tom: 'Tom',
      shk: 'Shaker'
    },

    // Short forms for the narrow label column on phones
    tracksShort: {
      kick: 'Kick',
      kick2: 'FM',
      snare: 'Snr',
      clap: 'Clap',
      rim: 'Rim',
      hhc: 'HH',
      hho: 'HH o',
      ride: 'Ride',
      cow: 'Cow',
      tom: 'Tom',
      shk: 'Shk'
    },

    // Knob captions. These deliberately match the labels printed on the
    // device's own OLED parameter pages — the whole point of lesson 4 is that
    // what you learn here is what you see there.
    knobs: {
      freq: 'Freq',
      tone: 'Tone',
      decay: 'Decay',
      dirt: 'Dirt',
      noise: 'Noise',
      snap: 'Snap'
      ,fmEnv: 'Fm Env'
      ,fmDecay: 'Fm Decay'
      ,fmAccent: 'Fm Accent'
      ,carFreq: 'carFrq'
      ,carDecay: 'carDec'
      ,atkPitch: 'atkPit'
      ,sweepDecay: 'swpDec'
      ,modFreq: 'modFrq'
      ,modDecay: 'modDec'
      ,modFeedback: 'modFB'
      ,index: 'Index'
      ,ratio: 'Ratio'
      ,envSync: 'EnvSync'
      ,fm: 'FM'
      ,accent: 'Accent'
      ,scale: 'Scale'
      ,transient: 'Trans'
    }
  },

  /*
   * German. Empty strings fall back to English at runtime, so this block can be
   * filled in incrementally without breaking any page.
   */
  de: {
    play: 'Play',
    stop: 'Stop',
    tempo: 'Tempo',
    swing: 'Swing',
    bars: 'Takte',
    page: 'Seite',
    clear: 'Leeren',
    random: 'Zufall',
    reset: 'Pattern zurücksetzen',
    bpmUnit: '{0} BPM',
    percentUnit: '{0}%',
    barsUnit: '{0} Takte',

    stepLabel: '{0}, Step {1}',
    stepStateOff: 'aus',
    stepStateOn: 'an',
    stepStateAccent: 'Akzent',
    stepStateGhost: 'Ghost',
    muteLabel: '{0} stummschalten',
    gridLabel: 'Step-Raster. Pfeiltasten bewegen, Leertaste schaltet einen Step.',
    knobLabel: '{0}, {1}',

    statusPlaying: '{0} läuft mit {1} BPM',
    statusStopped: 'Gestoppt',
    statusVariant: 'Umgeschaltet auf {0}',
    statusReset: 'Pattern auf das Beispiel zurückgesetzt',

    rowTop: 'Steps 1–8',
    rowBottom: 'Steps 9–16',
    loading: 'Player wird geladen …',
    noScript: 'Dieser Player braucht JavaScript. Das Pattern steht im Text darüber.',

    tracks: {
      kick: 'Kick',
      kick2: 'FM Kick',
      snare: 'Snare',
      clap: 'Clap',
      rim: 'Rimshot',
      hhc: 'HiHat zu',
      hho: 'HiHat offen',
      ride: 'Ride',
      cow: 'Cowbell',
      tom: 'Tom',
      shk: 'Shaker'
    },

    tracksShort: {
      kick: 'Kick',
      kick2: 'FM',
      snare: 'Snr',
      clap: 'Clap',
      rim: 'Rim',
      hhc: 'HH zu',
      hho: 'HH auf',
      ride: 'Ride',
      cow: 'Cow',
      tom: 'Tom',
      shk: 'Shk'
    },

    // Knob captions stay English — they are the labels printed on the device.
    knobs: {
      freq: 'Freq',
      tone: 'Tone',
      decay: 'Decay',
      dirt: 'Dirt',
      noise: 'Noise',
      snap: 'Snap'
      ,fmEnv: 'Fm Env'
      ,fmDecay: 'Fm Decay'
      ,fmAccent: 'Fm Accent'
      ,carFreq: 'carFrq'
      ,carDecay: 'carDec'
      ,atkPitch: 'atkPit'
      ,sweepDecay: 'swpDec'
      ,modFreq: 'modFrq'
      ,modDecay: 'modDec'
      ,modFeedback: 'modFB'
      ,index: 'Index'
      ,ratio: 'Ratio'
      ,envSync: 'EnvSync'
      ,fm: 'FM'
      ,accent: 'Accent'
      ,scale: 'Scale'
      ,transient: 'Trans'
    }
  }
};
