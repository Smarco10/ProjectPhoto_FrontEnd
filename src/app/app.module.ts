import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MAT_LABEL_GLOBAL_OPTIONS,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatRadioModule,
    MatToolbarModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { MarkdownModule } from 'angular2-markdown';

import {
    AlbumComponent,
    AlbumEditionComponent,
    AlbumsComponent,
    AppComponent,
    GalleryComponent,
    LoginComponent,
    SlideEditionComponent,
    SlideComponent,
    SlideManagementComponent,
    SlideshowComponent,
    SlidesManagerComponent,
    UserManagementComponent,
    UsersManagerComponent
} from '@app/components';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from '@app/guards';

import {
    AlbumsService,
    AuthService,
    ConfigurationService,
    FeathersService,
    FilesService,
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
        SlideEditionComponent,
        SlidesManagerComponent,
        StayFullSizeDirective,
        UserManagementComponent,
        UsersManagerComponent,
        AlbumComponent,
        AlbumEditionComponent,
        AlbumsComponent,
        GalleryComponent
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
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatRadioModule,
        MatToolbarModule,
        NgxCarouselModule,
        MarkdownModule
    ],
    providers: [
        AlbumsService,
        AppComponent,
        AuthGuard,
        AuthService,
        ConfigurationService,
        FeathersService,
        FilesService,
        SlideService,
        SlideshowComponent,
        { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
