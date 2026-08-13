import { inject, Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FeeRecord } from '../fee-collection/fee-collection';
//(pdfMake as any).addVirtualFileSystem(pdfFonts);
// Assign the raw VFS dictionary straight to pdfMake's vfs object
// (pdfMake as any).vfs = pdfFonts && pdfFonts['pdfMake'] ? pdfFonts['pdfMake'].vfs : pdfFonts;
// // Assign the raw VFS dictionary straight to pdfMake's vfs object
// (pdfMake as any).vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;


@Injectable({
  providedIn: 'root'
})
export class FeeExportService {
  /**
   * Generates and triggers download for Excel spreadsheets (.xlsx)
   */
  exportToExcel(records: FeeRecord[]): void {
    // 1. Map raw domain objects to strict user-readable tabular row arrays
    const formattedData = records.map(record => ({
      'Invoice Ref': record.id,
      'Student Name': record.studentName,
      'Roll Number': record.rollNumber,
      'Branch': record.branch,
      'Academic Year': `Year ${record.academicYear}`,
      'Fee Type': record.feeType,
      'Total Payable (INR)': record.totalAmount,
      'Amount Paid (INR)': record.amountPaid,
      'Balance Owed (INR)': record.totalAmount - record.amountPaid,
      'Collection Status': record.status
    }));

    // 2. Build workbook structure and convert json maps to matrix sheets
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Collection Ledger');

    // 3. Auto-fit operational column sizing limits
    const maxColumnWidths = Object.keys(formattedData[0] || {}).map(key => ({
      wch: Math.max(key.length + 3, ...formattedData.map(row => String((row as any)[key]).length + 2))
    }));
    worksheet['!cols'] = maxColumnWidths;

    // 4. Generate raw buffer blob format download streams
    XLSX.writeFile(workbook, `Tadipatri_Fee_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  /**
   * Builds pixel-perfect corporate ledger reports using pdfmake document descriptions
   */
  exportToPdf(records: FeeRecord[], metrics: any): void {
    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 40, 40, 40],
      header: (currentPage: number, pageCount: number) => {
        return {
          text: `Tadipatri Engineering College and Technology | Confidential Financial Ledger`,
          alignment: 'right',
          fontSize: 8,
          color: '#6c757d',
          margin: [0, 15, 40, 0]
        };
      },
      footer: (currentPage: number, pageCount: number) => {
        return {
          text: `Page ${currentPage} of ${pageCount} — Generated on ${new Date().toLocaleDateString()}`,
          alignment: 'center',
          fontSize: 9,
          color: '#6c757d'
        };
      },
      content: [
        // Brand Title Header Block
        { text: 'TADIPATRI ENGINEERING COLLEGE AND TECHNOLOGY', style: 'mainHeader' },
        { text: 'OFFICE OF ADMINISTRATIVE FINANCE & COLLECTION LEDGER', style: 'subHeader' },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 760, y2: 5, lineWidth: 1, lineColor: '#0b1d33' }] },
        { text: '', margin: [0, 0, 0, 15] },

        // Summary Information Block (KPIs Metadata row mirroring your layout cards)
        {
          columns: [
            { text: `Total Gross Collected: INR ${metrics.totalCollected.toLocaleString()}`, bold: true, color: '#198754' },
            { text: `Outstanding Balance: INR ${metrics.totalPending.toLocaleString()}`, bold: true, color: '#dc3545' },
            { text: `Collection Rate: ${metrics.collectionPercentage}%`, bold: true, color: '#0d6efd' }
          ],
          margin: [0, 0, 0, 20]
        },

        // Dynamic Compilation Table Matrix
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              // Header definitions
              [
                { text: 'Invoice ID', style: 'tableHeader' },
                { text: 'Student Context', style: 'tableHeader' },
                { text: 'Branch', style: 'tableHeader' },
                { text: 'Fee Classification', style: 'tableHeader' },
                { text: 'Total', style: 'tableHeader' },
                { text: 'Paid', style: 'tableHeader' },
                { text: 'Balance Due', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' }
              ],
              // Row population mapping logic array structures
              ...records.map(r => [
                { text: r.id, fontSize: 9 },
                { text: `${r.studentName}\n(${r.rollNumber})`, fontSize: 9, bold: true },
                { text: `${r.branch} - Yr ${r.academicYear}`, fontSize: 9 },
                { text: r.feeType, fontSize: 9 },
                { text: `₹${r.totalAmount.toLocaleString()}`, fontSize: 9, alignment: 'right' },
                { text: `₹${r.amountPaid.toLocaleString()}`, fontSize: 9, alignment: 'right', color: '#198754' },
                { text: `₹${(r.totalAmount - r.amountPaid).toLocaleString()}`, fontSize: 9, alignment: 'right', color: r.totalAmount - r.amountPaid > 0 ? '#dc3545' : '#000' },
                { text: r.status, fontSize: 9, bold: true, color: r.status === 'PAID' ? '#198754' : r.status === 'PARTIAL' ? '#ffc107' : '#dc3545' }
              ])
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#0b1d33' : rowIndex % 2 === 0 ? '#f8f9fa' : null
          }
        }
      ],
      styles: {
        mainHeader: { fontSize: 16, bold: true, color: '#0b1d33', letterSpacing: 0.5 },
        subHeader: { fontSize: 10, bold: true, color: '#6c757d', margin: [0, 4, 0, 4] },
        tableHeader: { color: '#ffffff', bold: true, fontSize: 10, margin: [0, 4, 0, 4] }
      }
    };

    // 5. Initialize file-saver download orchestration lifecycle
    pdfMake.createPdf(documentDefinition).download(`Tadipatri_Fee_Ledger_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
