import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCompaignAnalyticsComponent } from './google-compaign-analytics.component';

describe('GoogleCompaignAnalyticsComponent', () => {
  let component: GoogleCompaignAnalyticsComponent;
  let fixture: ComponentFixture<GoogleCompaignAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleCompaignAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleCompaignAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
