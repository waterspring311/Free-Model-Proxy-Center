import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('WorkBuddy channel health reports readiness for the requested region only', () => {
  const result = spawnSync(process.env.ONEHUB_PYTHON || 'python', ['-c', String.raw`
import runpy
import sys
from types import SimpleNamespace
from unittest.mock import patch

shim = runpy.run_path(sys.argv[1])
proxy = shim["wb_proxy"]
pool = proxy.wb_accounts.AccountPool("")
pool.accounts = [
    SimpleNamespace(realm="intl", enabled=True, access_token="test",
                    ready=lambda model=None: True, public=lambda: {}),
    SimpleNamespace(realm="cn", enabled=False, access_token="test",
                    ready=lambda model=None: True, public=lambda: {}),
]

assert proxy.Handler._get_health is shim["realm_health"]
with patch.object(proxy, "POOL", pool):
    for realm, ready in [("intl", 1), ("cn", 0)]:
        handler = SimpleNamespace(_key_ok=lambda: True,
                                  _request_realm=lambda: realm,
                                  _json=lambda status, body: (status, body))
        status, body = shim["realm_health"](handler)
        assert status == 200
        assert body["realm"] == realm
        assert body["accounts"] == 1
        assert body["accounts_ready"] == ready
        assert "access_token" not in body

with patch.object(proxy, "POOL", None):
    assert shim["realm_health"](handler)[1]["accounts_ready"] == 0
`, path.join(root, 'scripts/workbuddy-entry.py')], { encoding: 'utf8', timeout: 10000 });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('WorkBuddy discovery exposes current account prices, refreshes the regional cache and rejects bundled pricing evidence', () => {
  const result = spawnSync(process.env.ONEHUB_PYTHON || 'python', ['-c', String.raw`
import runpy
import sys
from types import SimpleNamespace
from unittest.mock import patch

shim = runpy.run_path(sys.argv[1])
proxy = shim["wb_proxy"]
prices = shim["_live_prices"]
capture = shim["fetch_product_config_with_prices"]
live = (["hy3", "hy4-preview-f"], {
    "hy3": {"credits": "x0.00"},
    "hy4-preview-f": {"credits": "x0.00"},
    "hy4-preview": {"credits": "x0.29"},
})
with patch.dict(capture.__globals__, {"_fetch_product_config": lambda realm: live}):
    assert capture("cn") == live
assert prices["cn"]["models"] == live[1]
assert prices["cn"]["synced_at"]

entries = [
    ("hy3", {"credits": "x0.29"}),
    ("hy4-preview-f", {"credits": "x0.29"}),
    ("hy4-preview", {"credits": "x0.00"}),
    ("bundled-only", {"credits": "x0.00"}),
]
handler = SimpleNamespace(
    path="/v1/models?refresh=1",
    _authorized=lambda: True,
    _request_realm=lambda: "cn",
    _json=lambda status, body: (status, body),
    _error=lambda status, message: (status, message),
)
proxy._models_cache["cn"]["at"] = 123
with patch.object(proxy, "fetch_models", return_value=entries) as fetch:
    status, body = shim["models_with_live_prices"](handler)
    fetch.assert_called_once_with(realm="cn")
assert status == 200 and body["pricing_verified"] is True
assert proxy._models_cache["cn"]["at"] == 0
rows = {item["id"]: item for item in body["data"]}
assert rows["hy4-preview-f"]["credits"] == "x0.00"
assert rows["hy4-preview"]["credits"] == "x0.29"
assert rows["hy3"]["pricing_source"] == "product_config"
assert "credits" not in rows["bundled-only"]

# A failed remote refresh must clear the evidence, even with a bundled fallback.
with patch.dict(capture.__globals__, {"_fetch_product_config": lambda realm: None}):
    capture("cn")
with patch.object(proxy, "fetch_models", return_value=entries):
    status, body = shim["models_with_live_prices"](handler)
assert body["pricing_verified"] is False
assert all("credits" not in item for item in body["data"])
handler._authorized = lambda: False
with patch.object(proxy, "fetch_models") as fetch:
    assert shim["models_with_live_prices"](handler) is None
    fetch.assert_not_called()
`, path.join(root, 'scripts/workbuddy-entry.py')], { encoding: 'utf8', timeout: 10000 });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
