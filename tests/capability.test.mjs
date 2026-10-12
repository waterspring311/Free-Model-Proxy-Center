import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assessCapability } from '../server/capability.mjs';

test('capability assessment returns a bounded composite and six dimensions', () => {
  const result = assessCapability({
    upstream_id: 'qwen3.8-max', context_length: 1000000, reasoning: true, tool_call: true,
    metadata: { input_modalities: ['text'] },
  });
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.match(result.grade, /^[SABCD]$/);
  assert.equal(result.dimensions.length, 6);
  assert.deepEqual(result.dimensions.map(row => row.key), ['reasoning', 'coding', 'longContext', 'tools', 'multimodal', 'efficiency']);
  assert.ok(result.dimensions.every(row => row.score >= 0 && row.score <= 100));
  assert.match(result.basis, /模型家族与版本公开信息/);
});

test('capability assessment prefers published benchmark metadata when available', () => {
  const result = assessCapability({
    upstream_id: 'nvidia/nemotron-3-ultra-550b-a55b:free', context_length: 1000000,
    supported_parameters: ['tools'], architecture: { input_modalities: ['text'] },
    benchmarks: { artificial_analysis: { intelligence_index: 22.9, coding_index: 49.3, agentic_index: 20.1 } },
  });
  assert.equal(result.confidence, 'high');
  assert.match(result.basis, /Artificial Analysis/);
  assert.equal(result.dimensions.find(row => row.key === 'reasoning').score, 91);
  assert.equal(result.dimensions.find(row => row.key === 'coding').score, 86);
});

test('specialized models are scored lower for general reasoning and coding', () => {
  const specialized = assessCapability({ upstream_id: 'qwen-mt-plus' });
  const general = assessCapability({ upstream_id: 'qwen3.8-max', context_length: 1000000, reasoning: true });
  assert.ok(specialized.score < general.score);
  assert.ok(specialized.dimensions.find(row => row.key === 'coding').score < general.dimensions.find(row => row.key === 'coding').score);
  assert.match(specialized.summary, /翻译专用/);
});