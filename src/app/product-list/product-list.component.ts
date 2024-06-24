import {Component, OnInit} from '@angular/core';
import {ProductsService, Product} from "../products.service";
import {NgForm} from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
    constructor(private productService: ProductsService) {}

    loggedIn: boolean = false;
    showSearchForm: boolean = true;
    showButton: boolean = false;
    userList: boolean = false;
    ingredients: Product[] = [];
    ingredient: string = '';
    id: string = '';
    searchButtonText: string = "search";
    showListText: string = "Your Ingredient List";
    AddOrRemoveIngredients: string = "Add or remove ingredients";
    displayedColumns: string[] = ['id']; // Include other columns as needed
    dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
    isLoading: boolean = false;


    async ngOnInit() {
        await this.getIngredients();
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

    async getIngredients() {
        this.ingredients = await this.productService.getProducts();
        console.log(this.ingredients)
        this.dataSource.data = this.ingredients;
    }

    async addToDataBase(ingredient: Product) {
        this.isLoading = true;
        await this.productService.addIngredientsToUser(ingredient);
        console.log(ingredient)
        this.isLoading = false;
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

    async onSearchIngredient(form: NgForm) {
        const searchTerm = form.value.search;
        if (searchTerm) {
            this.ingredients = await this.productService.searchIngredient(searchTerm);
            this.dataSource.data = await this.productService.searchIngredient(searchTerm);
            // this.dataSource.data = this.ingredients;
            this.searchButtonText = "clear search";
        } else {
            await this.getIngredients();
            this.searchButtonText = "search";
            this.dataSource.data = this.ingredients;
        }
        form.resetForm();
    }
}