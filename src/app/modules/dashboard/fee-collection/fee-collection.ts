import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FeeExportService } from './fee-export.service';

export interface FeeRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  branch: 'CSE' | 'ECE' | 'MECH' | 'CIVIL';
  academicYear: number;
  feeType: 'Tuition Fee' | 'Exam Fee' | 'Hostel Fee' | 'Transport Fee';
  totalAmount: number;
  amountPaid: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

export interface CollectionMetrics {
  totalCollected: number;
  totalPending: number;
  collectionPercentage: number;
  activeBatchesCount: number;
}

@Component({
  selector: 'app-fee-collection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fee-collection.html',
  styleUrls: ['./fee-collection.css']
})
export class FeeCollection implements OnInit {
  // Master data state sets inside dynamic framework tracking Signals
  feeRecords = signal<FeeRecord[]>([]);
  
private exportService = inject(FeeExportService);
  // Filter form entry management controls
  searchControl = new FormControl('', { nonNullable: true });
  branchFilterControl = new FormControl('ALL', { nonNullable: true });
  statusFilterControl = new FormControl('ALL', { nonNullable: true });

  // Computed state stream derivation logic maps values when upstream datasets modify
  filteredRecords = computed(() => {
    const records = this.feeRecords();
    const query = this.searchControl.value.toLowerCase().trim();
    const branchFilter = this.branchFilterControl.value;
    const statusFilter = this.statusFilterControl.value;

    return records.filter(record => {
      const matchesSearch = !query || 
        record.studentName.toLowerCase().includes(query) ||
        record.rollNumber.toLowerCase().includes(query) ||
        record.id.toLowerCase().includes(query);

      const matchesBranch = branchFilter === 'ALL' || record.branch === branchFilter;
      const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  });

  // Automated computations for dynamic real-time financial tracking cards
  metrics = computed<CollectionMetrics>(() => {
    const currentList = this.filteredRecords();
    if (currentList.length === 0) return { totalCollected: 0, totalPending: 0, collectionPercentage: 0, activeBatchesCount: 0 };

    const totalCollected = currentList.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const grossAggregate = currentList.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalPending = grossAggregate - totalCollected;
    const collectionPercentage = grossAggregate > 0 ? Math.round((totalCollected / grossAggregate) * 100) : 0;

    return {
      totalCollected,
      totalPending,
      collectionPercentage,
      activeBatchesCount: new Set(currentList.map(r => r.branch)).size
    };
  });

  ngOnInit(): void {
    // Populate layout view matrix structures with seed mocked operational datasets
    this.feeRecords.set([
      { id: 'INV-1002A', studentName: 'Anil Kumar Reddy', rollNumber: '22TEC0504', branch: 'CSE', academicYear: 3, feeType: 'Tuition Fee', totalAmount: 85000, amountPaid: 85000, status: 'PAID' },
      { id: 'INV-1002B', studentName: 'Sneha Lakshmi G', rollNumber: '23TEC0412', branch: 'ECE', academicYear: 2, feeType: 'Tuition Fee', totalAmount: 85000, amountPaid: 45000, status: 'PARTIAL' },
      { id: 'INV-1002C', studentName: 'Ravi Teja P', rollNumber: '21TEC0301', branch: 'MECH', academicYear: 4, feeType: 'Hostel Fee', totalAmount: 42000, amountPaid: 0, status: 'UNPAID' },
      { id: 'INV-1002D', studentName: 'Pooja Venkatesh', rollNumber: '24TEC0105', branch: 'CIVIL', academicYear: 1, feeType: 'Tuition Fee', totalAmount: 75000, amountPaid: 75000, status: 'PAID' },
      { id: 'INV-1002E', studentName: 'Harish Chandra', rollNumber: '22TEC0521', branch: 'CSE', academicYear: 3, feeType: 'Transport Fee', totalAmount: 18000, amountPaid: 10000, status: 'PARTIAL' }
    ]);
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.branchFilterControl.setValue('ALL');
    this.statusFilterControl.setValue('ALL');
  }

  // Administrative command placeholders mapped to system operations
  openQuickCollectModal(): void { console.log('Triggering payment receipt overlay configurations'); }
  viewReceipt(id: string): void { console.log('Routing execution to print engine for receipt ID:', id); }
  collectPayment(record: FeeRecord): void { console.log('Loading settlement interfaces for balance fields on entry:', record); }
  sendReminder(id: string): void { alert(`Defaulter automated transaction alert dispatched successfully for invoice record context: ${id}`); }
  voidInvoice(id: string): void { console.warn('Executing standard data purge actions against target reference:', id); }
  triggerExcelExport(): void {
    // Extracts exact current state slice from downstream reactive filters
    const dataToExport = this.filteredRecords();
    this.exportService.exportToExcel(dataToExport);
  }

  triggerPdfExport(): void {
    // Extracts matched items along with computed metric totals directly to PDF layout definition
    const dataToExport = this.filteredRecords();
    const currentMetrics = this.metrics();
    this.exportService.exportToPdf(dataToExport, currentMetrics);
  }
}
