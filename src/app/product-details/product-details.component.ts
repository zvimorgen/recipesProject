// import { Component, Output, EventEmitter, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// // import {Product, products} from '../products';
// import {ProductsService, Product} from '../products.service'
// import {CartService} from'../cart.service'
//
// @Component({
//   selector: 'app-product-details',
//   templateUrl: './product-details.component.html',
//   styleUrl: './product-details.component.css',
// })
// export class ProductDetailsComponent implements OnInit{
//
//     constructor(
//         private route: ActivatedRoute,
//         private cartService: CartService,
//         private productsService: ProductsService,
//     ) {}
//
//     @Output() productClick: EventEmitter<void> = new EventEmitter<void>();
//     ingredients: Product[] = [];
//     ingredient: Product | undefined;
//     // ingredients: any[] = [];
//   // product: productService.getProducts | undefined;
//
//
//   ngOnInit() {
//      //get the product id
//      const routeParams = this.route.snapshot.paramMap;
//      const productIdFromRoute = Number(routeParams.get('productId'));
//       this.ingredients = this.productsService.getProducts();
//
//
//       // Get the list of products from the service
//       this.ingredients = this.productsService.getProducts();
//
//
//       // Find the product that matches the productIdFromRoute
//       this.ingredient = this.ingredients.find(ingredient => ingredient.id === productIdFromRoute);
//    }
//
//     addToCart(product: Product){
//        this.cartService.addToCart(product);
//        window.alert("Your product has been added to the cart");
//    }
//
//     // protected readonly products = products;
// }

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import {Product} from '../products';
import {ProductsService, Product} from '../products.service'
import {CartService} from'../cart.service'

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit{

    constructor(
        private route: ActivatedRoute,
        private cartService: CartService,
        private productsService: ProductsService,
    ) {}

    @Output() productClick: EventEmitter<void> = new EventEmitter<void>();
    products: Product[] = [];
    // product: Product | undefined;
    // ingredients: any[] = [];
    product: Product[] | undefined;


    async ngOnInit() {
        //get the product id
        const routeParams = this.route.snapshot.paramMap;
        const productIdFromRoute = Number(routeParams.get('productId'));
        this.product = await this.productsService.getProducts();

        //find the product how clicked
        // @ts-ignore
        this.product = this.product = this.product.find((product: Product) => product.id === productIdFromRoute);

    }

        addToCart(product: Product){
        this.cartService.addToCart(product);
        window.alert("Your product has been added to the cart");
    }

}

