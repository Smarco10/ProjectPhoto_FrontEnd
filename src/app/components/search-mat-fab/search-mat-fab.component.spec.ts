import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMatFabComponent } from './search-mat-fab.component';

describe('SearchMatFabComponent', () => {
  let component: SearchMatFabComponent;
  let fixture: ComponentFixture<SearchMatFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMatFabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMatFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
