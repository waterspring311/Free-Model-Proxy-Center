import { PUBLIC_BENCHMARKS, PUBLIC_BENCHMARKS_META } from './public-benchmarks.mjs';

const DIMENSIONS = [
  { key: 'reasoning', label: '推理', weight: 0.28 },
  { key: 'coding', label: '编码', weight: 0.22 },
  { key: 'longContext', label: '长上下文', weight: 0.16 },
  { key: 'tools', label: '工具调用', weight: 0.16 },
  { key: 'multimodal', label: '多模态', weight: 0.08 },
  { key: 'efficiency', label: '响应效率', weight: 0.10 },
];

const PROFILES = {
  frontier: {
    label: '旗舰', reasoning: 92, coding: 90, tools: 92, efficiency: 68,
    summary: '旗舰级综合能力，适合复杂推理、代码和智能体任务。',
  },
  strong: {
    label: '高性能', reasoning: 84, coding: 83, tools: 84, efficiency: 78,
    summary: '综合能力较强，适合多数生产任务与复杂工作流。',
  },
  balanced: {
    label: '均衡', reasoning: 74, coding: 72, tools: 74, efficiency: 86,
    summary: '能力均衡，适合日常对话、检索和中等复杂度任务。',
  },
  light: {
    label: '轻量', reasoning: 60, coding: 58, tools: 60, efficiency: 93,
    summary: '轻量快速，适合分类、摘要和高并发简单任务。',
  },
  specialized: {
    label: '专用', reasoning: 48, coding: 38, tools: 35, efficiency: 88,
    summary: '专用能力模型，适合明确的单一场景，不适合通用复杂推理。',
  },
  unknown: {
    label: '未定级', reasoning: 64, coding: 61, tools: 63, efficiency: 78,
    summary: '公开资料有限，按通用聊天模型的保守基线评估。',
  },
};

const FAMILY_PROFILES = [
  { pattern: /qwen3\.8-2\.4t|qwen3\.8-max|deepseek-v4-pro|kimi-k3|glm-5\.3|nemotron-3-ultra|muse-spark-1\.3|(?:^|[/_-])inkling(?:$|[/_-])|step-5|hy4-preview-f/i, profile: 'frontier' },
  { pattern: /qwen3\.7-max|qwen3\.6-plus|deepseek-v4\.1|deepseek-v4-flash|glm-5\.2|minimax-m2\.5|nemotron-3-super|gemma-4-31b|longcat-2\.5|space-bunny|hy3|qwen3\.8-27b|qwen3\.7-plus|kimi-k2\.7|kimi-k2\.6|glm-5\.1|(?:^|[/_-])glm-5(?:$|[/_-])|qwen3\.5-397b/i, profile: 'strong' },
  { pattern: /qwen3\.6|qwen3\.5|qwen3\.7|qwen3\.8|qwen3-max|qwen3-plus|qwen3-flash|qwen3-coder|qwen3-vl|qwen3-omni|qwen-max|qwen-plus|qwen-flash|qwen-coder|qwen-vl|qwen-turbo|gemma-4-26b|nemotron-3\.5-lightning|dots-3-note|laguna-s|laguna-xs|apodex|north-mini-code|nemotron-3-nano/i, profile: 'balanced' },
  { pattern: /mini|nano|small|lite|2\.6b|4b|7b|8b|9b|29b|30b|31b|35b/i, profile: 'light' },
];

const SPECIAL_PROFILES = [
  { pattern: /(?:^|[/_-])(?:mt|translate)(?:$|[/_-])|hunyuan-mt|qwen-mt/i, profile: 'specialized', summary: '翻译专用模型，适合多语言转换，不适合通用推理和代码任务。' },
  { pattern: /ocr/i, profile: 'specialized', summary: 'OCR/视觉解析专用模型，适合文档识别，不适合通用对话。' },
  { pattern: /content-safety|guard/i, profile: 'specialized', summary: '内容安全专用模型，适合审核与分类，不适合作为通用助手。' },
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalizedID(row) {
  return String(row?.upstream_id || row?.id || '').toLowerCase();
}

function benchmarkKeys(value) {
  const raw = String(value || '').toLowerCase().trim();
  if (!raw) return [];
  const cleaned = raw.replace(/:free$/i, '').replace(/:batch$/i, '').replace(/-\d{8}$/, '');
  const base = cleaned.includes('/') ? cleaned.slice(cleaned.indexOf('/') + 1) : cleaned;
  return [...new Set([cleaned, base])];
}

const PUBLIC_BENCHMARK_INDEX = new Map();
for (const [id, entry] of Object.entries(PUBLIC_BENCHMARKS)) {
  for (const key of benchmarkKeys(id)) {
    if (!PUBLIC_BENCHMARK_INDEX.has(key)) PUBLIC_BENCHMARK_INDEX.set(key, entry);
  }
}

function publicBenchmark(row) {
  for (const key of benchmarkKeys(normalizedID(row))) {
    const entry = PUBLIC_BENCHMARK_INDEX.get(key);
    if (entry) return entry;
  }
  return null;
}

function inferContext(row, id) {
  const explicit = Number(row?.context_length || row?.context_window || row?.top_provider?.context_length || row?.metadata?.context_window);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  if (/qwen-long/.test(id)) return 10000000;
  if (/qwen3\.[5-8]|qwen3-(?:max|plus|flash|turbo|coder|vl|omni)/.test(id)) return 1000000;
  if (/qwen/.test(id)) return 131072;
  if (/nemotron|inkling|muse-spark|longcat|space-bunny|step-5|deepseek|kimi|glm|minimax|hy4|hy3|gemma/.test(id)) return 262144;
  return null;
}

function contextScore(context) {
  if (!context) return 62;
  if (context >= 1000000) return 96;
  if (context >= 500000) return 90;
  if (context >= 256000) return 84;
  if (context >= 200000) return 80;
  if (context >= 128000) return 74;
  if (context >= 64000) return 64;
  return 54;
}

function inputModalities(row) {
  const values = row?.architecture?.input_modalities || row?.metadata?.input_modalities;
  return Array.isArray(values) ? values.map(value => String(value).toLowerCase()) : [];
}

function multimodalScore(row, id) {
  const modalities = inputModalities(row);
  let score = 45;
  if (modalities.includes('image')) score += 18;
  if (modalities.includes('audio')) score += 14;
  if (modalities.includes('video')) score += 12;
  if (modalities.includes('pdf')) score += 8;
  if (modalities.length > 1) score += 4;
  if (/omni|vision|(?:^|[/_-])vl(?:$|[/_-])/.test(id)) score = Math.max(score, 78);
  if (/ocr/.test(id)) score = Math.max(score, 88);
  if (/audio|speech|tts|asr/.test(id)) score = Math.max(score, 92);
  return clamp(score);
}

function isReasoning(row) {
  const value = row?.reasoning ?? row?.supports_reasoning;
  return value === true || (value && typeof value === 'object' && (value.mandatory === true || value.default_enabled === true));
}

function hasTools(row) {
  const params = Array.isArray(row?.supported_parameters)
    ? row.supported_parameters.map(value => String(value).toLowerCase()) : [];
  return row?.tool_call === true || row?.structured_output === true || params.includes('tools') || params.includes('tool_choice');
}

function modelScale(id) {
  const trillion = id.match(/(?:^|[-_])(\d+(?:\.\d+)?)t(?:$|[-_])/);
  if (trillion) return Number(trillion[1]) * 1000;
  const billion = id.match(/(?:^|[-_])(\d+(?:\.\d+)?)b(?:$|[-_])/);
  return billion ? Number(billion[1]) : null;
}

function profileFor(id) {
  for (const item of SPECIAL_PROFILES) {
    if (item.pattern.test(id)) return { ...PROFILES[item.profile], summary: item.summary, confidence: 'medium', key: item.profile };
  }
  for (const item of FAMILY_PROFILES) {
    if (item.pattern.test(id)) return { ...PROFILES[item.profile], confidence: 'medium', key: item.profile };
  }
  return { ...PROFILES.unknown, confidence: 'low', key: 'unknown' };
}

function benchmarkScore(row) {
  const aa = row?.benchmarks?.artificial_analysis;
  if (!aa || typeof aa !== 'object') return null;
  const result = {};
  if (Number.isFinite(aa.intelligence_index)) result.reasoning = clamp(50 + aa.intelligence_index * 1.8);
  if (Number.isFinite(aa.coding_index)) result.coding = clamp(42 + aa.coding_index * 0.9);
  if (Number.isFinite(aa.agentic_index)) result.tools = clamp(45 + aa.agentic_index * 1.5);
  return Object.keys(result).length ? result : null;
}

function summaryFor(profile, dimensions) {
  if (profile.summary) return profile.summary;
  const ordered = [...dimensions].sort((a, b) => b.score - a.score);
  const strong = ordered.slice(0, 2).map(item => item.label).join('、');
  return `优势主要在${strong}；适合按该能力方向选择，综合表现处于相对${profile.label}档。`;
}

function basisFor(row, profile, context, referenceUsed = false) {
  const sources = [];
  if (row?.benchmarks?.artificial_analysis) {
    const snapshot = PUBLIC_BENCHMARKS_META.fetched_at ? '（OpenRouter 快照 ' + PUBLIC_BENCHMARKS_META.fetched_at.slice(0, 10) + '）' : '';
    sources.push('Artificial Analysis 公开基准' + snapshot);
  }
  if (row?.name || row?.description || row?.hugging_face_id) sources.push(referenceUsed ? 'OpenRouter 公开模型资料' : '上游模型资料');
  if (context) sources.push('上下文元数据');
  if (hasTools(row)) sources.push('工具调用元数据');
  if (inputModalities(row).length) sources.push('多模态元数据');
  if (!row?.benchmarks?.artificial_analysis) sources.push('模型家族与版本公开信息');
  if (profile.confidence === 'low') sources.push('保守基线');
  return sources.join(' · ');
}

export function assessCapability(row) {
  const reference = publicBenchmark(row);
  const referenceAA = reference?.benchmarks?.artificial_analysis || {};
  const directAA = row?.benchmarks?.artificial_analysis || {};
  const artificialAnalysis = { ...referenceAA, ...directAA };
  const sourceRow = reference ? {
    ...reference,
    ...row,
    benchmarks: { ...reference.benchmarks, ...row.benchmarks, artificial_analysis: artificialAnalysis },
  } : row;
  const id = normalizedID(sourceRow);
  const profile = profileFor(id);
  const context = inferContext(sourceRow, id);
  const size = modelScale(id);
  const dimensions = {
    reasoning: profile.reasoning,
    coding: profile.coding,
    longContext: contextScore(context),
    tools: profile.tools,
    multimodal: multimodalScore(sourceRow, id),
    efficiency: profile.efficiency,
  };

  if (isReasoning(sourceRow)) dimensions.reasoning += 4;
  if (hasTools(sourceRow)) dimensions.tools += 6;
  if (sourceRow?.structured_output === true) dimensions.tools += 3;
  if (/code|coder|codex|dev|program/i.test(id)) { dimensions.coding += 8; dimensions.tools += 3; }
  if (/flash|mini|lite|nano|small/i.test(id)) { dimensions.reasoning -= 3; dimensions.coding -= 3; dimensions.efficiency += 5; }
  if (/pro|max|ultra|opus|omni/i.test(id)) { dimensions.reasoning += 3; dimensions.coding += 2; dimensions.efficiency -= 3; }
  if (size !== null) {
    if (size >= 400) { dimensions.reasoning += 5; dimensions.coding += 4; dimensions.efficiency -= 6; }
    else if (size >= 100) { dimensions.reasoning += 3; dimensions.coding += 3; dimensions.efficiency -= 4; }
    else if (size >= 30) { dimensions.reasoning += 1; dimensions.coding += 1; }
    else if (size < 10) { dimensions.reasoning -= 3; dimensions.coding -= 2; dimensions.efficiency += 4; }
  }
  if (context >= 500000) dimensions.efficiency -= 4;

  const benchmark = benchmarkScore(sourceRow);
  if (benchmark) {
    Object.assign(dimensions, benchmark);
    profile.confidence = 'high';
  }

  const normalized = DIMENSIONS.map(item => ({ key: item.key, label: item.label, score: clamp(dimensions[item.key]) }));
  const score = clamp(normalized.reduce((total, item) => total + item.score * DIMENSIONS.find(d => d.key === item.key).weight, 0));
  const grade = score >= 90 ? 'S' : score >= 85 ? 'A' : score >= 75 ? 'B' : score >= 65 ? 'C' : 'D';
  return {
    score,
    grade,
    label: profile.label,
    confidence: profile.confidence,
    summary: summaryFor(profile, normalized),
    basis: basisFor(sourceRow, profile, context, !!reference),
    dimensions: normalized,
  };
}
