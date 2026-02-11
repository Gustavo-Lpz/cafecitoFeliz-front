import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSales } from './admin-sales';

describe('AdminSales', () => {
  let component: AdminSales;
  let fixture: ComponentFixture<AdminSales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
