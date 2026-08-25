import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface TrainingInstitute {
  id: string;
  name: string;
  code: string;
  email: string;
  mobile: string;
  website: string;
  address: string;
}

@Component({
  selector: 'app-training-institutes',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './training-institutes.html',
  styleUrls: ['./training-institutes.css']
})
export class TrainingInstitutesComponent {
  // Mock Data
  institutesData = signal<TrainingInstitute[]>([
    { id: '1', name: 'Excel Software Training', code: 'EST', email: 'contact@excel.com', mobile: '9876543210', website: 'www.excel.com', address: 'Hyderabad' },
    { id: '2', name: 'Global Tech Institute', code: 'GTI', email: 'info@gti.edu', mobile: '9876543211', website: 'www.gti.edu', address: 'Bangalore' },
  ]);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // Modal State
  showDeleteModal = signal(false);
  recordToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingRecord = signal<TrainingInstitute | null>(null);

  showViewModal = signal(false);
  viewingRecord = signal<TrainingInstitute | null>(null);

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.institutesData();
    if (!term) return data;
    return data.filter(institute => 
      institute.name.toLowerCase().includes(term) || 
      institute.code.toLowerCase().includes(term) ||
      institute.email.toLowerCase().includes(term) ||
      institute.mobile.toLowerCase().includes(term)
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

  openViewModal(record: TrainingInstitute) {
    this.viewingRecord.set(record);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
  }

  openEditModal(record: TrainingInstitute) {
    this.editingRecord.set({ ...record });
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    if (edited) {
      this.institutesData.update(data => data.map(r => r.id === edited.id ? edited : r));
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
      this.institutesData.update(data => data.filter(r => r.id !== id));
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }
}
