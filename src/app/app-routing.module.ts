import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'guards';

import {
    AlbumEditionComponent,
    AlbumsComponent,
    GalleryComponent,
    LoginComponent,
    SlideComponent,
    SlideshowComponent,
    SlidesManagerComponent,
    SlideEditionComponent,
    UsersManagerComponent
} from 'components';

const routes: Routes = [
    { path: '', redirectTo: '/albums', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'slide',
        children: [
            { path: '', redirectTo: '/', pathMatch: 'full' },
            { path: 'view', component: SlideComponent },
            { path: 'manage', component: SlidesManagerComponent, canActivate: [AuthGuard] },
            { path: 'create', component: SlideEditionComponent, canActivate: [AuthGuard] }
        ]
    },
    {
        path: 'album',
        children: [
            { path: '', redirectTo: '/', pathMatch: 'full' },
            { path: 'edit', component: AlbumEditionComponent, canActivate: [AuthGuard] }
        ]
    },
    { path: 'albums', component: AlbumsComponent },
    { path: 'slideshow', component: SlideshowComponent },
    { path: 'users', component: UsersManagerComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(routes, { useHash: true })
    ]
})
export class AppRoutingModule { }
