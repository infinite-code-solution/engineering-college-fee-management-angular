import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './staff.html',
  styleUrls: ['./staff.css']
})
export class StaffComponent {
  // Mock Data
  staffData = signal<Staff[]>([
    { id: 'S1001', name: 'Dr. A. Sharma', email: 'asharma@jntu.edu', department: 'Computer Science', designation: 'Professor' },
    { id: 'S1002', name: 'Dr. V. Kumar', email: 'vkumar@jntu.edu', department: 'Civil Eng', designation: 'HOD' },
    { id: 'S1003', name: 'Mrs. S. Reddy', email: 'sreddy@jntu.edu', department: 'Admin', designation: 'Clerk' },
    { id: 'S1004', name: 'Mr. P. Rao', email: 'prao@jntu.edu', department: 'Finance', designation: 'Accountant' },
    { id: 'S1005', name: 'Dr. K. Lakshmi', email: 'klakshmi@jntu.edu', department: 'Electrical Eng', designation: 'Asst. Professor' },
    { id: 'S1006', name: 'Mr. T. Naidu', email: 'tnaidu@jntu.edu', department: 'Mechanical', designation: 'Lab Technician' },
    { id: 'S1007', name: 'Dr. M. Patel', email: 'mpatel@jntu.edu', department: 'Computer Science', designation: 'Assoc. Professor' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<Staff | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<Staff | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.staffData();
    if (!term) return data;
    return data.filter(staff => 
      staff.name.toLowerCase().includes(term) || 
      staff.email.toLowerCase().includes(term) ||
      staff.department.toLowerCase().includes(term) ||
      staff.designation.toLowerCase().includes(term) ||
      staff.id.toLowerCase().includes(term)
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

  openViewModal(record: Staff) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: Staff) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.staffData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.staffData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
