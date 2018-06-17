import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideEditionComponent } from './slide-edition.component';

describe('SlideEditionComponent', () => {
    let component: SlideEditionComponent;
    let fixture: ComponentFixture<SlideEditionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlideEditionComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlideEditionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
