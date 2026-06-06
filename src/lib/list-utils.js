export function matchesSearch(item, search, fields) {
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return fields.some((field) => {
    const value = field(item);
    return value != null && String(value).toLowerCase().includes(q);
  });
}

export function matchesCategory(category, filter) {
  if (!filter) return true;
  return category === filter;
}

export function matchesActivityCategory(log, filter) {
  if (!filter) return true;
  return log.description.toLowerCase().includes(filter.toLowerCase());
}

export function matchesActivityStatus(log, filter) {
  if (!filter) return true;
  const action = log.action;
  if (filter === "CREATED") {
    return action.includes("CREATED") || action.includes("REGISTER") || action.includes("SUBMITTED");
  }
  if (filter === "APPROVED") {
    return action.includes("APPROVED") || action.includes("COMPLETED") || action.includes("SELECTED");
  }
  if (filter === "REJECTED") return action.includes("REJECTED");
  if (filter === "GENERATED") return action.includes("GENERATED");
  if (filter === "SENT") return action.includes("EMAILED") || action.includes("SENT");
  return true;
}

export function sortBy(items, sortKey, getters) {
  const getValue = getters[sortKey];
  if (!getValue) return items;

  const sorted = [...items];
  const [, direction = "asc"] = sortKey.split("_");

  sorted.sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "desc" ? bVal - aVal : aVal - bVal;
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === "desc" ? bVal - aVal : aVal - bVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return direction === "desc" ? 1 : -1;
    if (aStr > bStr) return direction === "desc" ? -1 : 1;
    return 0;
  });

  return sorted;
}
