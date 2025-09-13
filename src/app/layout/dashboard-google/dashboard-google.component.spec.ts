import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGoogleComponent } from './dashboard-google.component';

describe('DashboardGoogleComponent', () => {
  let component: DashboardGoogleComponent;
  let fixture: ComponentFixture<DashboardGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardGoogleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
