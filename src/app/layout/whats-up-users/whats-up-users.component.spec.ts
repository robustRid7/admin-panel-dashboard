import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsUpUsersComponent } from './whats-up-users.component';

describe('WhatsUpUsersComponent', () => {
  let component: WhatsUpUsersComponent;
  let fixture: ComponentFixture<WhatsUpUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsUpUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsUpUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
