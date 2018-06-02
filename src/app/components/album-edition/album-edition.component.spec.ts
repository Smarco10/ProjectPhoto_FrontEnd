import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumEditionComponent } from './album-edition.component';

describe('AlbumEditionComponent', () => {
  let component: AlbumEditionComponent;
  let fixture: ComponentFixture<AlbumEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
