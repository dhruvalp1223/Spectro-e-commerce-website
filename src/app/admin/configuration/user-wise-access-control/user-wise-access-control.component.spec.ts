import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseAccessControlComponent } from './user-wise-access-control.component';

describe('UserWiseAccessControlComponent', () => {
  let component: UserWiseAccessControlComponent;
  let fixture: ComponentFixture<UserWiseAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWiseAccessControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWiseAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
