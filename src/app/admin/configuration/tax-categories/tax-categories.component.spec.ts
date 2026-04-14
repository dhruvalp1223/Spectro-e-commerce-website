import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCategoriesComponent } from './tax-categories.component';

describe('TaxCategoriesComponent', () => {
  let component: TaxCategoriesComponent;
  let fixture: ComponentFixture<TaxCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
