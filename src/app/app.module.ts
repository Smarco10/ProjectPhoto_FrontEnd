import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule } from '@angular/material';

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
    SlidesManagerComponent
} from '@app/components';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from '@app/guards';

import {
    SlideService,
    AuthService,
    FeathersService
} from '@app/services';

@NgModule({
    declarations: [
        AppComponent,
        SlideshowComponent,
        SlideComponent,
        SlideManagementComponent,
        LoginComponent,
        UploadsComponent,
        SlidesManagerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        NgxCarouselModule,
        MarkdownModule
    ],
    providers: [
        SlideshowComponent,
        AppComponent,
        AuthGuard,
        AuthService,
        SlideService,
        FeathersService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }