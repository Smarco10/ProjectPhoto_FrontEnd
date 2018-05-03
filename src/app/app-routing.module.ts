import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'guards';

import {
    SlideshowComponent,
    SlideComponent,
    LoginComponent,
    SlidesManagerComponent,
    UsersManagerComponent,
    UploadsComponent
} from 'components';

const routes: Routes = [
    { path: '', redirectTo: '/slideshow', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'slide',
        children: [
            { path: '', redirectTo: '/slideshow', pathMatch: 'full' },
            { path: 'view', component: SlideComponent },
            { path: 'manage', component: SlidesManagerComponent, canActivate: [AuthGuard] },
            { path: 'create', component: UploadsComponent, canActivate: [AuthGuard] }
        ]
    },
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
