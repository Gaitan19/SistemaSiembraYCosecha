import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Helper function to format date and time for filenames
export const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

// Generic PDF export function
export const exportToPDF = (data, columns, filename, analytics = null) => {
  const doc = new jsPDF();
  const dateTime = getFormattedDateTime();
  const finalFilename = `${filename}_${dateTime}.pdf`;
  
  // Add title
  doc.setFontSize(16);
  doc.text(filename.replace('_', ' '), 14, 20);
  
  // Add export date
  doc.setFontSize(10);
  doc.text(`Exportado el: ${new Date().toLocaleString('es-ES')}`, 14, 30);
  
  let currentY = 40;
  
  // Add analytics information if provided
  if (analytics) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    currentY += 10;
    
    if (analytics.type === 'sales') {
      // Show max sales
      doc.text(`Fecha con más ventas: ${analytics.maxSales.date}`, 14, currentY);
      currentY += 8;
      doc.text(`Cantidad: ${analytics.maxSales.quantity}`, 14, currentY);
      currentY += 12;
      
      // Show min sales
      doc.text(`Fecha con menos ventas: ${analytics.minSales.date}`, 14, currentY);
      currentY += 8;
      doc.text(`Cantidad: ${analytics.minSales.quantity}`, 14, currentY);
      currentY += 15;
    } else if (analytics.type === 'products') {
      const productLabel = analytics.isTopSelling ? 'Producto más vendido' : 'Producto menos vendido';
      doc.text(`${productLabel}: ${analytics.product}`, 14, currentY);
      currentY += 8;
      doc.text(`Cantidad: ${analytics.quantity}`, 14, currentY);
      currentY += 15;
    } else if (analytics.type === 'closure') {
      // Show closure summary
      doc.text(`Total Ingresos: ${analytics.totalIngresos}`, 14, currentY);
      currentY += 8;
      doc.text(`Total Egresos: ${analytics.totalEgresos}`, 14, currentY);
      currentY += 8;
      doc.text(`Saldo Cierre: ${analytics.saldoCierre}`, 14, currentY);
      currentY += 15;
    }
  }
  
  // Create table using autoTable function
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => col.accessor(row))),
    startY: currentY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [78, 115, 223] }, // #4e73df
  });
  
  // Save the PDF
  doc.save(finalFilename);
};

// Generic Excel export function  
export const exportToExcel = (data, filename, analytics = null) => {
  const dateTime = getFormattedDateTime();
  const finalFilename = `${filename}_${dateTime}.xlsx`;
  
  // Truncate sheet name to fit Excel's 31 character limit
  const sheetName = filename.length > 31 ? filename.substring(0, 31) : filename;
  
  // Prepare the data for Excel
  let worksheetData = [...data];
  
  // Add analytics information if provided
  if (analytics) {
    // Add empty rows for spacing
    worksheetData.unshift({});
    worksheetData.unshift({});
    
    if (analytics.type === 'sales') {
      // Add min sales info
      worksheetData.unshift({
        [Object.keys(data[0] || {})[0] || 'Info']: `Fecha con menos ventas: ${analytics.minSales.date}`,
        [Object.keys(data[0] || {})[1] || 'Value']: `Cantidad: ${analytics.minSales.quantity}`
      });
      // Add max sales info
      worksheetData.unshift({
        [Object.keys(data[0] || {})[0] || 'Info']: `Fecha con más ventas: ${analytics.maxSales.date}`,
        [Object.keys(data[0] || {})[1] || 'Value']: `Cantidad: ${analytics.maxSales.quantity}`
      });
    } else if (analytics.type === 'products') {
      const productLabel = analytics.isTopSelling ? 'Producto más vendido' : 'Producto menos vendido';
      worksheetData.unshift({
        [Object.keys(data[0] || {})[0] || 'Info']: `${productLabel}: ${analytics.product}`,
        [Object.keys(data[0] || {})[1] || 'Value']: `Cantidad: ${analytics.quantity}`
      });
    }
  }
  
  const ws = XLSX.utils.json_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, finalFilename);
};

// Generic search filter function
export const applySearchFilter = (data, searchTerm, searchFields) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return data.filter((item) => {
    return searchFields.some(field => {
      const value = field.accessor(item);
      return value && value.toString().toLowerCase().includes(lowerSearchTerm);
    });
  });
};