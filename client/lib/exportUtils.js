import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * EstateFlow Export Utility
 * Handles Excel and PDF generation for CRM data.
 */

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Create Buffer and download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data, headers, title, fileName) => {
  const doc = jsPDF();
  
  // Set Header Style
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('ESTATEFLOW CRM', 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(title, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);

  // Table Generation
  const tableRows = data.map(item => headers.map(header => {
    const value = header.key.split('.').reduce((obj, key) => obj?.[key], item);
    return value?.toString() || 'N/A';
  }));

  doc.autoTable({
    startY: 45,
    head: [headers.map(h => h.label.toUpperCase())],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
      fillColor: [15, 23, 42], 
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
  });

  doc.save(`${fileName}.pdf`);
};
