import ExcelJS from "exceljs";
import { format } from "date-fns";
import { ReminderDataItem } from "./api/types";

export async function exportRemindersCustom(data: ReminderDataItem[], fileName: string) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Appointments");

  // Fills
  const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E4057' } };
  const scheduledFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6EAF8' } };
  const paidFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD5F5E3' } };
  const pendingFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF9E7' } };
  const defaultFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
  const subHeaderFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5D7A9E' } };

  // Border
  const border: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
  };

  // Columns definition
  ws.columns = [
    { header: "No", key: "no", width: 5 },
    { header: "Therapist Name", key: "name", width: 35 },
    { header: "Therapist Type", key: "type", width: 16 },
    { header: "Status", key: "status", width: 28 },
    { header: "Appt Date (WIB)", key: "date", width: 20 },
    { header: "Appt Time (WIB)", key: "time", width: 18 }
  ];

  // Header row styling
  const headerRow = ws.getRow(1);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = headerFill;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = border;
  });

  // Freeze top pane
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  const statusFills: Record<string, ExcelJS.Fill> = {
    "SCHEDULED": scheduledFill,
    "PAID": paidFill,
    "PENDING PATIENT APPROVAL": pendingFill,
  };

  const statusCounts: Record<string, number> = {};

  data.forEach((row, idx) => {
    let dateStr = "—";
    let timeStr = "—";

    if (row.appt_date_time_wib) {
      const dt = new Date(row.appt_date_time_wib);
      const utcMs = dt.getTime() + (dt.getTimezoneOffset() * 60000);
      const wibMs = utcMs + (7 * 3600000);
      const wibDt = new Date(wibMs);
      
      dateStr = format(wibDt, "dd-MM-yyyy");
      timeStr = format(wibDt, "HH:mm");
    }

    statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;

    const r = ws.addRow({
      no: idx + 1,
      name: row.therapist_name || "Unknown",
      type: row.therapist_type || "—",
      status: row.status || "—",
      date: dateStr,
      time: timeStr
    });

    const rowFill = statusFills[row.status] || defaultFill;
    const aligns: Array<"center" | "left"> = ["center", "left", "center", "center", "center", "center"];

    r.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", size: 10 };
      cell.fill = rowFill;
      cell.alignment = { horizontal: aligns[colNumber - 1], vertical: "middle" };
      cell.border = border;
    });
  });

  // Summary Sheet
  const ws2 = wb.addWorksheet("Summary");
  
  ws2.getColumn('A').width = 30;
  ws2.getColumn('B').width = 22;

  ws2.mergeCells("A1:B1");
  const a1 = ws2.getCell("A1");
  a1.value = "Status Summary";
  a1.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  a1.fill = headerFill;
  a1.alignment = { horizontal: "center", vertical: "middle" };

  const a2 = ws2.getCell("A2");
  a2.value = "Status";
  const b2 = ws2.getCell("B2");
  b2.value = "Total Appointments";

  [a2, b2].forEach(c => {
    c.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    c.fill = subHeaderFill;
    c.alignment = { horizontal: "center", vertical: "middle" };
    c.border = border;
  });

  let rIdx = 3;
  Object.keys(statusCounts).sort().forEach(status => {
    const total = statusCounts[status];
    const a = ws2.getCell(`A${rIdx}`);
    const b = ws2.getCell(`B${rIdx}`);
    
    a.value = status;
    b.value = total;

    [a, b].forEach(c => {
      c.font = { name: "Arial", size: 10 };
      c.alignment = { horizontal: "center", vertical: "middle" };
      c.border = border;
      const f = statusFills[status];
      if (f) c.fill = f;
    });
    rIdx++;
  });

  const totalRow = rIdx;
  const aT = ws2.getCell(`A${totalRow}`);
  const bT = ws2.getCell(`B${totalRow}`);
  
  aT.value = "GRAND TOTAL";
  bT.value = { formula: `SUM(B3:B${totalRow - 1})` };

  [aT, bT].forEach(c => {
    c.font = { name: "Arial", bold: true, size: 10 };
    c.alignment = { horizontal: "center", vertical: "middle" };
    c.border = border;
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  
  window.URL.revokeObjectURL(url);
}
