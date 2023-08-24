import { Component, OnInit } from '@angular/core';
import { Type } from '../../../../domain/type';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TYPE_OPERATION_UPDATE } from '../../../../../../constants/general/general.constants';

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
  typesSelect!: Type[];
  typeOperation: String = "";

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      tableCode: new FormControl<string | null>(null),
      typeCode: new FormControl<string | null>(null),
      description1: new FormControl<string | null>(null),
      description2: new FormControl<string | null>(null)
    });

    this.typeOperation = this.config.data.typeOperation;

    if (this.typeOperation === TYPE_OPERATION_UPDATE) {
      this.formGroup.get('typeCode')!.disable();
    }
  }

  saveProduct() {
    this.submitted = true;
  }

  hideDialog() {
  }
}
