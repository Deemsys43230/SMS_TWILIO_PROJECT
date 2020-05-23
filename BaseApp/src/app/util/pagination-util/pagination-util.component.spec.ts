import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationUtilComponent } from './pagination-util.component';

describe('PaginationUtilComponent', () => {
  let component: PaginationUtilComponent;
  let fixture: ComponentFixture<PaginationUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
