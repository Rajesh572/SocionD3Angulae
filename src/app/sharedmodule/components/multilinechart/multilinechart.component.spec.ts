import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilinechartComponent } from './multilinechart.component';

describe('MultilinechartComponent', () => {
  let component: MultilinechartComponent;
  let fixture: ComponentFixture<MultilinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
