import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DTOType } from '../../../domain/type';
import { TypeService } from '../../../services/type/type.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormTypeModalComponent } from './modal/formTypeModal.component';
import { TYPE_OPERATION_CREATE, TYPE_OPERATION_UPDATE, TYPE_GENERAL_TYPES } from '../../../../../constants/general/general.constants';

@Component({
  selector: 'form-type-maintenance',
  templateUrl: './formType.component.html',
  styleUrls: ['./formType.component.css'],
  providers: [MessageService, ConfirmationService, DialogService]
})
export class FormTypeComponent implements OnInit {
  typeDialog: boolean = false;
  types!: DTOType[];
  generalTypes!: DTOType[];
  selectedTypes!: DTOType[] | null;

  ref: DynamicDialogRef | undefined;

  ngOnInit() {
    this.buildComponent();
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private typeService: TypeService,
    private dialogService: DialogService
  ) { }

  buildComponent() {
    this.getInitialTypes()
  }

  getInitialTypes() {
    this.typeService.read().subscribe((data) => {
      this.types = data;
      this.generalTypes = data.filter((type) => type.tableCode === TYPE_GENERAL_TYPES)
    });
  }

  openNew() {
    this.ref = this.dialogService.open(FormTypeModalComponent, {
      header: 'Create a Type',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        typeOperation: TYPE_OPERATION_CREATE,
        selectedType: null,
        generalTypes: this.generalTypes
      }
    });

    this.ref.onClose.subscribe((type: DTOType) => {
      console.log(type)
      this.getInitialTypes()
    });
  }

  deleteSelectedTypes() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.types = this.types.filter((val) => !this.selectedTypes?.includes(val));
        this.selectedTypes = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }

  editType(type: DTOType) {
    this.ref = this.dialogService.open(FormTypeModalComponent, {
      header: 'Edit a Type',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        typeOperation: TYPE_OPERATION_UPDATE,
        selectedType: type,
        generalTypes: this.generalTypes
      }
    });

    this.ref.onClose.subscribe((type: DTOType) => {
      console.log(type)
      this.getInitialTypes()
    });
  }

  deleteType(type: DTOType) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete, ' + type.tableCode + ' - ' + type.description1 + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.typeService.delete(type).subscribe((data) => {
          console.log(data);
          this.types = this.types.filter((val) => val.id !== type.id);
          //this.type = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Type Deleted', life: 3000 });
        });
        }
    });
  }
}
