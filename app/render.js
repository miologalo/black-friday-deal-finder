// Bargain Beacon — renders deal cards into the page.
// Every card shows the product, its store, the sale and usual prices,
// the computed discount, a link to the product at the store, when the
// price was checked, where it was read, and the verdict badge.

import { CHECKED_LABEL, VERDICTS } from "./data.js";
import { amountSaved, discountPercent } from "./filters.js";

export function formatPrice(value) {
  return `$${value.toFixed(2).replace(/\.00$/, "")}`;
}

function verdictBadge(deal) {
  const label = VERDICTS[deal.verdict] || "Deal";
  return `<span class="verdict verdict-${deal.verdict}">${label}</span>`;
}

function dealCard(deal) {
  const pct = discountPercent(deal);
  const saved = amountSaved(deal);
  return `<article class="card" data-id="${deal.id}">
    <div class="card-top">
      <span class="store store-${deal.store.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${deal.store}</span>
      ${verdictBadge(deal)}
    </div>
    <h3 class="card-name">${deal.name}</h3>
    <p class="card-category">${deal.category}</p>
    <div class="card-prices">
      <span class="sale">${formatPrice(deal.sale)}</span>
      <span class="usual">${formatPrice(deal.usual)}</span>
      <span class="pct">−${pct}%</span>
    </div>
    <p class="card-save">You save ${formatPrice(saved)}</p>
    <p class="card-note">${deal.note}</p>
    <p class="card-source">Price read: ${deal.source}. ${CHECKED_LABEL}.</p>
    <a class="card-link" href="${deal.link}" target="_blank" rel="noopener">View deal at ${deal.store} ↗</a>
  </article>`;
}

export function renderDeals(container, deals) {
  if (!deals.length) {
    container.innerHTML = `<p class="empty">No deals match these filters. Try clearing the search or lowering the minimum discount.<br><button type="button" id="clear-filters">Clear all filters</button></p>`;
    return;
  }
  container.innerHTML = deals.map(dealCard).join("\n");
}

export function renderSummary(element, total, shown) {
  element.textContent =
    total === shown
      ? `Showing all ${total} deals`
      : `Showing ${shown} of ${total} deals`;
}
