import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class RolesComponent {
  // Mock Data
  rolesData = signal<Role[]>([
    { id: 'R001', name: 'Super Admin', description: 'Full access to all system features', usersCount: 2 },
    { id: 'R002', name: 'Administrator', description: 'Access to most features, cannot delete system configs', usersCount: 5 },
    { id: 'R003', name: 'Principal', description: 'View access to reports and overall dashboards', usersCount: 1 },
    { id: 'R004', name: 'HOD', description: 'Department level access for approvals', usersCount: 8 },
    { id: 'R005', name: 'Accountant', description: 'Access to fee collection and financial reports', usersCount: 4 },
    { id: 'R006', name: 'Clerk', description: 'Basic data entry and student queries', usersCount: 12 },
    { id: 'R007', name: 'Faculty', description: 'View student performance and attendance', usersCount: 120 },
    { id: 'R008', name: 'Student', description: 'View own fee status and notices', usersCount: 1500 },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<Role | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<Role | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.rolesData();
    if (!term) return data;
    return data.filter(role => 
      role.name.toLowerCase().includes(term) || 
      role.description.toLowerCase().includes(term) ||
      role.id.toLowerCase().includes(term)
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

  openViewModal(record: Role) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: Role) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.rolesData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.rolesData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
