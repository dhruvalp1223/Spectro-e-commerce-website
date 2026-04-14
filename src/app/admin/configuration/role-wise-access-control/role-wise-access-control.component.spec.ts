import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseAccessControlComponent } from './role-wise-access-control.component';

describe('RoleWiseAccessControlComponent', () => {
  let component: RoleWiseAccessControlComponent;
  let fixture: ComponentFixture<RoleWiseAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleWiseAccessControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleWiseAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
