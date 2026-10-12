// Generated from OpenRouter public model metadata and Artificial Analysis indices.
// Source: https://openrouter.ai/api/v1/models
export const PUBLIC_BENCHMARKS_META = {
  "source": "https://openrouter.ai/api/v1/models",
  "fetched_at": "2026-10-12T04:47:05.880Z",
  "model_count": 284
};

export const PUBLIC_BENCHMARKS = {
  "anthropic/claude-haiku-5.5": {
    "name": "Anthropic: Claude Haiku 5.5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 43.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-haiku-5.5:batch": {
    "name": "Anthropic: Claude Haiku 5.5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 43.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "inclusionai/ling-3.1-flash": {
    "name": "inclusionAI: Ling 3.1 Flash",
    "hugging_face_id": null,
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 41.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6.1-sol": {
    "name": "OpenAI: GPT-6.1 Sol",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 51.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6.1-sol:batch": {
    "name": "OpenAI: GPT-6.1 Sol (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 51.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-sonnet-5.5": {
    "name": "Anthropic: Claude Sonnet 5.5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 56,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-sonnet-5.5:batch": {
    "name": "Anthropic: Claude Sonnet 5.5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 56,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "upstage/solar-mini4": {
    "name": "Upstage: Solar Mini 4",
    "hugging_face_id": null,
    "context_length": 524288,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6-luna": {
    "name": "OpenAI: GPT-6 Luna",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6-luna:batch": {
    "name": "OpenAI: GPT-6 Luna (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6-sol": {
    "name": "OpenAI: GPT-6 Sol",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 47.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6-sol:batch": {
    "name": "OpenAI: GPT-6 Sol (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 47.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-5.5": {
    "name": "Anthropic: Claude Opus 5.5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 57.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-5.5:batch": {
    "name": "Anthropic: Claude Opus 5.5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 57.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "xiaomi/mimo-v2.6-flash": {
    "name": "Xiaomi: MiMo-V2.6-Flash",
    "hugging_face_id": "XiaomiMiMo/MiMo-V2.6-Flash-RL",
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 37.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "xiaomi/mimo-v2.6-pro": {
    "name": "Xiaomi: MiMo-V2.6-Pro",
    "hugging_face_id": "XiaomiMiMo/MiMo-V2.6-Pro-RL",
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 46.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "x-ai/grok-4.7": {
    "name": "SpaceXAI: Grok 4.7",
    "hugging_face_id": null,
    "context_length": 500000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 46.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "inclusionai/ling-3.0-flash-vl": {
    "name": "inclusionAI: Ling 3.0 Flash VL",
    "hugging_face_id": "inclusionAI/Ling-3.0-flash-VL",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.6,
        "coding_index": 57,
        "agentic_index": 28.7
      }
    }
  },
  "deepseek/deepseek-v4.1-flash": {
    "name": "DeepSeek: DeepSeek V4.1 Flash",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4.1-Flash",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "deepseek/deepseek-v4.1-flash:batch": {
    "name": "DeepSeek: DeepSeek V4.1 Flash (batch)",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4.1-Flash",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "inception/mercury-2.5": {
    "name": "Inception: Mercury 2.5",
    "hugging_face_id": null,
    "context_length": 260000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-6-astra": {
    "name": "OpenAI: GPT-6 Astra",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 52.7,
        "coding_index": 76.9,
        "agentic_index": 51
      }
    }
  },
  "openai/gpt-6-astra:batch": {
    "name": "OpenAI: GPT-6 Astra (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 52.7,
        "coding_index": 76.9,
        "agentic_index": 51
      }
    }
  },
  "qwen/qwen3.8-max-0902": {
    "name": "Qwen: Qwen3.8 Max (0902)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "xhigh"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 45.4,
        "coding_index": 76.2,
        "agentic_index": 56
      }
    }
  },
  "meta/muse-spark-1.3": {
    "name": "Meta: Muse Spark 1.3",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 48.1,
        "coding_index": 75.8,
        "agentic_index": 55.5
      }
    }
  },
  "google/gemini-3.8-flash": {
    "name": "Google: Gemini 3.8 Flash",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 40.9,
        "coding_index": 76.3,
        "agentic_index": 40.2
      }
    }
  },
  "google/gemini-3.8-flash:batch": {
    "name": "Google: Gemini 3.8 Flash (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 40.9,
        "coding_index": 76.3,
        "agentic_index": 40.2
      }
    }
  },
  "anthropic/claude-fable-5.1": {
    "name": "Anthropic: Claude Fable 5.1",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 53.4,
        "coding_index": 81.6,
        "agentic_index": 57.9
      }
    }
  },
  "anthropic/claude-fable-5.1:batch": {
    "name": "Anthropic: Claude Fable 5.1 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 53.4,
        "coding_index": 81.6,
        "agentic_index": 57.9
      }
    }
  },
  "ibm-granite/granite-4.2-8b": {
    "name": "IBM: Granite 4.2 8B",
    "hugging_face_id": "ibm-granite/granite-4.2-8b",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "low",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.1,
        "coding_index": 22.4,
        "agentic_index": 1.3
      }
    }
  },
  "inclusionai/ling-3.0-flash-fin": {
    "name": "inclusionAI: Ling 3.0 Flash Fin",
    "hugging_face_id": null,
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.6,
        "coding_index": 55.6,
        "agentic_index": 27.9
      }
    }
  },
  "z-ai/glm-5.3-flash": {
    "name": "Z.ai: GLM 5.3 Flash",
    "hugging_face_id": "zai-org/GLM-5.3-Flash",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "max"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 41.8,
        "coding_index": 71.5,
        "agentic_index": 50.9
      }
    }
  },
  "z-ai/glm-5.3-flash:batch": {
    "name": "Z.ai: GLM 5.3 Flash (batch)",
    "hugging_face_id": "zai-org/GLM-5.3-Flash",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "max"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 41.8,
        "coding_index": 71.5,
        "agentic_index": 50.9
      }
    }
  },
  "deepseek/deepseek-v4-flash-vision-exp": {
    "name": "DeepSeek: DeepSeek V4 Flash Vision Exp",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4-Flash-Vision-Exp",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 34.8,
        "coding_index": 65,
        "agentic_index": 47.5
      }
    }
  },
  "z-ai/glm-5.3": {
    "name": "Z.ai: GLM 5.3",
    "hugging_face_id": "zai-org/GLM-5.3",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "max"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 44.8,
        "coding_index": 74.8,
        "agentic_index": 53.1
      }
    }
  },
  "z-ai/glm-5.3:batch": {
    "name": "Z.ai: GLM 5.3 (batch)",
    "hugging_face_id": "zai-org/GLM-5.3",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "max"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 44.8,
        "coding_index": 74.8,
        "agentic_index": 53.1
      }
    }
  },
  "qwen/qwen3.8-27b": {
    "name": "Qwen: Qwen3.8 27B",
    "hugging_face_id": "Qwen/Qwen3.8-27B",
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_a",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "medium",
        "low"
      ],
      "default_effort": "xhigh"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 33.7,
        "coding_index": 68.1,
        "agentic_index": 45.8
      }
    }
  },
  "google/gemini-3.7-flash": {
    "name": "Google: Gemini 3.7 Flash",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39.6,
        "coding_index": 71.5,
        "agentic_index": null
      }
    }
  },
  "google/gemini-3.7-flash:batch": {
    "name": "Google: Gemini 3.7 Flash (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39.6,
        "coding_index": 71.5,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3.8-2.4t-a95b": {
    "name": "Qwen: Qwen3.8 2.4T A95B",
    "hugging_face_id": "Qwen/Qwen3.8-2.4T-A95B",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "medium",
        "low"
      ],
      "default_effort": "xhigh"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39.9,
        "coding_index": 71.9,
        "agentic_index": 50.1
      }
    }
  },
  "deepseek/deepseek-v4-pro-0813": {
    "name": "DeepSeek: DeepSeek V4 Pro 0813",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4-Pro-0813",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 36,
        "coding_index": 68.8,
        "agentic_index": 41.3
      }
    }
  },
  "x-ai/grok-4.6": {
    "name": "SpaceXAI: Grok 4.6",
    "hugging_face_id": null,
    "context_length": 500000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 44.3,
        "coding_index": 76.8,
        "agentic_index": 53
      }
    }
  },
  "liquid/lfm-2.5-2.6b:free": {
    "name": "LiquidAI: LFM2.5-2.6B (free)",
    "hugging_face_id": "LiquidAI/LFM2.5-2.6B",
    "context_length": 65536,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.4,
        "coding_index": 7.7,
        "agentic_index": null
      }
    }
  },
  "nvidia/nemotron-3.5-lightning": {
    "name": "NVIDIA: Nemotron 3.5 Lightning",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.9,
        "coding_index": 26.8,
        "agentic_index": 3.5
      }
    }
  },
  "nvidia/nemotron-3.5-lightning:free": {
    "name": "NVIDIA: Nemotron 3.5 Lightning (free)",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16",
    "context_length": 1000000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "seed",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.9,
        "coding_index": 26.8,
        "agentic_index": 3.5
      }
    }
  },
  "upstage/solar-pro4": {
    "name": "Upstage: Solar Pro 4",
    "hugging_face_id": null,
    "context_length": 524288,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 28.2,
        "coding_index": 52.7,
        "agentic_index": null
      }
    }
  },
  "meta/muse-glimmer-30b": {
    "name": "Meta: Muse Glimmer 30B",
    "hugging_face_id": "meta-models/Muse-Glimmer-30B",
    "context_length": 131072,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 17.5,
        "coding_index": 49,
        "agentic_index": 8.5
      }
    }
  },
  "meta/muse-spark-1.2": {
    "name": "Meta: Muse Spark 1.2",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39.6,
        "coding_index": 72.2,
        "agentic_index": 43.2
      }
    }
  },
  "deepseek/deepseek-v4-flash-0731": {
    "name": "DeepSeek: DeepSeek V4 Flash 0731",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4-Flash-0731",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_a",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 34.3,
        "coding_index": 69.1,
        "agentic_index": 41
      }
    }
  },
  "thinkingmachines/inkling-small": {
    "name": "Thinking Machines: Inkling Small",
    "hugging_face_id": "thinkingmachines/Inkling-Small",
    "context_length": 524288,
    "architecture": {
      "modality": "text+image+audio->text",
      "input_modalities": [
        "text",
        "image",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.7,
        "coding_index": 52.9,
        "agentic_index": 23.5
      }
    }
  },
  "thinkingmachines/inkling-small:free": {
    "name": "Thinking Machines: Inkling Small (free)",
    "hugging_face_id": "thinkingmachines/Inkling-Small",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+audio->text",
      "input_modalities": [
        "text",
        "image",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "seed",
      "stop",
      "temperature",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.7,
        "coding_index": 52.9,
        "agentic_index": 23.5
      }
    }
  },
  "anthropic/claude-opus-5": {
    "name": "Anthropic: Claude Opus 5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 50.8,
        "coding_index": 78,
        "agentic_index": 56.5
      }
    }
  },
  "anthropic/claude-opus-5:batch": {
    "name": "Anthropic: Claude Opus 5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 50.8,
        "coding_index": 78,
        "agentic_index": 56.5
      }
    }
  },
  "inclusionai/ling-3.0-flash": {
    "name": "inclusionAI: Ling 3.0 Flash",
    "hugging_face_id": "inclusionAI/Ling-3.0-flash",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.1,
        "coding_index": 50.6,
        "agentic_index": 19.3
      }
    }
  },
  "google/gemini-3.6-flash": {
    "name": "Google: Gemini 3.6 Flash",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 34,
        "coding_index": 69.2,
        "agentic_index": 29
      }
    }
  },
  "google/gemini-3.6-flash:batch": {
    "name": "Google: Gemini 3.6 Flash (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 34,
        "coding_index": 69.2,
        "agentic_index": 29
      }
    }
  },
  "google/gemini-3.5-flash-lite": {
    "name": "Google: Gemini 3.5 Flash Lite",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "minimal"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.2,
        "coding_index": 49.3,
        "agentic_index": 14.3
      }
    }
  },
  "google/gemini-3.5-flash-lite:batch": {
    "name": "Google: Gemini 3.5 Flash Lite (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "minimal"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.2,
        "coding_index": 49.3,
        "agentic_index": 14.3
      }
    }
  },
  "meituan/longcat-2.0": {
    "name": "Meituan: LongCat 2.0",
    "hugging_face_id": "meituan-longcat/LongCat-2.0",
    "context_length": 1048756,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supports_max_tokens": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 19.1,
        "coding_index": 45.3,
        "agentic_index": 14
      }
    }
  },
  "thinkingmachines/inkling": {
    "name": "Thinking Machines: Inkling",
    "hugging_face_id": "thinkingmachines/Inkling",
    "context_length": 524288,
    "architecture": {
      "modality": "text+image+audio->text",
      "input_modalities": [
        "text",
        "image",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25,
        "coding_index": 52.1,
        "agentic_index": 22.5
      }
    }
  },
  "thinkingmachines/inkling:free": {
    "name": "Thinking Machines: Inkling (free)",
    "hugging_face_id": "thinkingmachines/Inkling",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+audio->text",
      "input_modalities": [
        "text",
        "image",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "seed",
      "stop",
      "temperature",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25,
        "coding_index": 52.1,
        "agentic_index": 22.5
      }
    }
  },
  "moonshotai/kimi-k3": {
    "name": "MoonshotAI: Kimi K3",
    "hugging_face_id": "moonshotai/Kimi-K3",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "max"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 43.6,
        "coding_index": 76.2,
        "agentic_index": 50
      }
    }
  },
  "moonshotai/kimi-k3:batch": {
    "name": "MoonshotAI: Kimi K3 (batch)",
    "hugging_face_id": "moonshotai/Kimi-K3",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "high",
        "low"
      ],
      "default_effort": "max"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 43.6,
        "coding_index": 76.2,
        "agentic_index": 50
      }
    }
  },
  "meta/muse-spark-1.1": {
    "name": "Meta: Muse Spark 1.1",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 33.7,
        "coding_index": 71.3,
        "agentic_index": 25.8
      }
    }
  },
  "openai/gpt-5.6-luna": {
    "name": "OpenAI: GPT-5.6 Luna",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 37.3,
        "coding_index": 71.4,
        "agentic_index": 42.1
      }
    }
  },
  "openai/gpt-5.6-luna:batch": {
    "name": "OpenAI: GPT-5.6 Luna (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 37.3,
        "coding_index": 71.4,
        "agentic_index": 42.1
      }
    }
  },
  "openai/gpt-5.6-terra": {
    "name": "OpenAI: GPT-5.6 Terra",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 42.1,
        "coding_index": 76.7,
        "agentic_index": 43.2
      }
    }
  },
  "openai/gpt-5.6-terra:batch": {
    "name": "OpenAI: GPT-5.6 Terra (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 42.1,
        "coding_index": 76.7,
        "agentic_index": 43.2
      }
    }
  },
  "openai/gpt-5.6-sol": {
    "name": "OpenAI: GPT-5.6 Sol",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 47,
        "coding_index": 77.4,
        "agentic_index": 50.2
      }
    }
  },
  "openai/gpt-5.6-sol:batch": {
    "name": "OpenAI: GPT-5.6 Sol (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 47,
        "coding_index": 77.4,
        "agentic_index": 50.2
      }
    }
  },
  "x-ai/grok-4.5": {
    "name": "SpaceXAI: Grok 4.5",
    "hugging_face_id": null,
    "context_length": 500000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.8,
        "coding_index": 72.4,
        "agentic_index": 41.2
      }
    }
  },
  "anthropic/claude-sonnet-5": {
    "name": "Anthropic: Claude Sonnet 5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.2,
        "coding_index": 71.5,
        "agentic_index": 43.6
      }
    }
  },
  "anthropic/claude-sonnet-5:batch": {
    "name": "Anthropic: Claude Sonnet 5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.2,
        "coding_index": 71.5,
        "agentic_index": 43.6
      }
    }
  },
  "cohere/north-mini-code:free": {
    "name": "Cohere: North Mini Code (free)",
    "hugging_face_id": "CohereLabs/North-Mini-Code-1.0",
    "context_length": 256000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Cohere",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.9,
        "coding_index": 36.5,
        "agentic_index": 1.1
      }
    }
  },
  "z-ai/glm-5.2": {
    "name": "Z.ai: GLM 5.2",
    "hugging_face_id": "zai-org/GLM-5.2",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "high"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 33.7,
        "coding_index": 68.8,
        "agentic_index": 38.4
      }
    }
  },
  "moonshotai/kimi-k2.7-code": {
    "name": "MoonshotAI: Kimi K2.7 Code",
    "hugging_face_id": "moonshotai/Kimi-K2.7-Code",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.8,
        "coding_index": 60.8,
        "agentic_index": 21
      }
    }
  },
  "anthropic/claude-fable-5": {
    "name": "Anthropic: Claude Fable 5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 49.6,
        "coding_index": 76.5,
        "agentic_index": 50.7
      }
    }
  },
  "anthropic/claude-fable-5:batch": {
    "name": "Anthropic: Claude Fable 5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 49.6,
        "coding_index": 76.5,
        "agentic_index": 50.7
      }
    }
  },
  "nvidia/nemotron-3-ultra-550b-a55b": {
    "name": "NVIDIA: Nemotron 3 Ultra",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supports_max_tokens": true,
      "supported_efforts": [
        "high",
        "medium"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.9,
        "coding_index": 49.3,
        "agentic_index": 20.1
      }
    }
  },
  "nvidia/nemotron-3-ultra-550b-a55b:free": {
    "name": "NVIDIA: Nemotron 3 Ultra (free)",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16",
    "context_length": 1000000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "seed",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supports_max_tokens": true,
      "supported_efforts": [
        "high",
        "medium"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.9,
        "coding_index": 49.3,
        "agentic_index": 20.1
      }
    }
  },
  "qwen/qwen3.7-plus": {
    "name": "Qwen: Qwen3.7 Plus",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.2,
        "coding_index": 55.9,
        "agentic_index": 17.5
      }
    }
  },
  "minimax/minimax-m3": {
    "name": "MiniMax: MiniMax M3",
    "hugging_face_id": "MiniMaxAI/Minimax-M3",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 29.2,
        "coding_index": 58.6,
        "agentic_index": 29.5
      }
    }
  },
  "stepfun/step-3.7-flash": {
    "name": "StepFun: Step 3.7 Flash",
    "hugging_face_id": "stepfun-ai/Step-3.7-Flash",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 19.5,
        "coding_index": 39.6,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.8": {
    "name": "Anthropic: Claude Opus 4.8",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 41.8,
        "coding_index": 74.3,
        "agentic_index": 41.9
      }
    }
  },
  "anthropic/claude-opus-4.8:batch": {
    "name": "Anthropic: Claude Opus 4.8 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 41.8,
        "coding_index": 74.3,
        "agentic_index": 41.9
      }
    }
  },
  "qwen/qwen3.7-max": {
    "name": "Qwen: Qwen3.7 Max",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 29.5,
        "coding_index": 66,
        "agentic_index": 22.5
      }
    }
  },
  "x-ai/grok-build-0.1": {
    "name": "SpaceXAI: Grok Build 0.1",
    "hugging_face_id": null,
    "context_length": 256000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 27.2,
        "coding_index": 51.5,
        "agentic_index": null
      }
    }
  },
  "google/gemini-3.5-flash": {
    "name": "Google: Gemini 3.5 Flash",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 33.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-3.5-flash:batch": {
    "name": "Google: Gemini 3.5 Flash (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 33.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "x-ai/grok-4.3": {
    "name": "SpaceXAI: Grok 4.3",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "low"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.9,
        "coding_index": 42.2,
        "agentic_index": 15.5
      }
    }
  },
  "x-ai/grok-4.3:batch": {
    "name": "SpaceXAI: Grok 4.3 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "low"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.9,
        "coding_index": 42.2,
        "agentic_index": 15.5
      }
    }
  },
  "mistralai/mistral-medium-3-5": {
    "name": "Mistral: Mistral Medium 3.5",
    "hugging_face_id": null,
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "high",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 14.2,
        "coding_index": 46.9,
        "agentic_index": 7
      }
    }
  },
  "mistralai/mistral-medium-3-5:batch": {
    "name": "Mistral: Mistral Medium 3.5 (batch)",
    "hugging_face_id": null,
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "high",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 14.2,
        "coding_index": 46.9,
        "agentic_index": 7
      }
    }
  },
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free": {
    "name": "NVIDIA: Nemotron 3 Nano Omni (free)",
    "hugging_face_id": "nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16",
    "context_length": 256000,
    "architecture": {
      "modality": "text+image+audio+video->text",
      "input_modalities": [
        "text",
        "audio",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "seed",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supports_max_tokens": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10.3,
        "coding_index": 13.8,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3.6-35b-a3b": {
    "name": "Qwen: Qwen3.6 35B A3B",
    "hugging_face_id": "Qwen/Qwen3.6-35B-A3B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 18.2,
        "coding_index": 41.9,
        "agentic_index": 13.1
      }
    }
  },
  "qwen/qwen3.6-27b": {
    "name": "Qwen: Qwen3.6 27B",
    "hugging_face_id": "Qwen/Qwen3.6-27B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 21.4,
        "coding_index": 53.7,
        "agentic_index": 18.5
      }
    }
  },
  "openai/gpt-5.5": {
    "name": "OpenAI: GPT-5.5",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.4,
        "coding_index": 74.9,
        "agentic_index": 36.4
      }
    }
  },
  "openai/gpt-5.5:batch": {
    "name": "OpenAI: GPT-5.5 (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 38.4,
        "coding_index": 74.9,
        "agentic_index": 36.4
      }
    }
  },
  "deepseek/deepseek-v4-pro": {
    "name": "DeepSeek: DeepSeek V4 Pro 0423",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4-Pro",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "xhigh",
        "high"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 30.4,
        "coding_index": 59.4,
        "agentic_index": 26.3
      }
    }
  },
  "deepseek/deepseek-v4-flash": {
    "name": "DeepSeek: DeepSeek V4 Flash 0423",
    "hugging_face_id": "deepseek-ai/DeepSeek-V4-Flash",
    "context_length": 1048576,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_a",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "xhigh",
        "high"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.4,
        "coding_index": 52,
        "agentic_index": 26.3
      }
    }
  },
  "tencent/hy3-preview": {
    "name": "Tencent: Hy3 preview",
    "hugging_face_id": "tencent/Hy3-preview",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "seed",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "low",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.3,
        "coding_index": 58.8,
        "agentic_index": 24.1
      }
    }
  },
  "xiaomi/mimo-v2.5-pro": {
    "name": "Xiaomi: MiMo-V2.5-Pro",
    "hugging_face_id": "XiaomiMiMo/MiMo-V2.5-Pro",
    "context_length": 1050000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 26,
        "coding_index": 60.2,
        "agentic_index": 21.3
      }
    }
  },
  "xiaomi/mimo-v2.5": {
    "name": "Xiaomi: MiMo-V2.5",
    "hugging_face_id": "XiaomiMiMo/MiMo-V2.5",
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+audio+video->text",
      "input_modalities": [
        "text",
        "audio",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.2,
        "coding_index": 56.8,
        "agentic_index": 15.8
      }
    }
  },
  "moonshotai/kimi-k2.6": {
    "name": "MoonshotAI: Kimi K2.6",
    "hugging_face_id": "moonshotai/Kimi-K2.6",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 27,
        "coding_index": 61.8,
        "agentic_index": 20.5
      }
    }
  },
  "anthropic/claude-opus-4.7": {
    "name": "Anthropic: Claude Opus 4.7",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 40.7,
        "coding_index": 73.6,
        "agentic_index": 38.6
      }
    }
  },
  "anthropic/claude-opus-4.7:batch": {
    "name": "Anthropic: Claude Opus 4.7 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "max",
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 40.7,
        "coding_index": 73.6,
        "agentic_index": 38.6
      }
    }
  },
  "z-ai/glm-5.1": {
    "name": "Z.ai: GLM 5.1",
    "hugging_face_id": "zai-org/GLM-5.1",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 26.1,
        "coding_index": 55.8,
        "agentic_index": 23.9
      }
    }
  },
  "google/gemma-4-26b-a4b-it": {
    "name": "Google: Gemma 4 26B A4B ",
    "hugging_face_id": "google/gemma-4-26B-A4B-it",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemma",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.7,
        "coding_index": 39.3,
        "agentic_index": 2.9
      }
    }
  },
  "google/gemma-4-26b-a4b-it:free": {
    "name": "Google: Gemma 4 26B A4B  (free)",
    "hugging_face_id": "google/gemma-4-26B-A4B-it",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemma",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.7,
        "coding_index": 39.3,
        "agentic_index": 2.9
      }
    }
  },
  "google/gemma-4-31b-it": {
    "name": "Google: Gemma 4 31B",
    "hugging_face_id": "google/gemma-4-31B-it",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemma",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 14.7,
        "coding_index": 43.4,
        "agentic_index": 4.2
      }
    }
  },
  "google/gemma-4-31b-it:free": {
    "name": "Google: Gemma 4 31B (free)",
    "hugging_face_id": "google/gemma-4-31B-it",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemma",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 14.7,
        "coding_index": 43.4,
        "agentic_index": 4.2
      }
    }
  },
  "qwen/qwen3.6-plus": {
    "name": "Qwen: Qwen3.6 Plus",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 27,
        "coding_index": 54.5,
        "agentic_index": null
      }
    }
  },
  "z-ai/glm-5v-turbo": {
    "name": "Z.ai: GLM 5V Turbo",
    "hugging_face_id": null,
    "context_length": 202752,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 23.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "arcee-ai/trinity-large-thinking": {
    "name": "Arcee AI: Trinity Large Thinking",
    "hugging_face_id": "arcee-ai/Trinity-Large-Thinking",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10.8,
        "coding_index": 25.8,
        "agentic_index": 1
      }
    }
  },
  "x-ai/grok-4.20": {
    "name": "SpaceXAI: Grok 4.20",
    "hugging_face_id": null,
    "context_length": 2000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Grok",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 25.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "minimax/minimax-m2.7": {
    "name": "MiniMax: MiniMax M2.7",
    "hugging_face_id": "MiniMaxAI/MiniMax-M2.7",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.8,
        "coding_index": 52.6,
        "agentic_index": 15.3
      }
    }
  },
  "openai/gpt-5.4-nano": {
    "name": "OpenAI: GPT-5.4 Nano",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.7,
        "coding_index": 56.1,
        "agentic_index": 16
      }
    }
  },
  "openai/gpt-5.4-nano:batch": {
    "name": "OpenAI: GPT-5.4 Nano (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.7,
        "coding_index": 56.1,
        "agentic_index": 16
      }
    }
  },
  "openai/gpt-5.4-mini": {
    "name": "OpenAI: GPT-5.4 Mini",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.1,
        "coding_index": 56.1,
        "agentic_index": 17.9
      }
    }
  },
  "openai/gpt-5.4-mini:batch": {
    "name": "OpenAI: GPT-5.4 Mini (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.1,
        "coding_index": 56.1,
        "agentic_index": 17.9
      }
    }
  },
  "mistralai/mistral-small-2603": {
    "name": "Mistral: Mistral Small 4",
    "hugging_face_id": "mistralai/Mistral-Small-4-119B-2603",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "high",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.3,
        "coding_index": 26.6,
        "agentic_index": 0.8
      }
    }
  },
  "mistralai/mistral-small-2603:batch": {
    "name": "Mistral: Mistral Small 4 (batch)",
    "hugging_face_id": "mistralai/Mistral-Small-4-119B-2603",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "high",
        "none"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.3,
        "coding_index": 26.6,
        "agentic_index": 0.8
      }
    }
  },
  "z-ai/glm-5-turbo": {
    "name": "Z.ai: GLM 5 Turbo",
    "hugging_face_id": null,
    "context_length": 202752,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 26.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "nvidia/nemotron-3-super-120b-a12b": {
    "name": "NVIDIA: Nemotron 3 Super",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supports_max_tokens": true,
      "supported_efforts": [
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.8,
        "coding_index": 37.7,
        "agentic_index": 1.7
      }
    }
  },
  "nvidia/nemotron-3-super-120b-a12b:free": {
    "name": "NVIDIA: Nemotron 3 Super (free)",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supports_max_tokens": true,
      "supported_efforts": [
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.8,
        "coding_index": 37.7,
        "agentic_index": 1.7
      }
    }
  },
  "qwen/qwen3.5-9b": {
    "name": "Qwen: Qwen3.5-9B",
    "hugging_face_id": "Qwen/Qwen3.5-9B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13.3,
        "coding_index": 23.5,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.4": {
    "name": "OpenAI: GPT-5.4",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39,
        "coding_index": 71.1,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.4:batch": {
    "name": "OpenAI: GPT-5.4 (batch)",
    "hugging_face_id": null,
    "context_length": 1050000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 39,
        "coding_index": 71.1,
        "agentic_index": null
      }
    }
  },
  "inception/mercury-2": {
    "name": "Inception: Mercury 2",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13.8,
        "coding_index": 31.1,
        "agentic_index": 1.6
      }
    }
  },
  "google/gemini-3.1-flash-lite-preview": {
    "name": "Google: Gemini 3.1 Flash Lite Preview",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "minimal"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 15.6,
        "coding_index": 34.7,
        "agentic_index": 1.6
      }
    }
  },
  "qwen/qwen3.5-35b-a3b": {
    "name": "Qwen: Qwen3.5-35B-A3B",
    "hugging_face_id": "Qwen/Qwen3.5-35B-A3B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 19.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3.5-27b": {
    "name": "Qwen: Qwen3.5-27B",
    "hugging_face_id": "Qwen/Qwen3.5-27B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3.5-122b-a10b": {
    "name": "Qwen: Qwen3.5-122B-A10B",
    "hugging_face_id": "Qwen/Qwen3.5-122B-A10B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 17.7,
        "coding_index": 43.3,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.3-codex": {
    "name": "OpenAI: GPT-5.3-Codex",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 32.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-3.1-pro-preview": {
    "name": "Google: Gemini 3.1 Pro Preview",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "audio",
        "file",
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 29.7,
        "coding_index": 68.8,
        "agentic_index": 8.2
      }
    }
  },
  "google/gemini-3.1-pro-preview:batch": {
    "name": "Google: Gemini 3.1 Pro Preview (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "audio",
        "file",
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 29.7,
        "coding_index": 68.8,
        "agentic_index": 8.2
      }
    }
  },
  "anthropic/claude-sonnet-4.6": {
    "name": "Anthropic: Claude Sonnet 4.6",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 30.1,
        "coding_index": 63,
        "agentic_index": 31.8
      }
    }
  },
  "anthropic/claude-sonnet-4.6:batch": {
    "name": "Anthropic: Claude Sonnet 4.6 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 30.1,
        "coding_index": 63,
        "agentic_index": 31.8
      }
    }
  },
  "qwen/qwen3.5-397b-a17b": {
    "name": "Qwen: Qwen3.5 397B A17B",
    "hugging_face_id": "Qwen/Qwen3.5-397B-A17B",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "text",
        "image",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 21.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "minimax/minimax-m2.5": {
    "name": "MiniMax: MiniMax M2.5",
    "hugging_face_id": "MiniMaxAI/MiniMax-M2.5",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "z-ai/glm-5": {
    "name": "Z.ai: GLM 5",
    "hugging_face_id": "zai-org/GLM-5",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 27.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.6": {
    "name": "Anthropic: Claude Opus 4.6",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supports_max_tokens": true,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 31.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.6:batch": {
    "name": "Anthropic: Claude Opus 4.6 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supports_max_tokens": true,
      "supported_efforts": [
        "max",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 31.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-coder-next": {
    "name": "Qwen: Qwen3 Coder Next",
    "hugging_face_id": "Qwen/Qwen3-Coder-Next",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.2,
        "coding_index": 36.2,
        "agentic_index": 0.9
      }
    }
  },
  "stepfun/step-3.5-flash": {
    "name": "StepFun: Step 3.5 Flash",
    "hugging_face_id": "stepfun-ai/Step-3.5-Flash",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 17,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "moonshotai/kimi-k2.5": {
    "name": "MoonshotAI: Kimi K2.5",
    "hugging_face_id": "moonshotai/Kimi-K2.5",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 23.5,
        "coding_index": 46.8,
        "agentic_index": null
      }
    }
  },
  "upstage/solar-pro-3": {
    "name": "Upstage: Solar Pro 3",
    "hugging_face_id": null,
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "parallel_tool_calls",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.8,
        "coding_index": 16.2,
        "agentic_index": 1.4
      }
    }
  },
  "z-ai/glm-4.7-flash": {
    "name": "Z.ai: GLM 4.7 Flash",
    "hugging_face_id": "zai-org/GLM-4.7-Flash",
    "context_length": 200000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 14.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.2-codex": {
    "name": "OpenAI: GPT-5.2-Codex",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 28.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "minimax/minimax-m2.1": {
    "name": "MiniMax: MiniMax M2.1",
    "hugging_face_id": "MiniMaxAI/MiniMax-M2.1",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "z-ai/glm-4.7": {
    "name": "Z.ai: GLM 4.7",
    "hugging_face_id": "zai-org/GLM-4.7",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_a",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.2,
        "coding_index": 45.3,
        "agentic_index": null
      }
    }
  },
  "google/gemini-3-flash-preview": {
    "name": "Google: Gemini 3 Flash Preview",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "file",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 26.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-3-flash-preview:batch": {
    "name": "Google: Gemini 3 Flash Preview (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "file",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 26.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "nvidia/nemotron-3-nano-30b-a3b": {
    "name": "NVIDIA: Nemotron 3 Nano 30B A3B",
    "hugging_face_id": "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.9,
        "coding_index": 14.4,
        "agentic_index": 1
      }
    }
  },
  "openai/gpt-5.2": {
    "name": "OpenAI: GPT-5.2",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 30.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.2:batch": {
    "name": "OpenAI: GPT-5.2 (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "xhigh",
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 30.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "mistralai/devstral-2512": {
    "name": "Mistral: Devstral 2 2512",
    "hugging_face_id": "mistralai/Devstral-2-123B-Instruct-2512",
    "context_length": 262144,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.6,
        "coding_index": 31.3,
        "agentic_index": 2.3
      }
    }
  },
  "z-ai/glm-4.6v": {
    "name": "Z.ai: GLM 4.6V",
    "hugging_face_id": "zai-org/GLM-4.6V",
    "context_length": 131072,
    "architecture": {
      "modality": "text+image+video->text",
      "input_modalities": [
        "image",
        "text",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.2,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "amazon/nova-2-lite-v1": {
    "name": "Amazon: Nova 2 Lite",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file+video->text",
      "input_modalities": [
        "text",
        "image",
        "video",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Nova",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13.4,
        "coding_index": 23,
        "agentic_index": null
      }
    }
  },
  "mistralai/ministral-14b-2512": {
    "name": "Mistral: Ministral 3 14B 2512",
    "hugging_face_id": "mistralai/Ministral-3-14B-Instruct-2512",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6,
        "coding_index": 14.4,
        "agentic_index": 1.1
      }
    }
  },
  "mistralai/ministral-8b-2512": {
    "name": "Mistral: Ministral 3 8B 2512",
    "hugging_face_id": "mistralai/Ministral-3-8B-Instruct-2512",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.5,
        "coding_index": 9.7,
        "agentic_index": 0.6
      }
    }
  },
  "mistralai/ministral-8b-2512:batch": {
    "name": "Mistral: Ministral 3 8B 2512 (batch)",
    "hugging_face_id": "mistralai/Ministral-3-8B-Instruct-2512",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.5,
        "coding_index": 9.7,
        "agentic_index": 0.6
      }
    }
  },
  "mistralai/ministral-3b-2512": {
    "name": "Mistral: Ministral 3 3B 2512",
    "hugging_face_id": "mistralai/Ministral-3-3B-Instruct-2512",
    "context_length": 131072,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 4.8,
        "coding_index": 4.8,
        "agentic_index": 0.8
      }
    }
  },
  "mistralai/mistral-large-2512": {
    "name": "Mistral: Mistral Large 3 2512",
    "hugging_face_id": null,
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.3,
        "coding_index": 20.1,
        "agentic_index": 1
      }
    }
  },
  "mistralai/mistral-large-2512:batch": {
    "name": "Mistral: Mistral Large 3 2512 (batch)",
    "hugging_face_id": null,
    "context_length": 262144,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.3,
        "coding_index": 20.1,
        "agentic_index": 1
      }
    }
  },
  "deepseek/deepseek-v3.2": {
    "name": "DeepSeek: DeepSeek V3.2",
    "hugging_face_id": "deepseek-ai/DeepSeek-V3.2",
    "context_length": 163840,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 21.5,
        "coding_index": 44.2,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.5": {
    "name": "Anthropic: Claude Opus 4.5",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 29.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.5:batch": {
    "name": "Anthropic: Claude Opus 4.5 (batch)",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "file",
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 29.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.1": {
    "name": "OpenAI: GPT-5.1",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "none"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.7,
        "coding_index": 49.4,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.1:batch": {
    "name": "OpenAI: GPT-5.1 (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "none"
      ],
      "default_effort": "none"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 24.7,
        "coding_index": 49.4,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.1-codex": {
    "name": "OpenAI: GPT-5.1-Codex",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 23.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5.1-codex-mini": {
    "name": "OpenAI: GPT-5.1-Codex-Mini",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": false,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "moonshotai/kimi-k2-thinking": {
    "name": "MoonshotAI: Kimi K2 Thinking",
    "hugging_face_id": "moonshotai/Kimi-K2-Thinking",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "amazon/nova-premier-v1": {
    "name": "Amazon: Nova Premier 1.0",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Nova",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "stop",
      "temperature",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.2,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "minimax/minimax-m2": {
    "name": "MiniMax: MiniMax M2",
    "hugging_face_id": "MiniMaxAI/MiniMax-M2",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 18.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "ibm-granite/granite-4.0-h-micro": {
    "name": "IBM: Granite 4.0 Micro",
    "hugging_face_id": "ibm-granite/granite-4.0-h-micro",
    "context_length": 131000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-haiku-4.5": {
    "name": "Anthropic: Claude Haiku 4.5",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.9,
        "coding_index": 43.9,
        "agentic_index": 8
      }
    }
  },
  "anthropic/claude-haiku-4.5:batch": {
    "name": "Anthropic: Claude Haiku 4.5 (batch)",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.9,
        "coding_index": 43.9,
        "agentic_index": 8
      }
    }
  },
  "qwen/qwen3-vl-8b-instruct": {
    "name": "Qwen: Qwen3 VL 8B Instruct",
    "hugging_face_id": "Qwen/Qwen3-VL-8B-Instruct",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "image",
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-vl-30b-a3b-thinking": {
    "name": "Qwen: Qwen3 VL 30B A3B Thinking",
    "hugging_face_id": "Qwen/Qwen3-VL-30B-A3B-Thinking",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-vl-30b-a3b-instruct": {
    "name": "Qwen: Qwen3 VL 30B A3B Instruct",
    "hugging_face_id": "Qwen/Qwen3-VL-30B-A3B-Instruct",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "z-ai/glm-4.6": {
    "name": "Z.ai: GLM 4.6",
    "hugging_face_id": "zai-org/GLM-4.6",
    "context_length": 204800,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 18.5,
        "coding_index": 45.8,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-sonnet-4.5": {
    "name": "Anthropic: Claude Sonnet 4.5",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.7,
        "coding_index": 52.1,
        "agentic_index": 15.8
      }
    }
  },
  "anthropic/claude-sonnet-4.5:batch": {
    "name": "Anthropic: Claude Sonnet 4.5 (batch)",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.7,
        "coding_index": 52.1,
        "agentic_index": 15.8
      }
    }
  },
  "deepseek/deepseek-v3.2-exp": {
    "name": "DeepSeek: DeepSeek V3.2 Exp",
    "hugging_face_id": "deepseek-ai/DeepSeek-V3.2-Exp",
    "context_length": 163840,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": "deepseek-v3.1"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-vl-235b-a22b-instruct": {
    "name": "Qwen: Qwen3 VL 235B A22B Instruct",
    "hugging_face_id": "Qwen/Qwen3-VL-235B-A22B-Instruct",
    "context_length": 262144,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "deepseek/deepseek-v3.1-terminus": {
    "name": "DeepSeek: DeepSeek V3.1 Terminus",
    "hugging_face_id": "deepseek-ai/DeepSeek-V3.1-Terminus",
    "context_length": 163840,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": "deepseek-v3.1"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 14.8,
        "coding_index": 43.5,
        "agentic_index": 6.8
      }
    }
  },
  "qwen/qwen3-next-80b-a3b-thinking": {
    "name": "Qwen: Qwen3 Next 80B A3B Thinking",
    "hugging_face_id": "Qwen/Qwen3-Next-80B-A3B-Thinking",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.2,
        "coding_index": 17.4,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-next-80b-a3b-instruct": {
    "name": "Qwen: Qwen3 Next 80B A3B Instruct",
    "hugging_face_id": "Qwen/Qwen3-Next-80B-A3B-Instruct",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "moonshotai/kimi-k2-0905": {
    "name": "MoonshotAI: Kimi K2 0905",
    "hugging_face_id": "moonshotai/Kimi-K2-Instruct-0905",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 15.3,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "nousresearch/hermes-4-405b": {
    "name": "Nous: Hermes 4 405B",
    "hugging_face_id": "NousResearch/Hermes-4-405B",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "deepseek/deepseek-chat-v3.1": {
    "name": "DeepSeek: DeepSeek V3.1",
    "hugging_face_id": "deepseek-ai/DeepSeek-V3.1",
    "context_length": 163840,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": "deepseek-v3.1"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "mistralai/mistral-medium-3.1": {
    "name": "Mistral: Mistral Medium 3.1",
    "hugging_face_id": null,
    "context_length": 131072,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.2,
        "coding_index": 20.5,
        "agentic_index": 1.9
      }
    }
  },
  "mistralai/mistral-medium-3.1:batch": {
    "name": "Mistral: Mistral Medium 3.1 (batch)",
    "hugging_face_id": null,
    "context_length": 131072,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.2,
        "coding_index": 20.5,
        "agentic_index": 1.9
      }
    }
  },
  "z-ai/glm-4.5v": {
    "name": "Z.ai: GLM 4.5V",
    "hugging_face_id": "zai-org/GLM-4.5V",
    "context_length": 65536,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5": {
    "name": "OpenAI: GPT-5",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 23,
        "coding_index": 37.8,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5:batch": {
    "name": "OpenAI: GPT-5 (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 23,
        "coding_index": 37.8,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5-mini": {
    "name": "OpenAI: GPT-5 Mini",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5-mini:batch": {
    "name": "OpenAI: GPT-5 Mini (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5-nano": {
    "name": "OpenAI: GPT-5 Nano",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_completion_tokens",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-5-nano:batch": {
    "name": "OpenAI: GPT-5 Nano (batch)",
    "hugging_face_id": null,
    "context_length": 400000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools",
      "verbosity"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low",
        "minimal"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-oss-120b": {
    "name": "OpenAI: gpt-oss-120b",
    "hugging_face_id": "openai/gpt-oss-120b",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_a",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.6,
        "coding_index": 30.4,
        "agentic_index": 3.7
      }
    }
  },
  "openai/gpt-oss-120b:batch": {
    "name": "OpenAI: gpt-oss-120b (batch)",
    "hugging_face_id": "openai/gpt-oss-120b",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.6,
        "coding_index": 30.4,
        "agentic_index": 3.7
      }
    }
  },
  "openai/gpt-oss-20b": {
    "name": "OpenAI: gpt-oss-20b",
    "hugging_face_id": "openai/gpt-oss-20b",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-oss-20b:batch": {
    "name": "OpenAI: gpt-oss-20b (batch)",
    "hugging_face_id": "openai/gpt-oss-20b",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "reasoning_effort",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high",
        "medium",
        "low"
      ],
      "default_effort": "medium"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.1": {
    "name": "Anthropic: Claude Opus 4.1",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-opus-4.1:batch": {
    "name": "Anthropic: Claude Opus 4.1 (batch)",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 22.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-coder-30b-a3b-instruct": {
    "name": "Qwen: Qwen3 Coder 30B A3B Instruct",
    "hugging_face_id": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "response_format",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-30b-a3b-instruct-2507": {
    "name": "Qwen: Qwen3 30B A3B Instruct 2507",
    "hugging_face_id": "Qwen/Qwen3-30B-A3B-Instruct-2507",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "z-ai/glm-4.5": {
    "name": "Z.ai: GLM 4.5",
    "hugging_face_id": "zai-org/GLM-4.5",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "z-ai/glm-4.5-air": {
    "name": "Z.ai: GLM 4.5 Air",
    "hugging_face_id": "zai-org/GLM-4.5-Air",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-235b-a22b-thinking-2507": {
    "name": "Qwen: Qwen3 235B A22B Thinking 2507",
    "hugging_face_id": "Qwen/Qwen3-235B-A22B-Thinking-2507",
    "context_length": 128000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": "qwen3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.7,
        "coding_index": 22.1,
        "agentic_index": 1.3
      }
    }
  },
  "qwen/qwen3-coder": {
    "name": "Qwen: Qwen3 Coder 480B A35B",
    "hugging_face_id": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-2.5-flash-lite": {
    "name": "Google: Gemini 2.5 Flash Lite",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "file",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-2.5-flash-lite:batch": {
    "name": "Google: Gemini 2.5 Flash Lite (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "file",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-235b-a22b-2507": {
    "name": "Qwen: Qwen3 235B A22B Instruct 2507",
    "hugging_face_id": "Qwen/Qwen3-235B-A22B-Instruct-2507",
    "context_length": 262144,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "moonshotai/kimi-k2": {
    "name": "MoonshotAI: Kimi K2 0711",
    "hugging_face_id": "moonshotai/Kimi-K2-Instruct",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "minimax/minimax-m1": {
    "name": "MiniMax: MiniMax M1",
    "hugging_face_id": null,
    "context_length": 1000000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-2.5-flash": {
    "name": "Google: Gemini 2.5 Flash",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "file",
        "image",
        "text",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 15.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-2.5-flash:batch": {
    "name": "Google: Gemini 2.5 Flash (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "file",
        "image",
        "text",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 15.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemini-2.5-pro": {
    "name": "Google: Gemini 2.5 Pro",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "file",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.1,
        "coding_index": 33.3,
        "agentic_index": 1.6
      }
    }
  },
  "google/gemini-2.5-pro:batch": {
    "name": "Google: Gemini 2.5 Pro (batch)",
    "hugging_face_id": null,
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image+file+audio+video->text",
      "input_modalities": [
        "text",
        "image",
        "file",
        "audio",
        "video"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.1,
        "coding_index": 33.3,
        "agentic_index": 1.6
      }
    }
  },
  "openai/o3-pro": {
    "name": "OpenAI: o3 Pro",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "file",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 21.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "deepseek/deepseek-r1-0528": {
    "name": "DeepSeek: R1 0528",
    "hugging_face_id": "deepseek-ai/DeepSeek-R1-0528",
    "context_length": 163840,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": "deepseek-r1"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13.1,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "anthropic/claude-sonnet-4": {
    "name": "Anthropic: Claude Sonnet 4",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Claude",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 18.9,
        "coding_index": 37.6,
        "agentic_index": null
      }
    }
  },
  "mistralai/mistral-medium-3": {
    "name": "Mistral: Mistral Medium 3",
    "hugging_face_id": null,
    "context_length": 131072,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-30b-a3b": {
    "name": "Qwen: Qwen3 30B A3B",
    "hugging_face_id": "Qwen/Qwen3-30B-A3B",
    "context_length": 40960,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": "qwen3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false,
      "default_enabled": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen3-14b": {
    "name": "Qwen: Qwen3 14B",
    "hugging_face_id": "Qwen/Qwen3-14B",
    "context_length": 40960,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": "qwen3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.2,
        "coding_index": 13.8,
        "agentic_index": 0.9
      }
    }
  },
  "qwen/qwen3-32b": {
    "name": "Qwen: Qwen3 32B",
    "hugging_face_id": "Qwen/Qwen3-32B",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen3",
      "instruct_type": "qwen3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_a",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.6,
        "coding_index": 15.3,
        "agentic_index": 0.9
      }
    }
  },
  "openai/o3": {
    "name": "OpenAI: o3",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.2,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/o3:batch": {
    "name": "OpenAI: o3 (batch)",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 20.2,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/o4-mini": {
    "name": "OpenAI: o4 Mini",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/o4-mini:batch": {
    "name": "OpenAI: o4 Mini (batch)",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 16.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4.1": {
    "name": "OpenAI: GPT-4.1",
    "hugging_face_id": null,
    "context_length": 1047576,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_completion_tokens",
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4.1:batch": {
    "name": "OpenAI: GPT-4.1 (batch)",
    "hugging_face_id": null,
    "context_length": 1047576,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4.1-mini": {
    "name": "OpenAI: GPT-4.1 Mini",
    "hugging_face_id": null,
    "context_length": 1047576,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_completion_tokens",
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10.2,
        "coding_index": 20.2,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4.1-mini:batch": {
    "name": "OpenAI: GPT-4.1 Mini (batch)",
    "hugging_face_id": null,
    "context_length": 1047576,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10.2,
        "coding_index": 20.2,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4.1-nano": {
    "name": "OpenAI: GPT-4.1 Nano",
    "hugging_face_id": null,
    "context_length": 1047576,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_completion_tokens",
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.8,
        "coding_index": 11.1,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4.1-nano:batch": {
    "name": "OpenAI: GPT-4.1 Nano (batch)",
    "hugging_face_id": null,
    "context_length": 1047576,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "image",
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.8,
        "coding_index": 11.1,
        "agentic_index": null
      }
    }
  },
  "meta-llama/llama-4-maverick": {
    "name": "Meta: Llama 4 Maverick",
    "hugging_face_id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    "context_length": 1048576,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama4",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 10,
        "coding_index": 16.3,
        "agentic_index": 0.6
      }
    }
  },
  "meta-llama/llama-4-scout": {
    "name": "Meta: Llama 4 Scout",
    "hugging_face_id": "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    "context_length": 1310720,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama4",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.1,
        "coding_index": 8.2,
        "agentic_index": 0.5
      }
    }
  },
  "deepseek/deepseek-chat-v3-0324": {
    "name": "DeepSeek: DeepSeek V3 0324",
    "hugging_face_id": "deepseek-ai/DeepSeek-V3-0324",
    "context_length": 163840,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logprobs",
      "max_tokens",
      "response_format",
      "seed",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 9.7,
        "coding_index": 21.2,
        "agentic_index": 0.8
      }
    }
  },
  "openai/o1-pro": {
    "name": "OpenAI: o1-pro",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemma-3-4b-it": {
    "name": "Google: Gemma 3 4B",
    "hugging_face_id": "google/gemma-3-4b-it",
    "context_length": 131072,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": "gemma"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 4.8,
        "coding_index": 2.7,
        "agentic_index": null
      }
    }
  },
  "google/gemma-3-12b-it": {
    "name": "Google: Gemma 3 12B",
    "hugging_face_id": "google/gemma-3-12b-it",
    "context_length": 131072,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": "gemma"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 3.8,
        "coding_index": 5.8,
        "agentic_index": 0.1
      }
    }
  },
  "cohere/command-a": {
    "name": "Cohere: Command A",
    "hugging_face_id": "CohereForAI/c4ai-command-a-03-2025",
    "context_length": 256000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 13.1,
        "coding_index": 27.8,
        "agentic_index": 1
      }
    }
  },
  "rekaai/reka-flash-3": {
    "name": "Reka Flash 3",
    "hugging_face_id": "RekaAI/reka-flash-3",
    "context_length": 65536,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "google/gemma-3-27b-it": {
    "name": "Google: Gemma 3 27B",
    "hugging_face_id": "google/gemma-3-27b-it",
    "context_length": 131072,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Gemini",
      "instruct_type": "gemma"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 4.9,
        "coding_index": 10.1,
        "agentic_index": 0.1
      }
    }
  },
  "perplexity/sonar-reasoning-pro": {
    "name": "Perplexity: Sonar Reasoning Pro",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": "deepseek-r1"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "temperature",
      "top_k",
      "top_p",
      "web_search_options"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "perplexity/sonar-pro": {
    "name": "Perplexity: Sonar Pro",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "temperature",
      "top_k",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "mistralai/mistral-saba": {
    "name": "Mistral: Saba",
    "hugging_face_id": null,
    "context_length": 32768,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/o3-mini-high": {
    "name": "OpenAI: o3 Mini High",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "reasoning_effort",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": true,
      "supported_efforts": [
        "high"
      ],
      "default_effort": "high"
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11,
        "coding_index": 16.3,
        "agentic_index": 0.9
      }
    }
  },
  "openai/o3-mini": {
    "name": "OpenAI: o3 Mini",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/o3-mini:batch": {
    "name": "OpenAI: o3 Mini (batch)",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 12.5,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "mistralai/mistral-small-24b-instruct-2501": {
    "name": "Mistral: Mistral Small 3",
    "hugging_face_id": "mistralai/Mistral-Small-24B-Instruct-2501",
    "context_length": 32768,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "perplexity/sonar": {
    "name": "Perplexity: Sonar",
    "hugging_face_id": null,
    "context_length": 127072,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "temperature",
      "top_k",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "deepseek/deepseek-r1": {
    "name": "DeepSeek: R1",
    "hugging_face_id": "deepseek-ai/DeepSeek-R1",
    "context_length": 64000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "DeepSeek",
      "instruct_type": "deepseek-r1"
    },
    "supported_parameters": [
      "frequency_penalty",
      "include_reasoning",
      "max_tokens",
      "presence_penalty",
      "reasoning",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": {
      "mandatory": true
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 11.4,
        "coding_index": 24.6,
        "agentic_index": 1.1
      }
    }
  },
  "microsoft/phi-4": {
    "name": "Microsoft: Phi 4",
    "hugging_face_id": "microsoft/phi-4",
    "context_length": 16384,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Other",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/o1": {
    "name": "OpenAI: o1",
    "hugging_face_id": null,
    "context_length": 200000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "include_reasoning",
      "max_tokens",
      "reasoning",
      "response_format",
      "seed",
      "structured_outputs",
      "tool_choice",
      "tools"
    ],
    "reasoning": {
      "mandatory": false
    },
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 15.2,
        "coding_index": 39.7,
        "agentic_index": null
      }
    }
  },
  "meta-llama/llama-3.3-70b-instruct": {
    "name": "Meta: Llama 3.3 70B Instruct",
    "hugging_face_id": "meta-llama/Llama-3.3-70B-Instruct",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "llama3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.7,
        "coding_index": 11.9,
        "agentic_index": null
      }
    }
  },
  "amazon/nova-lite-v1": {
    "name": "Amazon: Nova Lite 1.0",
    "hugging_face_id": null,
    "context_length": 300000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Nova",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "stop",
      "temperature",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "amazon/nova-micro-v1": {
    "name": "Amazon: Nova Micro 1.0",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Nova",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "stop",
      "temperature",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.9,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "amazon/nova-pro-v1": {
    "name": "Amazon: Nova Pro 1.0",
    "hugging_face_id": null,
    "context_length": 300000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Nova",
      "instruct_type": null
    },
    "supported_parameters": [
      "max_tokens",
      "stop",
      "temperature",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4o-2024-11-20": {
    "name": "OpenAI: GPT-4o (2024-11-20)",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "prediction",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 8.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "mistralai/mistral-large-2407": {
    "name": "Mistral Large 2407",
    "hugging_face_id": null,
    "context_length": 131072,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen-2.5-coder-32b-instruct": {
    "name": "Qwen2.5 Coder 32B Instruct",
    "hugging_face_id": "Qwen/Qwen2.5-Coder-32B-Instruct",
    "context_length": 32768,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": "chatml"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "meta-llama/llama-3.2-1b-instruct": {
    "name": "Meta: Llama 3.2 1B Instruct",
    "hugging_face_id": "meta-llama/Llama-3.2-1B-Instruct",
    "context_length": 60000,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "llama3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "seed",
      "stop",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 4.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "meta-llama/llama-3.2-3b-instruct": {
    "name": "Meta: Llama 3.2 3B Instruct",
    "hugging_face_id": "meta-llama/Llama-3.2-3B-Instruct",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "llama3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "qwen/qwen-2.5-72b-instruct": {
    "name": "Qwen2.5 72B Instruct",
    "hugging_face_id": "Qwen/Qwen2.5-72B-Instruct",
    "context_length": 32768,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Qwen",
      "instruct_type": "chatml"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "nousresearch/hermes-3-llama-3.1-70b": {
    "name": "Nous: Hermes 3 70B Instruct",
    "hugging_face_id": "NousResearch/Hermes-3-Llama-3.1-70B",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "chatml"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "nousresearch/hermes-3-llama-3.1-405b": {
    "name": "Nous: Hermes 3 405B Instruct",
    "hugging_face_id": "NousResearch/Hermes-3-Llama-3.1-405B",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "chatml"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.4,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4o-2024-08-06": {
    "name": "OpenAI: GPT-4o (2024-08-06)",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "prediction",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "meta-llama/llama-3.1-70b-instruct": {
    "name": "Meta: Llama 3.1 70B Instruct",
    "hugging_face_id": "meta-llama/Meta-Llama-3.1-70B-Instruct",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "llama3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.6,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "meta-llama/llama-3.1-8b-instruct": {
    "name": "Meta: Llama 3.1 8B Instruct",
    "hugging_face_id": "meta-llama/Meta-Llama-3.1-8B-Instruct",
    "context_length": 131072,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Llama3",
      "instruct_type": "llama3"
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "min_p",
      "presence_penalty",
      "repetition_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_k",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.9,
        "coding_index": 5.4,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4o-mini": {
    "name": "OpenAI: GPT-4o-mini",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "prediction",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": 11.4,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4o-mini:batch": {
    "name": "OpenAI: GPT-4o-mini (batch)",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "prediction",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": 11.4,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4o-2024-05-13": {
    "name": "OpenAI: GPT-4o (2024-05-13)",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image+file->text",
      "input_modalities": [
        "text",
        "image",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "prediction",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p",
      "web_search_options"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7.3,
        "coding_index": 24.2,
        "agentic_index": null
      }
    }
  },
  "mistralai/mixtral-8x22b-instruct": {
    "name": "Mistral: Mixtral 8x22B Instruct",
    "hugging_face_id": "mistralai/Mixtral-8x22B-Instruct-v0.1",
    "context_length": 65536,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": "mistral"
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.7,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4-turbo": {
    "name": "OpenAI: GPT-4 Turbo",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7,
        "coding_index": 21.5,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4-turbo:batch": {
    "name": "OpenAI: GPT-4 Turbo (batch)",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+image->text",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 7,
        "coding_index": 21.5,
        "agentic_index": null
      }
    }
  },
  "mistralai/mistral-large": {
    "name": "Mistral Large",
    "hugging_face_id": null,
    "context_length": 128000,
    "architecture": {
      "modality": "text+file->text",
      "input_modalities": [
        "text",
        "file"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "Mistral",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.8,
        "coding_index": null,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-3.5-turbo": {
    "name": "OpenAI: GPT-3.5 Turbo",
    "hugging_face_id": null,
    "context_length": 16385,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.5,
        "coding_index": 10.7,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-3.5-turbo:batch": {
    "name": "OpenAI: GPT-3.5 Turbo (batch)",
    "hugging_face_id": null,
    "context_length": 16385,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 5.5,
        "coding_index": 10.7,
        "agentic_index": null
      }
    }
  },
  "openai/gpt-4": {
    "name": "OpenAI: GPT-4",
    "hugging_face_id": null,
    "context_length": 8191,
    "architecture": {
      "modality": "text->text",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tokenizer": "GPT",
      "instruct_type": null
    },
    "supported_parameters": [
      "frequency_penalty",
      "logit_bias",
      "logprobs",
      "max_completion_tokens",
      "max_tokens",
      "presence_penalty",
      "response_format",
      "seed",
      "stop",
      "structured_outputs",
      "temperature",
      "tool_choice",
      "tools",
      "top_logprobs",
      "top_p"
    ],
    "reasoning": null,
    "benchmarks": {
      "artificial_analysis": {
        "intelligence_index": 6.7,
        "coding_index": 13.1,
        "agentic_index": null
      }
    }
  }
};
