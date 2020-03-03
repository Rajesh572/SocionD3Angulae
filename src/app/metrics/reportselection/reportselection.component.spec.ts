import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportselectionComponent } from './reportselection.component';

describe('ReportselectionComponent', () => {
  let component: ReportselectionComponent;
  let fixture: ComponentFixture<ReportselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
