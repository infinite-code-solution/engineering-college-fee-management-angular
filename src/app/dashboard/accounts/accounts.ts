import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface Account {
  id: string;
  username: string;
  email: string;
  accountType: string;
  status: string;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './accounts.html',
  styleUrls: ['./accounts.css']
})
export class AccountsComponent {
  // Mock Data
  accountsData = signal<Account[]>([
    { id: 'ACC-001', username: 'jsmith_finance', email: 'jsmith@jntu.edu', accountType: 'Financial', status: 'Active' },
    { id: 'ACC-002', username: 'rbrown_audit', email: 'rbrown@jntu.edu', accountType: 'Auditor', status: 'Active' },
    { id: 'ACC-003', username: 'mwilliams_clerk', email: 'mwilliams@jntu.edu', accountType: 'Billing', status: 'Locked' },
    { id: 'ACC-004', username: 'tjackson_admin', email: 'tjackson@jntu.edu', accountType: 'Financial', status: 'Pending' },
    { id: 'ACC-005', username: 'klee_cashier', email: 'klee@jntu.edu', accountType: 'Billing', status: 'Active' },
    { id: 'ACC-006', username: 'mchen_finance', email: 'mchen@jntu.edu', accountType: 'Financial', status: 'Active' },
    { id: 'ACC-007', username: 'slawrence_clerk', email: 'slawrence@jntu.edu', accountType: 'Billing', status: 'Locked' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<Account | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<Account | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.accountsData();
    if (!term) return data;
    return data.filter(account => 
      account.username.toLowerCase().includes(term) || 
      account.email.toLowerCase().includes(term) ||
      account.accountType.toLowerCase().includes(term) ||
      account.status.toLowerCase().includes(term) ||
      account.id.toLowerCase().includes(term)
    );
  });

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredData().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredData().length / this.pageSize());
  });

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // --- Modals ---

  openViewModal(record: Account) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: Account) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.accountsData.update(data => data.map(r => r.id === edited.id ? edited : r));
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.showEditModal.set(false);
    this.editingRecord.set(null);
  }

  openDeleteModal(id: string) {
    this.recordToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    const id = this.recordToDelete();
    if (id) {
      this.accountsData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
