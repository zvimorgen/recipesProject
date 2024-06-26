import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from "./cart/cart.component";
import { LogInComponent } from "./log-in/log-in.component";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon'; // ייבוא ספריית הסמלים של Angular Material
import { MatButtonModule } from '@angular/material/button'; // ייבוא ספריית כפתורים של Angular Material
// import { RecipesListComponent } from "./recipes-list/recipes-list.component";
// import { SearchRecipesComponent } from "./search-recipes/search-recipes.component";
// import {NgOptimizedImage} from "@angular/common";
// import { NguCarouselModule } from '@ngu/carousel';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        NguCarouselModule,

        RouterModule.forRoot([
            {path: '**', redirectTo: '', pathMatch: 'full'}
            // { path: '', component: ProductListComponent },
            // { path: 'products', component: ProductListComponent },
            // { path: 'products/:productId', component: ProductDetailsComponent },
            // { path: 'recipes', component: RecipesListComponent },
            // { path: 'log-in', component: LogInComponent },
            // { path: '', redirectTo: '/login', pathMatch: 'full' }, // ניתוב ברירת מחדל לדף ההתחברות
            // { path: '**', redirectTo: '', pathMatch: 'full' }
        ]),
        FormsModule,
        NgOptimizedImage,
    ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CartComponent,
    RecipesListComponent,
    LogInComponent,
    SearchRecipesComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }





// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';
// import {HttpClientModule} from '@angular/common/http'
//
// import { AppComponent } from './app.component';
// import { TopBarComponent } from './top-bar/top-bar.component';
// import { ProductListComponent } from './product-list/product-list.component';
// import { ProductAlertsComponent } from './product-alerts/product-alerts.component';
// import { ProductDetailsComponent } from './product-details/product-details.component';
// import {CartComponent} from "./cart/cart.component";
// import {ShippingComponent} from "./shipping/shipping.component";
//
// @NgModule({
//   imports: [
//     BrowserModule,
//     HttpClientModule,
//     ReactiveFormsModule,
//     RouterModule.forRoot([
//       {path: '', component: ProductListComponent},
//       {path: 'products/:productId', component: ProductDetailsComponent},
//       {path: 'cart', component: CartComponent},
//       {path: 'shipping', component: ShippingComponent},
//     ]),
//   ],
//   declarations: [
//     AppComponent,
//     TopBarComponent,
//     ProductListComponent,
//     ProductAlertsComponent,
//     ProductDetailsComponent,
//     CartComponent,
//     ShippingComponent,
//   ],
//   bootstrap: [AppComponent],
//   // exports: [
//   //   TopBarComponent
//   // ]
// })
// export class AppModule {}
