import { Component, OnInit } from '@angular/core';
import { Type } from '../../../../domain/type';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-type-modal',
  templateUrl: './formTypeModal.component.html',
  styleUrls: ['./formTypeModal.component.css'],
  providers: []
})
export class FormTypeModalComponent implements OnInit {
  formGroup!: FormGroup;
  submitted: boolean = false;
  type!: Type;

  ngOnInit() {
    this.formGroup = new FormGroup({
      text: new FormControl<string | null>(null)
    });
  }

  saveProduct() {
    this.submitted = true;
  }

  hideDialog() {
  }
}
