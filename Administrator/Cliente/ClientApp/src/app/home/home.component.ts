import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Type } from 'src/domain/type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent {
  typeDialog: boolean = false;
  submitted: boolean = false;
  type!: Type;
  types!: Type[];
  selectedTypes!: Type[] | null;

  constructor (private messageService: MessageService, private confirmationService: ConfirmationService){}

  hideDialog() {
    this.typeDialog = false;
    this.submitted = false;
  }

  openNew() {
    this.type = {};
    this.submitted = false;
    this.typeDialog = true;
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

  saveProduct() {
    this.submitted = true;

    if (this.type.name?.trim()) {
        if (this.type.id) {
            this.types[this.findIndexById(this.type.id)] = this.type;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'type Updated', life: 3000 });
        } else {
            this.type.id = this.createId();
            this.types.push(this.type);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'type Created', life: 3000 });
        }

        this.types = [...this.types];
        this.typeDialog = false;
        this.type = {};
    }
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

  editType(type: Type) {
    this.type = { ...type };
    this.typeDialog = true;
  }

  deleteType(type: Type) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + type.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.types = this.types.filter((val) => val.id !== type.id);
          this.type = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }
    });
  }
}
