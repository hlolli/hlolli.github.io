import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve(process.argv[2] ?? 'dist/naviergrain');
for (const file of ['index.html', 'app.js', 'live.worker.js', 'audio.worklet.js',
  'licenses/LICENSE', 'licenses/COPYRIGHT']) {
  assert(readFileSync(resolve(directory, file)).length > 0, file);
}
const module = await WebAssembly.compile(readFileSync(resolve(directory, 'fluidgrain-live.wasm')));
assert.deepEqual(WebAssembly.Module.imports(module), [], 'WASM must be self-contained');
const { exports: engine } = await WebAssembly.instantiate(module, {});
const live = engine.fg_live_create(48000, -1);
assert(live, 'Engine creation failed');
let energy = 0;
try {
  for (let frame = 0; frame < 96; frame++) {
    assert(engine.fg_live_render(live, 512), 'Audio render failed');
    const audio = new Float64Array(engine.memory.buffer, engine.fg_live_audio(live), 1024);
    for (const sample of audio) {
      assert(Number.isFinite(sample), 'Non-finite audio');
      energy += sample * sample;
    }
  }
  assert(energy > 0, 'Silent audio');
  const pointer = engine.fg_live_particles(live);
  const header = new Float64Array(engine.memory.buffer, pointer, 10);
  assert(header[2] > 0 && header[2] <= 256, 'Invalid grain count');
} finally {
  engine.fg_live_destroy(live);
}
console.log('naviergrain: browser assets, WASM initialization and finite audio passed');
