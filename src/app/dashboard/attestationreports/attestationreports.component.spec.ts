import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationreportsComponent } from './attestationreports.component';

describe('AttestationreportsComponent', () => {
  let component: AttestationreportsComponent;
  let fixture: ComponentFixture<AttestationreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttestationreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestationreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
