import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-student.html',
  styleUrls: ['./edit-student.css']
})
export class EditStudentComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() studentData: any = null;
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  localStudent: any = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['studentData'] && changes['studentData'].currentValue) {
      // Create a deep copy of the student data so we don't modify the original until saved
      this.localStudent = JSON.parse(JSON.stringify(this.studentData));
    }
  }

  onSave() {
    this.save.emit(this.localStudent);
  }

  onCancel() {
    this.cancel.emit();
  }
}
