import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsItemsComponent } from './news-items.component';

describe('NewsItemsComponent', () => {
  let component: NewsItemsComponent;
  let fixture: ComponentFixture<NewsItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
