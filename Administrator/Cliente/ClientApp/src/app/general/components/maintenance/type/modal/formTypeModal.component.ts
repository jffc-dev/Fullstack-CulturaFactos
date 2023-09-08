import { Component, OnInit } from '@angular/core';
import { DTOType } from '../../../../domain/type';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TYPE_GENERAL_TYPES, TYPE_OPERATION_CREATE, TYPE_OPERATION_UPDATE } from '../../../../../../constants/type/type.constants';
import { TypeService } from '../../../../services/type/type.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-type-modal',
  templateUrl: './formTypeModal.component.html',
  styleUrls: ['./formTypeModal.component.css'],
  providers: [MessageService]
})
export class FormTypeModalComponent implements OnInit {
  formGroup!: FormGroup;
  type!: DTOType;
  generalTypes!: DTOType[];
  typeOperation: string = "";
  checkboxValue: string = "GENERAL";
  generalTypeSelected!: DTOType;
  messageService: MessageService | undefined

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private typeService: TypeService
  ) { }

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
          this.formGroup.get('tableCode')!.patchValue(null);
          this.formGroup.get('typeCode')!.enable();
        } else {
          this.formGroup.get('tableCode')!.enable();
          this.formGroup.get('typeCode')!.disable();
        }
      }
    });

    this.formGroup.get('tableCode')!.valueChanges.subscribe((newValue: DTOType) => {
      console.log(newValue)
      this.generalTypeSelected = newValue;
    });
  }

  getInitialData() {
    this.typeOperation = this.config.data.typeOperation;
    this.type = this.config.data.selectedType;
    this.generalTypes = this.config.data.generalTypes;
    this.messageService = this.config.data.messageService;
  }

  setDataForm() {
    if (this.typeOperation === TYPE_OPERATION_UPDATE) {
      var selectedType: DTOType = this.generalTypes.find(general => general.typeCode === this.type.tableCode)!;
      this.formGroup.get('tableCode')!.patchValue(selectedType);
      this.formGroup.get('typeCode')!.patchValue(this.type.typeCode);
      this.formGroup.get('description1')!.patchValue(this.type.description1);
      this.formGroup.get('description2')!.patchValue(this.type.description2);
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
      const selectedType: DTOType = this.formGroup.get('tableCode')!.value;
      typeToSave.tableCode = this.formGroup.get('tableCode')!.value;
    }
    typeToSave.typeCode = this.formGroup.get('typeCode')!.value;
    typeToSave.description1 = this.formGroup.get('description1')!.value;
    typeToSave.description2 = this.formGroup.get('description2')!.value;

    this.typeService.create(typeToSave).subscribe({
      next: (data) => {
        console.log(data);
        this.ref.close(data);
      },
      error: (err) => {
        console.log(err)
        this.messageService!.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
      }
    });
  }

  updateType() {
    console.log(this.formGroup.get('typeCode')!.value);
    console.log(this.formGroup.get('tableCode')!.value);
    //const typeToSave: DTOType = {};
    //typeToSave.tableCode = this.formGroup.get('tableCode')!.value;

    //this.typeService.update(typeToSave).subscribe((data) => {
    //  console.log(data);
    //});
  }
}
