import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface Admin {
  id: string;
  name: string;
  email: string;
  modules: string;
  lastLogin: string;
}

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './admins.html',
  styleUrls: ['./admins.css']
})
export class AdminsComponent {
  // Mock Data
  adminsData = signal<Admin[]>([
    { id: 'ADM-01', name: 'John Doe', email: 'john.doe@jntu.edu', modules: 'All Modules', lastLogin: '2023-10-25 09:30 AM' },
    { id: 'ADM-02', name: 'Jane Smith', email: 'jane.smith@jntu.edu', modules: 'Fees, Reports', lastLogin: '2023-10-24 14:15 PM' },
    { id: 'ADM-03', name: 'Michael Johnson', email: 'michael.j@jntu.edu', modules: 'Academics, Library', lastLogin: '2023-10-25 08:45 AM' },
    { id: 'ADM-04', name: 'Sarah Williams', email: 'sarah.w@jntu.edu', modules: 'Hostel, Transport', lastLogin: '2023-10-22 11:20 AM' },
    { id: 'ADM-05', name: 'Robert Brown', email: 'robert.b@jntu.edu', modules: 'Exams, Fees', lastLogin: '2023-10-25 10:05 AM' },
    { id: 'ADM-06', name: 'Emily Davis', email: 'emily.d@jntu.edu', modules: 'Reports Only', lastLogin: '2023-10-23 16:40 PM' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<Admin | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<Admin | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.adminsData();
    if (!term) return data;
    return data.filter(admin => 
      admin.name.toLowerCase().includes(term) || 
      admin.email.toLowerCase().includes(term) ||
      admin.modules.toLowerCase().includes(term) ||
      admin.id.toLowerCase().includes(term)
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

  openViewModal(record: Admin) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: Admin) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.adminsData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.adminsData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
