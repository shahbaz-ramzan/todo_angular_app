import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Store } from '@ngrx/store';
import { createTask, updateTask } from '../../store/tasks/tasks.actions';

@Component({
  selector: 'app-add-edit-dialog',
  standalone: true,
  imports: [ButtonModule, FormsModule, DropdownModule, DialogModule],
  templateUrl: './add-edit-dialog.component.html',
  styleUrl: './add-edit-dialog.component.css',
})
export class AddEditDialogComponent {
  store = inject(Store);
  labels = [
    { name: 'To Do', code: 'todo' },
    { name: 'In Progress', code: 'inprogress' },
    { name: 'Completed', code: 'completed' },
  ];

  @Input() visible: boolean = false;
  @Input() task: any = {
    title: '',
    description: '',
    label: { name: '', code: '' },
  };
  @Input() taskId: string = '';
  @Input() dialogTitle: string = '';
  @Input() btnText: string = 'Save';

  @Output() visibleChange = new EventEmitter<boolean>();

  constructor() {}

  resetForm() {
    this.task = { title: '', description: '', label: { name: '', code: '' } };
  }

  closeDialog() {
    this.visibleChange.emit(false);
    this.resetForm();
  }

  showDialog(arg: 'add' | 'edit', task?: any) {
    this.resetForm();
    this.dialogTitle = arg === 'add' ? 'Add New Task' : 'Edit Task';
    this.btnText = arg === 'add' ? 'Save' : 'Update';
    if (arg === 'edit' && task) {
      this.taskId = task.id;
      this.task = {
        ...task,
        label: this.labels.find((label) => label.code === task.status) || {
          name: '',
          code: '',
        },
      };
    } else if (arg === 'add') {
      this.task.label = this.labels.find((label) => label.code === 'todo') || {
        name: '',
        code: '',
      };
    }

    this.visible = true;
  }

  addTask() {
    const payload = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.label?.code,
    };

    if (this.btnText === 'Save') {
      this.store.dispatch(createTask({ task: payload }));
    } else {
      this.store.dispatch(
        updateTask({ task: { ...payload, id: this.taskId } })
      );
    }
    this.closeDialog();
  }
}
