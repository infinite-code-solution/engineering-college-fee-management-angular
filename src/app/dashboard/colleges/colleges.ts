import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

interface College {
  id: string;
  name: string;
  code: string;
  email: string;
  mobile: string;
  website: string;
  address: string;
}

interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
}

interface Course {
  id: string;
  name: string;
  code: string;
  duration: number;
  department: string;
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
  course: string;
  year: string;
  mobile: string;
}

interface FeeStructure {
  id: string;
  course: string;
  year: string;
  tuitionFee: number;
  otherFees: number;
  totalFee: number;
}

interface FeeManagementRecord {
  id: string;
  rollNo: string;
  studentName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  college: string;
  academicYear: string;
  course: string;
  tuitionFee: number;
  libraryFee: number;
  sportsFee: number;
}

@Component({
  selector: 'app-colleges',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './colleges.html',
  styleUrls: ['./colleges.css']
})
export class CollegesComponent {
  activeTab = signal('list');

  // --- Mock Data ---
  collegesData = signal<College[]>([
    { id: '1', name: 'JNTU College of Engineering', code: 'JNTUCE', email: 'info@jntuce.ac.in', mobile: '9876543210', website: 'www.jntuce.ac.in', address: 'Anantapur, AP' },
    { id: '2', name: 'Tadipatri Engineering College', code: 'TEC', email: 'contact@tec.ac.in', mobile: '9876543211', website: 'www.tec.ac.in', address: 'Tadipatri, AP' },
  ]);

  academicYearsData = signal<AcademicYear[]>([
    { id: '1', year: '2024-2025', startDate: '2024-06-01', endDate: '2025-05-31', status: 'Active' },
    { id: '2', year: '2023-2024', startDate: '2023-06-01', endDate: '2024-05-31', status: 'Inactive' }
  ]);

  coursesData = signal<Course[]>([
    { id: '1', name: 'Computer Science', code: 'CSE', duration: 4, department: 'Engineering' },
    { id: '2', name: 'Civil Engineering', code: 'CE', duration: 4, department: 'Engineering' }
  ]);

  studentsData = signal<Student[]>([
    { id: '1', name: 'John Doe', rollNo: '24CSE001', course: 'Computer Science', year: '2024-2025', mobile: '9876543210' },
    { id: '2', name: 'Jane Smith', rollNo: '24CE002', course: 'Civil Engineering', year: '2024-2025', mobile: '9876543211' }
  ]);

  feeStructuresData = signal<FeeStructure[]>([
    { id: '1', course: 'Computer Science', year: '2024-2025', tuitionFee: 50000, otherFees: 10000, totalFee: 60000 },
    { id: '2', course: 'Civil Engineering', year: '2024-2025', tuitionFee: 45000, otherFees: 10000, totalFee: 55000 }
  ]);

  feeManagementData = signal<FeeManagementRecord[]>([
    { id: '1', rollNo: '24CSE001', studentName: 'John Doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', mobile: '9876543210', address: '123 Main St, Anantapur', college: 'JNTU College of Engineering', academicYear: '2024-2025', course: 'Computer Science', tuitionFee: 50000, libraryFee: 2000, sportsFee: 1500 },
    { id: '2', rollNo: '24CE002', studentName: 'Jane Smith', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', mobile: '9876543211', address: '456 Oak Rd, Tadipatri', college: 'Tadipatri Engineering College', academicYear: '2024-2025', course: 'Civil Engineering', tuitionFee: 45000, libraryFee: 2000, sportsFee: 1000 }
  ]);

  // Filters for Fee Management Tab
  fmSelectedCollege = signal('');
  fmSelectedYear = signal('');
  fmSelectedCourse = signal('');
  fmSearchTriggered = signal(false);

  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  // --- Common Logic ---
  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    const total = this.activeTotalPages();
    if (page >= 1 && page <= total) {
      this.currentPage.set(page);
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // --- Type-Safe Signals ---
  filteredColleges = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.collegesData();
    if (!term) return data;
    return data.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term));
  });
  paginatedColleges = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredColleges().slice(start, start + this.pageSize());
  });

  filteredAcademicYears = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.academicYearsData();
    if (!term) return data;
    return data.filter(a => a.year.toLowerCase().includes(term));
  });
  paginatedAcademicYears = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredAcademicYears().slice(start, start + this.pageSize());
  });

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.coursesData();
    if (!term) return data;
    return data.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term));
  });
  paginatedCourses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredCourses().slice(start, start + this.pageSize());
  });

  filteredStudents = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.studentsData();
    if (!term) return data;
    return data.filter(s => s.name.toLowerCase().includes(term) || s.rollNo.toLowerCase().includes(term));
  });
  paginatedStudents = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredStudents().slice(start, start + this.pageSize());
  });

  filteredFees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const data = this.feeStructuresData();
    if (!term) return data;
    return data.filter(f => f.course.toLowerCase().includes(term) || f.year.toLowerCase().includes(term));
  });
  paginatedFees = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredFees().slice(start, start + this.pageSize());
  });

  filteredFeeManagement = computed(() => {
    let data = this.feeManagementData();
    if (this.fmSearchTriggered()) {
      if (this.fmSelectedCollege()) {
        data = data.filter(r => r.college === this.fmSelectedCollege());
      }
      if (this.fmSelectedYear()) {
        data = data.filter(r => r.academicYear === this.fmSelectedYear());
      }
      if (this.fmSelectedCourse()) {
        data = data.filter(r => r.course === this.fmSelectedCourse());
      }
    } else {
      return []; // Don't show data until search is clicked
    }
    return data;
  });
  paginatedFeeManagement = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredFeeManagement().slice(start, start + this.pageSize());
  });

  searchFeeManagement() {
    this.fmSearchTriggered.set(true);
    this.currentPage.set(1);
  }

  activeTotalLength = computed(() => {
    const tab = this.activeTab();
    if (tab === 'list') return this.filteredColleges().length;
    if (tab === 'academic') return this.filteredAcademicYears().length;
    if (tab === 'courses') return this.filteredCourses().length;
    if (tab === 'students') return this.filteredStudents().length;
    if (tab === 'fees') return this.filteredFees().length;
    if (tab === 'fee-mgmt') return this.filteredFeeManagement().length;
    return 0;
  });

  activeTotalPages = computed(() => {
    return Math.ceil(this.activeTotalLength() / this.pageSize());
  });

  // --- Modal State Management ---
  showDeleteModal = signal(false);
  recordToDelete = signal<{id: string, type: string} | null>(null);

  // Generic Edit Modal State
  showEditModal = signal(false);
  editingRecord = signal<any | null>(null);
  editingType = signal<string | null>(null);

  // Generic View Modal State
  showViewModal = signal(false);
  viewingRecord = signal<any | null>(null);
  viewingType = signal<string | null>(null);

  // --- Modals ---
  openViewModal(record: any, type: string) {
    this.viewingRecord.set(record);
    this.viewingType.set(type);
    this.showViewModal.set(true);
  }

  closeViewModal() {
    this.showViewModal.set(false);
    this.viewingRecord.set(null);
    this.viewingType.set(null);
  }

  openEditModal(record: any, type: string) {
    this.editingRecord.set({ ...record });
    this.editingType.set(type);
    this.showEditModal.set(true);
  }

  saveEdit() {
    const edited = this.editingRecord();
    const type = this.editingType();
    
    if (edited && type) {
      if (type === 'college') {
        this.collegesData.update(data => data.map(r => r.id === edited.id ? edited : r));
      } else if (type === 'academic') {
        this.academicYearsData.update(data => data.map(r => r.id === edited.id ? edited : r));
      } else if (type === 'course') {
        this.coursesData.update(data => data.map(r => r.id === edited.id ? edited : r));
      } else if (type === 'student') {
        this.studentsData.update(data => data.map(r => r.id === edited.id ? edited : r));
      } else if (type === 'fee') {
        this.feeStructuresData.update(data => data.map(r => r.id === edited.id ? edited : r));
      }
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.showEditModal.set(false);
    this.editingRecord.set(null);
    this.editingType.set(null);
  }

  openDeleteModal(id: string, type: string) {
    this.recordToDelete.set({ id, type });
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    const record = this.recordToDelete();
    if (record) {
      const { id, type } = record;
      if (type === 'college') {
        this.collegesData.update(data => data.filter(r => r.id !== id));
      } else if (type === 'academic') {
        this.academicYearsData.update(data => data.filter(r => r.id !== id));
      } else if (type === 'course') {
        this.coursesData.update(data => data.filter(r => r.id !== id));
      } else if (type === 'student') {
        this.studentsData.update(data => data.filter(r => r.id !== id));
      } else if (type === 'fee') {
        this.feeStructuresData.update(data => data.filter(r => r.id !== id));
      } else if (type === 'fee-mgmt') {
        // As per plan, clear the fee record
        this.feeManagementData.update(data => data.map(r => r.id === id ? { ...r, tuitionFee: 0, libraryFee: 0, sportsFee: 0 } : r));
      }
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.recordToDelete.set(null);
  }

  // --- Fee Management Specific Modals ---
  fmStudentDetails = signal<FeeManagementRecord | null>(null);
  fmFeeDetails = signal<FeeManagementRecord | null>(null);

  openFmStudentDetails(record: FeeManagementRecord) {
    this.fmStudentDetails.set(record);
  }

  closeFmStudentDetails() {
    this.fmStudentDetails.set(null);
  }

  openFmFeeDetails(record: FeeManagementRecord) {
    this.fmFeeDetails.set(record);
  }

  closeFmFeeDetails() {
    this.fmFeeDetails.set(null);
  }
}
