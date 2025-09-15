import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMetaComponent } from './dashboard-meta.component';

describe('DashboardMetaComponent', () => {
  let component: DashboardMetaComponent;
  let fixture: ComponentFixture<DashboardMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMetaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
