import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface Shop {
  id: string;
  name: string;
  code: string;
  email: string;
  mobile: string;
  website: string;
  address: string;
}

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './shops.html',
  styleUrls: ['./shops.css']
})
export class ShopsComponent {
  // Mock Data
  shopsData = signal<Shop[]>([
    { id: '1', name: 'Campus Bookstore', code: 'SHP-01', email: 'books@campus.com', mobile: '9876543210', website: 'www.campusbooks.com', address: 'Main Block' },
    { id: '2', name: 'Stationery Corner', code: 'SHP-02', email: 'stationery@campus.com', mobile: '9876543211', website: 'www.stationery.com', address: 'Library Block' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<Shop | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<Shop | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.shopsData();
    if (!term) return data;
    return data.filter(shop => 
      shop.name.toLowerCase().includes(term) || 
      shop.code.toLowerCase().includes(term) ||
      shop.email.toLowerCase().includes(term) ||
      shop.mobile.toLowerCase().includes(term)
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

  openViewModal(record: Shop) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: Shop) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.shopsData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.shopsData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
