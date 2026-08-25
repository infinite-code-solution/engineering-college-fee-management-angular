import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  twoFactor: string;
}

@Component({
  selector: 'app-super-admins',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './super-admins.html',
  styleUrls: ['./super-admins.css']
})
export class SuperAdminsComponent {
  // Mock Data
  superAdminsData = signal<SuperAdmin[]>([
    { id: 'SA-001', name: 'System Root', email: 'root@jntu.edu', twoFactor: 'Enabled' },
    { id: 'SA-002', name: 'IT Director', email: 'it.director@jntu.edu', twoFactor: 'Enabled' },
    { id: 'SA-003', name: 'Lead Developer', email: 'lead.dev@jntu.edu', twoFactor: 'Disabled' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<SuperAdmin | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<SuperAdmin | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.superAdminsData();
    if (!term) return data;
    return data.filter(sa => 
      sa.name.toLowerCase().includes(term) || 
      sa.email.toLowerCase().includes(term) ||
      sa.twoFactor.toLowerCase().includes(term) ||
      sa.id.toLowerCase().includes(term)
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

  openViewModal(record: SuperAdmin) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: SuperAdmin) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.superAdminsData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.superAdminsData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
