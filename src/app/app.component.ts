import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Employee {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contact: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titles = ['Mr', 'Mrs', 'Miss', 'Dr'];
  employees: Employee[] = [];
  editId: number | null = null;
  emailExists = false; // <-- new flag

  model: Employee = {
    id: 0,
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    contact: ''
  };

  ngOnInit() {
    const saved = localStorage.getItem('employees');
    if (saved) {
      this.employees = JSON.parse(saved);
    }
  }

  checkDuplicateEmail() {
    this.emailExists = this.employees.some(emp =>
      emp.email.toLowerCase() === (this.model.email || '').toLowerCase() &&
      emp.id !== this.editId
    );
  }

  saveEmployee(form: NgForm) {
    if (form.invalid || this.emailExists) return;

    if (this.editId === null) {
      this.model.id = Date.now();
      this.employees.push({ ...this.model });
    } else {
      const index = this.employees.findIndex(e => e.id === this.editId);
      if (index !== -1) {
        this.employees[index] = { ...this.model, id: this.editId };
      }
      this.editId = null;
    }

    this.updateLocalStorage();
    form.resetForm();
    this.emailExists = false;
  }

  editEmployee(employee: Employee) {
    this.model = { ...employee };
    this.editId = employee.id;
    this.emailExists = false;
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }
}
