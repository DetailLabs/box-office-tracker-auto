// ── Utility functions ──────────────────────────────────────────────────
// Data is now fetched from the API at runtime (see App.js)

export function formatMoney(num) {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num}`;
}

export function formatMoneyFull(num) {
  return "$" + num.toLocaleString();
}
