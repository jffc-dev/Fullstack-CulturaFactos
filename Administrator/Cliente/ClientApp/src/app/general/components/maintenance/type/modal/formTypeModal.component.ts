import { Component, OnInit } from '@angular/core';
import { DTOType } from '../../../../domain/type';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TYPE_GENERAL_TYPES, TYPE_OPERATION_CREATE, TYPE_OPERATION_UPDATE } from '../../../../../../constants/general/general.constants';
import { TypeService } from '../../../../services/type/type.service';

@Component({
  selector: 'app-form-type-modal',
  templateUrl: './formTypeModal.component.html',
  styleUrls: ['./formTypeModal.component.css'],
  providers: []
})
export class FormTypeModalComponent implements OnInit {
  formGroup!: FormGroup;
  type!: DTOType;
  generalTypes!: DTOType[];
  typeOperation: string = "";
  checkboxValue: string = "GENERAL";

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private typeService: TypeService) { }

  ngOnInit() {

    this.createFormGroup();
    this.getInitialData();
    this.setDataForm();
    this.setDataState();
    

    if (this.typeOperation === TYPE_OPERATION_UPDATE) {
      this.formGroup.get('typeCode')!.disable();
    }
  }

  createFormGroup() {
    this.formGroup = new FormGroup({
      tableCode: new FormControl<string | null>(null),
      typeCode: new FormControl<string | null>(null),
      description1: new FormControl<string | null>(null),
      description2: new FormControl<string | null>(null),
      general: new FormControl<string | null>(null)
    });

    this.formGroup.get('general')!.valueChanges.subscribe((newValue: string[]) => {
      //VALIDATE IF VALUE IS INCLUDED INTO NEWVALUE
      console.log(newValue)
      if (newValue) {
        if (newValue.includes(this.checkboxValue)) {
          this.formGroup.get('tableCode')!.disable();
          this.formGroup.get('typeCode')!.enable();
        } else {
          this.formGroup.get('tableCode')!.enable();
          this.formGroup.get('typeCode')!.disable();
        }
      }
    });
  }

  getInitialData() {
    this.typeOperation = this.config.data.typeOperation;
    this.type = this.config.data.selectedType;
    this.generalTypes = this.config.data.generalTypes;
    console.log(this.config.data.selectedType)
  }

  setDataForm() {
    if (this.typeOperation === TYPE_OPERATION_UPDATE) {
      this.formGroup.get('tableCode')!.patchValue(this.type.tableCode);
      this.formGroup.get('typeCode')!.patchValue(this.type.typeCode);
      this.formGroup.get('description1')!.patchValue(this.type.description1);
    } else if (this.typeOperation === TYPE_OPERATION_CREATE) {

    }
  }

  setDataState() {
    //FOR TYPE OF OPERATION
    if (this.typeOperation === TYPE_OPERATION_UPDATE) {
      this.formGroup.get('tableCode')!.disable();
      this.formGroup.get('typeCode')!.disable();
    } else if (this.typeOperation === TYPE_OPERATION_CREATE) {
      this.formGroup.get('tableCode')!.enable();
      this.formGroup.get('typeCode')!.disable();
    }
    console.log(this.formGroup.get('tableCode')!.value)
    //FOR VALIDATIONS
    if (this.formGroup.get('tableCode')!.value !== TYPE_GENERAL_TYPES && this.typeOperation === TYPE_OPERATION_CREATE ) {
      this.formGroup.get('general')!.enable();
    }else{
      this.formGroup.get('general')!.disable();
    }
  }

  hideDialog() {
  }

  onCLickConfirm() {
    if (this.typeOperation === TYPE_OPERATION_UPDATE) {
      this.updateType();
    } else if (this.typeOperation === TYPE_OPERATION_CREATE) {
      this.createType();
    }
  }

  createType() {
    const typeToSave: DTOType = {};
    if (this.formGroup.get('tableCode')!.value === null) {
      typeToSave.tableCode = TYPE_GENERAL_TYPES;
    } else {
      typeToSave.tableCode = this.formGroup.get('tableCode')!.value;
    }
    typeToSave.typeCode = this.formGroup.get('typeCode')!.value;
    typeToSave.description1 = this.formGroup.get('description1')!.value;
    typeToSave.description2 = this.formGroup.get('description2')!.value;

    this.typeService.create(typeToSave).subscribe((data) => {
      console.log(data);
    });
  }

  updateType() {
    const typeToSave: DTOType = {};
    typeToSave.tableCode = this.formGroup.get('tableCode')!.value;

    this.typeService.update(typeToSave).subscribe((data) => {
      console.log(data);
    });
  }
}
