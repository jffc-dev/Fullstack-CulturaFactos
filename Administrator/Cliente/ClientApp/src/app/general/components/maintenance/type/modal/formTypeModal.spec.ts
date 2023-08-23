import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeModalComponent } from './formTypeModal.component';

describe('FormTypeModalComponent', () => {
  let component: FormTypeModalComponent;
  let fixture: ComponentFixture<FormTypeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormTypeModalComponent]
    });
    fixture = TestBed.createComponent(FormTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
