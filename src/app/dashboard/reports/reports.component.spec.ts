import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: DownloadReportsComponent;
  let fixture: ComponentFixture<DownloadReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
