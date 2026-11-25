/**
 * Utility function to export arrays of data as genuine CSV files in the browser.
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columnHeaders?: { [K in keyof T]?: string }
): void {
  if (!rows || rows.length === 0) {
    alert('No data available to export.');
    return;
  }

  const keys = Object.keys(rows[0]) as (keyof T)[];
  const headerRow = keys
    .map((k) => (columnHeaders && columnHeaders[k] ? columnHeaders[k] : String(k)))
    .map((str) => `"${String(str).replace(/"/g, '""')}"`)
    .join(',');

  const csvRows = rows.map((row) =>
    keys
      .map((k) => {
        const val = row[k];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = [headerRow, ...csvRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
