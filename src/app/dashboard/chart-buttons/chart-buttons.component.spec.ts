import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartButtonsComponent } from './chart-buttons.component';

describe('ChartButtonsComponent', () => {
  let component: ChartButtonsComponent;
  let fixture: ComponentFixture<ChartButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
