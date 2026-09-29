import { mount } from '@je/client-web';
import { createInProcessHost } from './host';

const TURN_INTERVAL_MS = 1500;
const YEAR_WEEKS = 52;

const seed = new URLSearchParams(window.location.search).get('seed') ?? 'demo';
const { run, transport } = createInProcessHost(seed);
mount(document.getElementById('app') as HTMLElement, transport);

// The wall clock only paces the demo; simulation time is the run's own turn counter.
const timer = window.setInterval(() => {
  run.advanceTurn();
  if (run.turn >= YEAR_WEEKS) {
    window.clearInterval(timer);
    run.end();
  }
}, TURN_INTERVAL_MS);
