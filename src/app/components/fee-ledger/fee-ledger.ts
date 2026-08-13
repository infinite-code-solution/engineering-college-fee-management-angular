import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FeeStructure, FeeSummary } from '../../models/fee.model';
import { FeeService } from '../../services/fee.service';
import { DecimalPipe, NgFor, NgIf, NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-fee-ledger',
  templateUrl: './fee-ledger.html',
  styleUrls: ['./fee-ledger.css'],
  imports: [CommonModule, NgFor, NgIf, NgClass, DecimalPipe]
})
export class FeeLedger implements OnInit {
  feeRecords: FeeStructure[] = [];
  summaryData!: FeeSummary;
  loading: boolean = true;

  constructor(private feeService: FeeService,
    private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.loadFeeData();
  }

  loadFeeData(): void {
    this.feeService.getFeeLedger().subscribe({
      next: (response:any) => {
        this.feeRecords = response.data;
        this.summaryData = response.summary;
        this.loading = false;
        this.cdr.detectChanges(); // Ensure the view updates after data is loaded
      },
      error: (error:any) => {
        console.error('Failed fetching server ledgers.', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'badge-success';
      case 'Partial': return 'badge-warning';
      default: return 'badge-danger';
    }
  }
}
