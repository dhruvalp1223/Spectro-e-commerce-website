import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAccountsComponent } from './email-accounts.component';

describe('EmailAccountsComponent', () => {
  let component: EmailAccountsComponent;
  let fixture: ComponentFixture<EmailAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
