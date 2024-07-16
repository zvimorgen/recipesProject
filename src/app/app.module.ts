import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {ProductListComponent} from './product-list/product-list.component';
import {LogInComponent} from "./log-in/log-in.component";
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon'; // ייבוא ספריית הסמלים של Angular Material
import {MatButtonModule} from '@angular/material/button'; // ייבוא ספריית כפתורים של Angular Material
import {RecipesListComponent} from "./recipes-list/recipes-list.component";
import {SearchRecipesComponent} from "./search-recipes/search-recipes.component";
import {NgOptimizedImage} from "@angular/common";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {UserListComponent} from "./user-list/user-list.component";
import {RecipeDetailsComponent} from "./recipe-details/recipe-details.component";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        FontAwesomeModule,

        RouterModule.forRoot([
            {path: '**', redirectTo: '', pathMatch: 'full'}
        ]),
        FormsModule,
        NgOptimizedImage,
        SlickCarouselModule,
    ],
    declarations: [
        AppComponent,
        TopBarComponent,
        ProductListComponent,
        RecipeDetailsComponent,
        RecipesListComponent,
        LogInComponent,
        SearchRecipesComponent,
        UserListComponent
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}

