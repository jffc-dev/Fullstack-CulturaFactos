import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { FormTypeComponent } from './components/maintenance/type/formType.component';
import { FormTypeModalComponent } from './components/maintenance/type/modal/formTypeModal.component';
import { CounterComponent } from './components/navigation/counter/counter.component';
import { FetchDataComponent } from './components/navigation/fetch-data/fetch-data.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    FormTypeComponent,
    FormTypeModalComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: FormTypeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
    BrowserAnimationsModule,
    TableModule,
    ToastModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    DropdownModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    CheckboxModule
  ],
  providers: [],
  bootstrap: []
})
export class GeneralModule { }
