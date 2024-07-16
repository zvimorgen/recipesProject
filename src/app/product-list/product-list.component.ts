import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
    selectedIngredients: Product[] = [];
    // showButton: boolean = false;
    // userList: boolean = false;
    ingredients: Product[] = [];
    ingredient: string = '';
    id: string = '';
    searchButtonText: string = "search";
    showListText: string = "Your Ingredient List";
    AddOrRemoveIngredients: string = "Add or remove ingredients";
    userIngredients: Product[] = [];
    dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
    @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() userListTemplate: EventEmitter<boolean> = new EventEmitter<boolean>();


    async ngOnInit() {
        await this.getIngredients();
        await this.getUserIngredients();
        await this.resetButtons();
    }


    async resetButtons(){
        this. searchButtonText = "search";
        this.showListText = "Your Ingredient List";
        this.AddOrRemoveIngredients = "Add or remove ingredients";
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
        // this.isLoading.emit(true);
        await this.productService.addIngredientsToUser(ingredient);
        console.log(ingredient)
        // this.isLoading.emit(false);
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
    async addItems(){
       await this.productService.updateTheDataBase();
    }

    async showUserList() {

        this.userListTemplate.emit(true);
    }

    async onSearchIngredient(form: NgForm) {
        const searchTerm = form.value.search;
        if (  this.searchButtonText === "search") {
            this.ingredients = await this.productService.searchIngredient(searchTerm);
            this.dataSource.data = await this.productService.searchIngredient(searchTerm);
            this.searchButtonText = "clear search";
        } else {
            await this.getIngredients();
            this.searchButtonText = "search";
            this.dataSource.data = this.ingredients;
            form.resetForm();
        }
    }

    toggleSelection(ingredient: any) {
        const index = this.selectedIngredients.indexOf(ingredient);
        if (index === -1) {
            this.selectedIngredients.push(ingredient);
        } else {
            this.selectedIngredients.splice(index, 1);
        }
    }


    async getUserIngredients() {
        this.userIngredients = await this.productService.getUserData();
    }

    isInUserList(ingredient: Product): boolean {
        return this.userIngredients.some(userIngredient => userIngredient.id === ingredient.id);
    }

}