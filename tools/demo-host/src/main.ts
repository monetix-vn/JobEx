import { mount } from '@je/client-web';
import type { Run } from '@je/kernel';
import { createInProcessHost, createSalesHost } from './host';

const TURN_INTERVAL_MS = 1500;

const params = new URLSearchParams(window.location.search);
const seed = params.get('seed') ?? 'demo';
const root = document.getElementById('app') as HTMLElement;

// Bundle the content packs into the page as raw text, keyed like a ContentSourcePort.
const contentFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../../content/**/*.json', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>,
  ).map(([path, text]) => [path.replace(/^.*\/content\//, ''), text]),
);

/** The wall clock only paces the demo; simulation time is the run's own turn counter. */
function pace(run: Run, turns: number, ready: () => boolean): void {
  const timer = window.setInterval(() => {
    if (!ready()) return;
    run.advanceTurn();
    if (run.turn >= turns) {
      window.clearInterval(timer);
      run.end();
    }
  }, TURN_INTERVAL_MS);
}

async function start(): Promise<void> {
  if (params.get('mode') === 'stubs') {
    const { run, transport } = createInProcessHost(seed);
    mount(root, transport);
    pace(run, 52, () => true);
  } else {
    // Default: the Sales Specialist's weeks, played by you. A week ends when its scenes are done.
    const locale = params.get('lang') === 'vi' ? 'vi' : 'en';
    const { run, transport, turns } = await createSalesHost({ files: contentFiles, seed, locale });
    mount(root, transport);
    let open = 0;
    run.observe((e) => {
      if (e.type === 'scene.started') open += 1;
      if (e.type === 'scene.ended') open -= 1;
    });
    pace(run, turns, () => open === 0);
  }
}

void start();
