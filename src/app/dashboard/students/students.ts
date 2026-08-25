import { Component, signal, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';
import { EditStudentComponent } from './edit-student/edit-student';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  selected?: boolean;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent, EditStudentComponent],
  templateUrl: './students.html',
  styleUrls: ['./students.css']
})
export class Students {
  // Master Database of Mock Students
  private rawStudents: Student[] = Array.from({ length: 45 }, (_, i) => ({
    id: `STD-2026-${(i + 1).toString().padStart(4, '0')}`,
    firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Daniel', 'Olivia'][i % 8],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
    email: `student${i+1}@jntu.edu`,
    mobile: `+91 98765 ${Math.floor(10000 + Math.random() * 90000)}`,
    selected: false
  }));

  // Global State
  allStudents = signal<Student[]>([...this.rawStudents]);
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  
  // Mode State
  isServerSide = signal(false);
  loading = signal(false);

  // Server-Side specific state
  serverData = signal<Student[]>([]);
  serverTotalItems = signal(0);

  // Modal State
  showDeleteModal = signal(false);
  studentToDelete = signal<string | null>(null);

  showEditModal = signal(false);
  editingStudent = signal<Student | null>(null);

  showViewModal = signal(false);
  viewingStudent = signal<Student | null>(null);

  constructor() {
    // Effect to trigger data load when dependencies change in Server-Side mode
    effect(() => {
      if (this.isServerSide()) {
        this.fetchServerData(this.currentPage(), this.pageSize(), this.searchTerm());
      }
    });
  }

  // --- Core Computed Properties ---

  // 1. Client-Side filtering
  filteredClientData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.allStudents();
    if (!term) return data;
    
    return data.filter(s => 
      s.firstName.toLowerCase().includes(term) || 
      s.lastName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.mobile.includes(term) ||
      s.id.toLowerCase().includes(term)
    );
  });

  // 2. Client-Side pagination
  paginatedClientData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredClientData().slice(start, start + this.pageSize());
  });

  // 3. The actual data displayed in the table (switches based on mode)
  displayData = computed(() => {
    return this.isServerSide() ? this.serverData() : this.paginatedClientData();
  });

  // 4. Total items count (for pagination footer)
  totalItems = computed(() => {
    return this.isServerSide() ? this.serverTotalItems() : this.filteredClientData().length;
  });

  // 5. Total pages count
  totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  // --- Selection Logic (Current Page Scope) ---
  
  selectedCount = computed(() => {
    return this.displayData().filter(s => s.selected).length;
  });

  allSelected = computed(() => {
    const data = this.displayData();
    return data.length > 0 && data.every(s => s.selected);
  });

  someSelected = computed(() => {
    const count = this.selectedCount();
    return count > 0 && count < this.displayData().length;
  });

  toggleSelection(id: string) {
    const currentModeData = this.isServerSide() ? this.serverData : this.allStudents;
    
    currentModeData.update(students => 
      students.map(s => s.id === id ? { ...s, selected: !s.selected } : s)
    );
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentData = this.displayData();
    const visibleIds = new Set(currentData.map(s => s.id));

    const currentModeData = this.isServerSide() ? this.serverData : this.allStudents;

    currentModeData.update(students => 
      students.map(s => visibleIds.has(s.id) ? { ...s, selected: isChecked } : s)
    );
  }

  // --- Modal Actions (Edit / Delete / View) ---

  openViewModal(student: Student) {
    this.viewingStudent.set(student);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingStudent.set(null);
  }

  openDeleteModal(id: string) {
    this.studentToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    const id = this.studentToDelete();
    if (id) {
      if (this.isServerSide()) {
        this.serverData.update(data => data.filter(s => s.id !== id));
        this.serverTotalItems.update(c => c - 1);
      } else {
        this.allStudents.update(data => data.filter(s => s.id !== id));
      }
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.studentToDelete.set(null);
    this.showDeleteModal.set(false);
  }

  openEditModal(student: Student) {
    // Clone to avoid live editing before save
    this.editingStudent.set({ ...student });
    this.showEditModal.set(true);
  }

  saveEdit(updatedStudent: Student) {
    if (updatedStudent) {
      if (this.isServerSide()) {
        this.serverData.update(data => data.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      } else {
        this.allStudents.update(data => data.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      }
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingStudent.set(null);
    this.showEditModal.set(false);
  }

  // --- Search / Pagination Actions ---

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages() && !this.loading()) {
      this.currentPage.set(page);
    }
  }

  toggleMode() {
    this.isServerSide.update(v => !v);
    this.currentPage.set(1);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // --- Server-Side Simulation ---
  
  private fetchServerData(page: number, size: number, term: string) {
    this.loading.set(true);
    
    // Simulate network delay
    setTimeout(() => {
      let filtered = [...this.rawStudents];
      if (term) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter(s => 
          s.firstName.toLowerCase().includes(lowerTerm) || 
          s.lastName.toLowerCase().includes(lowerTerm) ||
          s.email.toLowerCase().includes(lowerTerm) ||
          s.mobile.includes(lowerTerm) ||
          s.id.toLowerCase().includes(lowerTerm)
        );
      }
      
      const start = (page - 1) * size;
      const paginated = filtered.slice(start, start + size);
      
      this.serverTotalItems.set(filtered.length);
      this.serverData.set(paginated.map(s => ({...s, selected: false})));
      
      this.loading.set(false);
    }, 800);
  }
}
