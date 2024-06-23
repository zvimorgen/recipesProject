import {Component, OnInit} from '@angular/core';
import {CartService} from "../cart.service";
import {ProductsService, Product} from "../products.service";
import {NgForm} from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
    constructor(
        // private router: Router,
        // private cartService: CartService,
        private productService: ProductsService,
    ) {
    }

    loggedIn: boolean = false;
    showSearchForm: boolean = true;
    showButton: boolean = false;
    userList: boolean = false;
    ingredients: Product[] = [];
    ingredient: string = '';
    id: string = '';
    searchButtonText: string = "search";
    toAdd: Product[] = [];
    toDelete: Product[] = [];
    showListText: string = "Your Ingredient List";
    AddOrRemoveIngredients: string = "Add or remove ingredients";
    displayedColumns: string[] = ['id']; // Include other columns as needed
    dataSource = new MatTableDataSource<Product>();
    isLoading: boolean = false;


    async ngOnInit() {
        await this.getIngredients();
        // this.dataSource.data = this.ingredients;
        // console.log(this.dataSource)
    }

    async onAddIngredient(form: NgForm) {
        if (form.valid) {
            await this.productService.addIngredient(this.ingredient);
            this.ingredient = '';
            form.resetForm();
            await this.getIngredients();
        }
    }

    async onDeleteIngredient(form: NgForm) {
        if (form.valid) {
            await this.productService.deleteIngredient(this.id);
            this.id = '';
            form.resetForm();
            await this.getIngredients();
        }
    }

    async onSearchIngredient(form: NgForm) {
        const searchTerm = form.value.search;
        if (searchTerm) {
            this.ingredients = await this.productService.searchIngredient(searchTerm);
            this.dataSource.data = this.ingredients;
            this.searchButtonText = "clear search";
        } else {
            await this.getIngredients();
            this.searchButtonText = "search";
        }
        form.resetForm();
    }

    async getIngredients() {
        this.ingredients = await this.productService.getProducts();
        console.log(this.ingredients)
        this.dataSource.data = this.ingredients;
    }

    addToList(ingredient: Product) {

        this.toAdd.push(ingredient);
    }

    async deleteFromUserList(ingredient: Product) {
        this.isLoading = true;
        try {
            await this.productService.deleteFromUserList(ingredient);
            this.ingredients = await this.productService.getUserData();
            this.dataSource.data = this.ingredients;
        } catch (error) {
            console.error('Error deleting ingredient:', error);
        }
        this.isLoading = false;
    }

    onLoginSuccess() {
        this.loggedIn = true;
    }

    toggleSearchForm() {

        if (this.AddOrRemoveIngredients === "Add or remove ingredients") {
            this.AddOrRemoveIngredients = "The main list"
        } else {
            this.AddOrRemoveIngredients = "Add or remove ingredients"
        }
        this.showSearchForm = !this.showSearchForm;

    }

    // async logOut() {
    //     await this.productService.logOut();
    //     console.log("logout clicked");
    //     this.loggedIn = false;
    //     this.showSearchForm = true;
    // }

    async addToDataBase() {
        this.isLoading = true;
        await this.productService.addIngredientsToUser(this.toAdd);
        this.toAdd = [];
        this.isLoading = false;
    }


    async showUserList() {

        this.showButton = !this.showButton;
        if (this.showListText === 'Your Ingredient List') {
            this.showListText = "The main list";
            this.ingredients = await this.productService.getUserData();
            this.dataSource.data = this.ingredients;
            this.userList = true;
            this.displayedColumns = ['id', 'title'];
            console.log(this.ingredients);
        } else {
            this.showListText = 'Your Ingredient List';
            await this.getIngredients();
            this.userList = false;
            this.displayedColumns = ['id'];
        }
    }
}









// import {Component, OnInit} from '@angular/core';
// import {Products, products} from '../products';
// import {ActivatedRoute} from "@angular/router";
// import {CartService} from "../cart.service";
// import {ProductsService, Product} from "../products.service";
//
// @Component({
//     selector: 'app-product-list',
//     templateUrl: './product-list.component.html',
//     styleUrls: ['./product-list.component.css'],
// })
// export class ProductListComponent implements OnInit {
//
//     constructor(
//         private route: ActivatedRoute,
//         private cartService: CartService,
//         private productService: ProductsService,
//     ) {
//     }
//
//     showSearchForm: boolean = true;
//     products: Products[] | undefined = products;
//     product: Products | undefined;
//     ingredients: Product[] | undefined = [];
//     ingredient: string = '';
//     id: string = '';
//
//     share() {
//         window.alert('The product has been shared!');
//     }
//
//     onNotify() {
//         window.alert('You will be notified when the product goes on sale');
//     }
//
//     async ngOnInit() {
//         // Get the product id
//         const routeParams = this.route.snapshot.paramMap;
//         const productIdFromRoute = Number(routeParams.get('productId'));
//
//         // Fetch products
//         await this.getIngredients();
//
//         console.table(this.ingredients);
//
//
//         // Find the product clicked
//         // @ts-ignore
//         this.ingredients = this.ingredients.find(product => product.id === productIdFromRoute);
//
//         // Event listener for form submission
//         const addIngredientForm = document.querySelector('.add') as HTMLFormElement;
//         addIngredientForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//
//             // FormData
//             const formData = new FormData(addIngredientForm);
//             this.ingredient = formData.get('ingredient') as string;
//
//             try {
//                 await this.productService.addIngredient(this.ingredient)
//                     .then(() => {
//                         console.log('Ingredient added successfully!');
//                         addIngredientForm.reset()
//                     });
//             } catch (error) {
//                 console.error('Error adding ingredient: ', error);
//             }
//
//         });
//
//         const deleteIngredientForm = document.querySelector('.delete') as HTMLFormElement;
//         deleteIngredientForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//
//             const formData = new FormData(deleteIngredientForm);
//
//              this.id = formData.get('id') as string;
//
//             await this.productService.deleteIngredient(this.id)
//                 .then( () =>
//                     console.log('Ingredient deleted successfully!'))
//                     deleteIngredientForm.reset();
//          });
//
//         // const searchForm = document.querySelector('.search') as HTMLFormElement;
//         // searchForm.addEventListener('submit', async (e) => {
//         //     e.preventDefault();
//         //
//         //     // Get the value to search for
//         //     const formData = new FormData(searchForm);
//         //     const toSearch = formData.get('search') as string;
//         //     const searchButton = document.querySelector('.search-button') as HTMLFormElement;
//         //
//         //     // Check if the search term exists
//         //     if (toSearch) {
//         //         // Perform the query
//         //         const q = query(colRef, where("title", "==", toSearch));
//         //
//         //         const querySnapshot = await getDocs(q);
//         //         querySnapshot.forEach((doc) => {
//         //             console.log(doc.id, " => ", doc.data());
//         //             this.ingredients = []
//         //             // @ts-ignore
//         //             this.ingredients.push({...doc.data(), id: doc.id})
//         //             searchButton.textContent = "clear search"
//         //
//         //         });
//         //     } else {
//         //
//         //         onSnapshot(colRef, (snapshot) => {
//         //             this.ingredients = []
//         //             snapshot.docs.forEach((doc) => {
//         //                 // @ts-ignore
//         //                 this.ingredients.push({...doc.data(), id: doc.id})
//         //             })
//         //             // console.log(this.ingredients)
//         //             searchButton.textContent = "search"
//         //         })
//         //     }
//         //     searchForm.reset()
//         // });
//
//     }
//     async getIngredients() {
//         this.ingredients = await this.productService.getProducts();
//
//     }
//
//     addToList(product: Products) {
//         // this.cartService.addToCart(product);
//         window.alert("Your product has been added to the cart");
//     }
//
//     toggleSearchForm() {
//         this.showSearchForm = !this.showSearchForm;
//         const hiddenButton = document.querySelector('.hiddenButton') as HTMLFormElement;
//         if(hiddenButton.textContent == "Add or remove ingredients"){
//             hiddenButton.textContent = "Show Ingredient List"
//         }else{
//             hiddenButton.textContent = "Add or remove ingredients"
//         }
//     }
// }
