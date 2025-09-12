import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusPageComponent } from './bonus-page.component';

describe('BonusPageComponent', () => {
  let component: BonusPageComponent;
  let fixture: ComponentFixture<BonusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
