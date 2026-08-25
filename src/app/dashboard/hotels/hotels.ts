import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface Hotel {
  id: string;
  name: string;
  code: string;
  email: string;
  mobile: string;
  website: string;
  address: string;
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './hotels.html',
  styleUrls: ['./hotels.css']
})
export class HotelsComponent {
  // Mock Data
  hotelsData = signal<Hotel[]>([
    { id: '1', name: 'Grand Plaza', code: 'GP-01', email: 'contact@grandplaza.com', mobile: '9876543210', website: 'www.grandplaza.com', address: 'City Center' },
    { id: '2', name: 'Comfort Inn', code: 'CI-02', email: 'stay@comfortinn.com', mobile: '9876543211', website: 'www.comfortinn.com', address: 'Highway 42' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<Hotel | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<Hotel | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.hotelsData();
    if (!term) return data;
    return data.filter(hotel => 
      hotel.name.toLowerCase().includes(term) || 
      hotel.code.toLowerCase().includes(term) ||
      hotel.email.toLowerCase().includes(term) ||
      hotel.mobile.toLowerCase().includes(term)
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

  openViewModal(record: Hotel) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: Hotel) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.hotelsData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.hotelsData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
