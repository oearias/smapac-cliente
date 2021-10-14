import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaContratoComponent } from './valida-contrato.component';

describe('ValidaContratoComponent', () => {
  let component: ValidaContratoComponent;
  let fixture: ComponentFixture<ValidaContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
