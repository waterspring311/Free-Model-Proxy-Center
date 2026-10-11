"""Run the WorkBuddy engine with OneHub-owned state and explicit OAuth only."""
import os
import sys
from datetime import datetime, timezone

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(root, "upstream", "workbuddy2api-hub"))
import wb_proxy
import wb_scheduler
import wb_settings

# Do not scan existing desktop credentials or run reward tasks on startup.
wb_proxy.desktop_credential_scan = lambda: []
def start_without_jobs(self):
    self.enabled = False
    self.log("OneHub: automatic activity/reward scheduler is disabled")
wb_scheduler.Scheduler.start = start_without_jobs


# Bundled catalog prices can lag behind a promotion. Expose only prices
# returned by the connected account's product-config endpoint.
_live_prices = {}
_fetch_product_config = wb_proxy.fetch_remote_product_config


def fetch_product_config_with_prices(realm):
    source = _fetch_product_config(realm)
    _live_prices[realm] = {
        "models": source[1],
        "synced_at": datetime.now(timezone.utc).isoformat(),
    } if source else None
    return source


wb_proxy.fetch_remote_product_config = fetch_product_config_with_prices


def models_with_live_prices(self):
    if not self._authorized():
        return
    realm = self._request_realm() or wb_proxy.CURRENT_REALM
    # OneHub already caches discoveries; an actual sync must refresh prices.
    from urllib.parse import parse_qs, urlparse
    query = parse_qs(urlparse(self.path).query)
    if query.get("refresh") == ["1"]:
        with wb_proxy._lock:
            if realm in wb_proxy._models_cache:
                wb_proxy._models_cache[realm]["at"] = 0.0
    try:
        entries = wb_proxy.fetch_models(realm=realm)
    except Exception:
        return self._error(502, "Model catalog discovery failed.")
    prices = _live_prices.get(realm)
    data = []
    for mid, meta in entries:
        item = wb_proxy.model_entry(mid, meta)
        item.pop("credits", None)
        if prices:
            live = prices["models"].get(mid) or {}
            if live.get("credits") is not None:
                item["credits"] = live["credits"]
                item["pricing_source"] = "product_config"
                item["pricing_synced_at"] = prices["synced_at"]
        data.append(item)
    return self._json(200, {
        "object": "list", "data": data, "realm": realm,
        "pricing_verified": bool(prices),
        "pricing_synced_at": prices["synced_at"] if prices else None,
    })


wb_proxy.Handler._get_v1_models = models_with_live_prices


def realm_health(self):
    # The upstream health route totals both regions. OneHub shows each
    # region as a separate channel, so readiness must follow X-Realm.
    self._key_ok()
    realm = self._request_realm() or wb_proxy.CURRENT_REALM
    pool = wb_proxy.POOL
    return self._json(200, {
        "ok": True,
        "realm": realm,
        "accounts": len(pool.list_public(realm=realm)) if pool else 0,
        "accounts_ready": pool.count_ready(realm=realm) if pool else 0,
        "api_key_required": wb_proxy.auth_required(),
    })


wb_proxy.Handler._get_health = realm_health

if __name__ == "__main__":
    directory = os.environ["ACCOUNTS_DIR"]
    wb_settings.set_panel_password(directory, os.environ["ONEHUB_WB_PANEL_PASSWORD"])
    wb_settings.set_auth_disabled(directory, False)
    wb_settings.set_pricing_enabled(directory, False)
    wb_proxy.main()
