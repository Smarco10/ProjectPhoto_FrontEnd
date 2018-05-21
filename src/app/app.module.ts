import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MAT_LABEL_GLOBAL_OPTIONS,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { MarkdownModule } from 'angular2-markdown';

import {
    AppComponent,
    LoginComponent,
    UploadsComponent,
    SlideshowComponent,
    SlideComponent,
    SlideManagementComponent,
    SlidesManagerComponent,
    UserManagementComponent,
    UsersManagerComponent
} from '@app/components';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from '@app/guards';

import {
    AuthService,
    ConfigurationService,
    FeathersService,
    SlideService
} from '@app/services';
import { StayFullSizeDirective } from '@directives/stay-full-size/stay-full-size.directive';

@NgModule({
    declarations: [
        AppComponent,
        SlideshowComponent,
        SlideComponent,
        SlideManagementComponent,
        LoginComponent,
        UploadsComponent,
        SlidesManagerComponent,
        StayFullSizeDirective,
        UserManagementComponent,
        UsersManagerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatToolbarModule,
        NgxCarouselModule,
        MarkdownModule
    ],
    providers: [
        AppComponent,
        AuthGuard,
        AuthService,
        ConfigurationService,
        FeathersService,
        SlideService,
        SlideshowComponent,
        { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }