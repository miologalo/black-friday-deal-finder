// Bargain Beacon — page wiring: reads the filter controls, keeps the
// state in the URL so a filtered view can be shared, and re-renders the
// deal list whenever anything changes.

import { CATEGORIES, CHECKED_LABEL, DEALS, STORES } from "./data.js";
import { applyFilters, bestDeal, countByStore, sortDeals } from "./filters.js";
import { renderDeals, renderSummary } from "./render.js";

const state = {
  query: "",
  category: "all",
  store: "all",
  minDiscount: 0,
  sort: "verdict",
};

const grid = document.getElementById("deal-grid");
const summary = document.getElementById("result-count");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const sortSelect = document.getElementById("sort");

function fillSelect(select, options, allLabel) {
  select.innerHTML = `<option value="all">${allLabel}</option>` +
    options.map((value) => `<option value="${value}">${value}</option>`).join("");
}

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) state.query = params.get("q");
  if (params.get("cat")) state.category = params.get("cat");
  if (params.get("store")) state.store = params.get("store");
  if (params.get("min")) state.minDiscount = Number(params.get("min")) || 0;
  if (params.get("sort")) state.sort = params.get("sort");
}

function writeStateToUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("cat", state.category);
  if (state.store !== "all") params.set("store", state.store);
  if (state.minDiscount) params.set("min", String(state.minDiscount));
  if (state.sort !== "verdict") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

function render() {
  const filtered = applyFilters(DEALS, state);
  const sorted = sortDeals(filtered, state.sort);
  renderDeals(grid, sorted);
  renderSummary(summary, DEALS.length, filtered.length);
  writeStateToUrl();
}

function syncControls() {
  searchInput.value = state.query;
  categorySelect.value = state.category;
  storeSelect.value = state.store;
  // A shared link can carry a minimum discount the select has no option
  // for (for example ?min=25): add it so the control shows the real state.
  if (![...discountSelect.options].some((o) => o.value === String(state.minDiscount))) {
    const extra = document.createElement("option");
    extra.value = String(state.minDiscount);
    extra.textContent = `${state.minDiscount}% off or more`;
    discountSelect.appendChild(extra);
  }
  discountSelect.value = String(state.minDiscount);
  sortSelect.value = state.sort;
}

function clearFilters() {
  state.query = "";
  state.category = "all";
  state.store = "all";
  state.minDiscount = 0;
  state.sort = "verdict";
  syncControls();
  render();
}

function renderStats() {
  const counts = countByStore(DEALS);
  const best = bestDeal(DEALS);
  document.getElementById("stat-deals").textContent = DEALS.length;
  document.getElementById("stat-stores").textContent = STORES.length;
  document.getElementById("stat-best").textContent = best
    ? `${best.name} — ${best.store}`
    : "—";
  document.getElementById("stat-checked").textContent = CHECKED_LABEL;
  document.getElementById("store-counts").textContent = STORES.map(
    (store) => `${store} (${counts[store]})`,
  ).join(" · ");
}

fillSelect(categorySelect, CATEGORIES, "All categories");
fillSelect(storeSelect, STORES, "All stores");
readStateFromUrl();
syncControls();
renderStats();
render();

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  render();
});
grid.addEventListener("click", (event) => {
  if (event.target && event.target.id === "clear-filters") clearFilters();
});
categorySelect.addEventListener("change", () => {
  state.category = categorySelect.value;
  render();
});
storeSelect.addEventListener("change", () => {
  state.store = storeSelect.value;
  render();
});
discountSelect.addEventListener("change", () => {
  state.minDiscount = Number(discountSelect.value);
  render();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});
