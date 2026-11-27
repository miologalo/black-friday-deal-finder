// Bargain Beacon — filtering and sorting for the deal list.
// Pure functions over the deals array: no DOM here, so the same rules
// drive the list, the counts and the shareable filter links.

export function discountPercent(deal) {
  if (!deal.usual || deal.usual <= deal.sale) return 0;
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function amountSaved(deal) {
  return Math.max(0, deal.usual - deal.sale);
}

// The verdict order the "Best deal first" sort uses: a record low beats
// a strong deal, which beats a solid one, which beats a modest saving.
export const VERDICT_RANK = {
  "record-low": 0,
  strong: 1,
  solid: 2,
  modest: 3,
};

// state: { query, category, store, minDiscount, sort }
export function applyFilters(deals, state) {
  const query = (state.query || "").trim().toLowerCase();
  return deals.filter((deal) => {
    if (state.category && state.category !== "all" && deal.category !== state.category) return false;
    if (state.store && state.store !== "all" && deal.store !== state.store) return false;
    if (state.minDiscount && discountPercent(deal) < state.minDiscount) return false;
    if (query) {
      const haystack = `${deal.name} ${deal.store} ${deal.category} ${deal.note}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortDeals(deals, sortKey) {
  const list = [...deals];
  switch (sortKey) {
    case "discount":
      return list.sort((a, b) => discountPercent(b) - discountPercent(a));
    case "saved":
      return list.sort((a, b) => amountSaved(b) - amountSaved(a));
    case "price-low":
      return list.sort((a, b) => a.sale - b.sale);
    case "price-high":
      return list.sort((a, b) => b.sale - a.sale);
    case "verdict":
    default:
      return list.sort(
        (a, b) =>
          VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
          discountPercent(b) - discountPercent(a),
      );
  }
}

export function countByStore(deals) {
  const counts = {};
  for (const deal of deals) counts[deal.store] = (counts[deal.store] || 0) + 1;
  return counts;
}

export function bestDeal(deals) {
  if (!deals.length) return null;
  return sortDeals(deals, "verdict")[0];
}
