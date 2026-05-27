// SoundManager.ts - Advanced Web Audio API sound engine
// Beats Prakash's version: more sounds, better quality, volume control, keyboard shortcuts

class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private vol = 0.25;
  private lastPlay: Map<string, number> = new Map();
  private readonly DEBOUNCE = 50;

  private canPlay(id: string): boolean {
    const now = Date.now();
    const last = this.lastPlay.get(id) || 0;
    if (now - last < this.DEBOUNCE) return false;
    this.lastPlay.set(id, now);
    return true;
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.vol;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private out(): GainNode { this.getCtx(); return this.master!; }

  setVolume(v: number) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.muted ? 0 : this.vol;
  }

  toggle(): boolean {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : this.vol;
    return this.muted;
  }

  isMuted() { return this.muted; }

  // Cyber click - sharper than Prakash's
  click() {
    if (this.muted || !this.canPlay('click')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.05);
  }

  // Hover tick
  hover() {
    if (this.muted || !this.canPlay('hover')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 3200;
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.025);
  }

  // Boot beep sequence
  boot(pitch = 1) {
    if (this.muted) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square'; osc.frequency.value = 1400 * pitch;
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.1);
  }

  // Deploy whoosh - upgraded from Prakash's
  deploy() {
    if (this.muted) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    // Rising sweep
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.5);
    // Sub thump
    const sub = ctx.createOscillator(); const subG = ctx.createGain();
    sub.type = 'sine'; sub.frequency.setValueAtTime(55, t + 0.28);
    sub.frequency.exponentialRampToValueAtTime(20, t + 0.7);
    subG.gain.setValueAtTime(0, t); subG.gain.setValueAtTime(0.25, t + 0.28);
    subG.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    sub.connect(subG); subG.connect(out);
    sub.start(t + 0.28); sub.stop(t + 0.8);
    // Noise burst
    this.noise(0.12, 0.15);
  }

  // Card flip sound - unique, Prakash doesn't have this
  flip() {
    if (this.muted || !this.canPlay('flip')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.15);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.18);
  }

  // Success/confirm
  confirm() {
    if (this.muted || !this.canPlay('confirm')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    [0, 0.12, 0.22].forEach((d, i) => {
      const freqs = [523, 659, 784];
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freqs[i];
      gain.gain.setValueAtTime(0.08, t + d);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d + 0.15);
      osc.connect(gain); gain.connect(out);
      osc.start(t + d); osc.stop(t + d + 0.15);
    });
  }

  // Error sound
  error() {
    if (this.muted || !this.canPlay('error')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    [0, 0.14].forEach(d => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'square'; osc.frequency.value = 160;
      gain.gain.setValueAtTime(0.1, t + d);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d + 0.12);
      osc.connect(gain); gain.connect(out);
      osc.start(t + d); osc.stop(t + d + 0.12);
    });
  }

  // Ambient hum for loading
  hum(dur = 3) {
    if (this.muted) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 48;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.5);
    gain.gain.setValueAtTime(0.05, t + dur - 0.5);
    gain.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + dur);
  }

  // Notification ping - Prakash doesn't have this
  ping() {
    if (this.muted) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    [0, 0.1].forEach((d, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = i === 0 ? 880 : 1100;
      gain.gain.setValueAtTime(0.09, t + d);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d + 0.14);
      osc.connect(gain); gain.connect(out);
      osc.start(t + d); osc.stop(t + d + 0.14);
    });
  }

  // Section transition swoosh
  swoosh() {
    if (this.muted || !this.canPlay('swoosh')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.2);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.2);
  }

  // Type sound for terminal
  type() {
    if (this.muted || !this.canPlay('type')) return;
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200 + Math.random() * 400;
    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(gain); gain.connect(out);
    osc.start(t); osc.stop(t + 0.02);
  }

  private noise(vol: number, dur: number) {
    const ctx = this.getCtx(); const out = this.out(); const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 3500; filter.Q.value = 0.6;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter); filter.connect(gain); gain.connect(out);
    src.start(t); src.stop(t + dur);
  }
}

const soundManager = new SoundManager();
export default soundManager;
