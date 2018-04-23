import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideManagementComponent } from './slide-management.component';

describe('SlideManagementComponent', () => {
    let component: SlideManagementComponent;
    let fixture: ComponentFixture<SlideManagementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlideManagementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlideManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
