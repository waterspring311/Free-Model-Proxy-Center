export class UsageReader {
  constructor(stream) {
    this.stream = stream;
    this.buffer = '';
    this.decoder = new TextDecoder();
    this.reported = false;
    this.input = 0;
    this.output = 0;
    this.cached = 0;
  }

  object(body) {
    if (!body || typeof body !== 'object') return;
    const usage = body.usage || body.response?.usage || body.message?.usage;
    if (usage && typeof usage === 'object') {
      this.reported = true;
      const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
      this.input = Math.max(this.input, number(usage.prompt_tokens ?? usage.input_tokens)
        + number(usage.cache_creation_input_tokens) + number(usage.cache_read_input_tokens));
      this.output = Math.max(this.output, number(usage.completion_tokens ?? usage.output_tokens));
      this.cached = Math.max(this.cached, number(usage.prompt_tokens_details?.cached_tokens),
        number(usage.input_tokens_details?.cached_tokens), number(usage.cache_read_input_tokens));
    }
  }

  chunk(bytes) {
    this.buffer += this.decoder.decode(bytes, { stream: true });
    if (this.stream) {
      let boundary;
      while ((boundary = this.buffer.indexOf('\n')) >= 0) {
        const line = this.buffer.slice(0, boundary).trimEnd();
        this.buffer = this.buffer.slice(boundary + 1);
        if (line.startsWith('data:')) {
          try { this.object(JSON.parse(line.slice(5).trim())); } catch { /* Non-JSON SSE sentinels pass through untouched. */ }
        }
      }
      if (this.buffer.length > 1024 * 1024) this.buffer = '';
    } else if (this.buffer.length > 64 * 1024 * 1024) {
      this.buffer = '';
    }
  }

  finish() {
    this.buffer += this.decoder.decode();
    if (!this.stream) {
      try { this.object(JSON.parse(this.buffer)); } catch { /* Usage is unknown when upstream did not report it. */ }
    } else if (this.buffer.startsWith('data:')) {
      try { this.object(JSON.parse(this.buffer.slice(5).trim())); } catch { /* Incomplete terminal event. */ }
    }
    return { input_tokens: this.input, output_tokens: this.output, cached_tokens: this.cached, usage_reported: +this.reported };
  }
}

export function dayStart() {
  const shifted = new Date(Date.now() + 8 * 3600 * 1000);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - 8 * 3600 * 1000).toISOString();
}
