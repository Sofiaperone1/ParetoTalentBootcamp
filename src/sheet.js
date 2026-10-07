// Cálculo del costo, archivos para descargar y parámetros de la URL.

export function hasText(row) {
  return row.task.trim() !== "" || row.outcome.trim() !== "";
}

export function isComplete(row) {
  return row.task.trim() !== "" && row.outcome.trim() !== "";
}

export function parseAmount(value) {
  if (value == null) return 0;
  const cleaned = String(value).trim().replace(/[$,]/g, "");
  if (cleaned === "") return 0;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return amount;
}

export function roundMoney(value) {
  return Math.round(parseAmount(value) * 100) / 100;
}

export function rowMonthly(hours, hourly) {
  return roundMoney(parseAmount(hours) * parseAmount(hourly) * 4);
}

export function monthlyTotal(rows, hoursList, hourly) {
  const sum = rows.reduce((total, row, index) => {
    if (!hasText(row)) return total;
    return total + rowMonthly(hoursList[index], hourly);
  }, 0);
  return roundMoney(sum);
}

export function formatDollars(value) {
  const amount = roundMoney(value);
  const cents = Math.round(amount * 100) % 100;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents === 0 ? 0 : 2,
    maximumFractionDigits: cents === 0 ? 0 : 2,
  });
}

export function amountParam(value) {
  return String(roundMoney(value));
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function toCsv(rows) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export function sheetRows(rows) {
  const body = rows
    .filter(isComplete)
    .map((row) => [row.task.trim(), row.outcome.trim()]);
  return [["Task", "Outcome"], ...body];
}

export function costRows(rows, hoursList, hourly) {
  const body = rows.flatMap((row, index) => {
    if (!hasText(row)) return [];
    const hours = String(hoursList[index] ?? "").trim();
    return [[
      row.task.trim(),
      row.outcome.trim(),
      hours,
      formatDollars(rowMonthly(hours, hourly)),
    ]];
  });
  const total = monthlyTotal(rows, hoursList, hourly);
  return [
    ["Task", "Outcome", "Hours", "Dollars"],
    ...body,
    ["Monthly total", "", "", formatDollars(total)],
  ];
}

export function downloadCsv(filename, rows) {
  const csv = `\uFEFF${toCsv(rows)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// qualify=form: las tres sí/no se leen del formulario de GoHighLevel.
export function rememberChoices({ hourly, hours, total, rows }) {
  const params = new URLSearchParams(window.location.search);
  params.set("hourly", amountParam(hourly));
  for (let index = 0; index < hours.length; index += 1) {
    const include = Boolean(rows?.[index] && hasText(rows[index]));
    const raw = include ? String(hours[index] ?? "").trim() : "";
    params.set(`h${index + 1}`, raw === "" ? "" : amountParam(raw));
  }
  params.set("total", amountParam(total));
  params.set("qualify", "form");
  const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history.replaceState(null, "", next);
}
