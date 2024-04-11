import {Component, OnInit} from '@angular/core';
import {Products, products} from '../products';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../cart.service";
import {ProductsService, Product} from "../products.service";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private cartService: CartService,
        private productService: ProductsService,
    ) {
    }

    showSearchForm: boolean = true;
    products: Products[] | undefined = products;
    product: Products | undefined;
    ingredients: Product[] | undefined = [];
    ingredient: string = '';
    id: string = '';

    share() {
        window.alert('The product has been shared!');
    }

    onNotify() {
        window.alert('You will be notified when the product goes on sale');
    }

    async ngOnInit() {
        // Get the product id
        const routeParams = this.route.snapshot.paramMap;
        const productIdFromRoute = Number(routeParams.get('productId'));

        // Fetch products
        await this.getIngredients();

        console.table(this.ingredients);


        // Find the product clicked
        // @ts-ignore
        this.ingredients = this.ingredients.find(product => product.id === productIdFromRoute);

        // Event listener for form submission
        const addIngredientForm = document.querySelector('.add') as HTMLFormElement;
        addIngredientForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // FormData
            const formData = new FormData(addIngredientForm);
            this.ingredient = formData.get('ingredient') as string;

            try {
                await this.productService.addIngredient(this.ingredient)
                    .then(() => {
                        console.log('Ingredient added successfully!');
                        addIngredientForm.reset()
                    });
            } catch (error) {
                console.error('Error adding ingredient: ', error);
            }

        });

        const deleteIngredientForm = document.querySelector('.delete') as HTMLFormElement;
        deleteIngredientForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(deleteIngredientForm);

             this.id = formData.get('id') as string;

            await this.productService.deleteIngredient(this.id)
                .then( () =>
                    console.log('Ingredient deleted successfully!'))
                    deleteIngredientForm.reset();
         });

        // const searchForm = document.querySelector('.search') as HTMLFormElement;
        // searchForm.addEventListener('submit', async (e) => {
        //     e.preventDefault();
        //
        //     // Get the value to search for
        //     const formData = new FormData(searchForm);
        //     const toSearch = formData.get('search') as string;
        //     const searchButton = document.querySelector('.search-button') as HTMLFormElement;
        //
        //     // Check if the search term exists
        //     if (toSearch) {
        //         // Perform the query
        //         const q = query(colRef, where("title", "==", toSearch));
        //
        //         const querySnapshot = await getDocs(q);
        //         querySnapshot.forEach((doc) => {
        //             console.log(doc.id, " => ", doc.data());
        //             this.ingredients = []
        //             // @ts-ignore
        //             this.ingredients.push({...doc.data(), id: doc.id})
        //             searchButton.textContent = "clear search"
        //
        //         });
        //     } else {
        //
        //         onSnapshot(colRef, (snapshot) => {
        //             this.ingredients = []
        //             snapshot.docs.forEach((doc) => {
        //                 // @ts-ignore
        //                 this.ingredients.push({...doc.data(), id: doc.id})
        //             })
        //             // console.log(this.ingredients)
        //             searchButton.textContent = "search"
        //         })
        //     }
        //     searchForm.reset()
        // });

    }
    async getIngredients() {
        this.ingredients = await this.productService.getProducts();

    }

    addToList(product: Products) {
        // this.cartService.addToCart(product);
        window.alert("Your product has been added to the cart");
    }

    toggleSearchForm() {
        this.showSearchForm = !this.showSearchForm;
        const hiddenButton = document.querySelector('.hiddenButton') as HTMLFormElement;
        if(hiddenButton.textContent == "Add or remove ingredients"){
            hiddenButton.textContent = "Show Ingredient List"
        }else{
            hiddenButton.textContent = "Add or remove ingredients"
        }
    }
}
