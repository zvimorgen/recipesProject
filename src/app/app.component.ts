import {Component} from '@angular/core';
import {faHourglassEmpty} from '@fortawesome/free-solid-svg-icons';
import {Recipe} from "./recipes.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    isFeatureEnabled: boolean = false;
    userLoggedIn: boolean = false;
    showIngredientsList: boolean = false;
    recipeTemplate: boolean = false;
    searchRecipes: boolean = false;
    isLoading: boolean = false;
    userListTemplate: boolean = false;
    showRecipe: boolean = false;
    previousTemplate = false;
    showExpendedRecipe: boolean = false;
    selectedRecipe: Recipe[] = [];


    handleToggleRecipeTemplate(event: boolean): void {

        this.recipeTemplate = !this.recipeTemplate;
        this.showIngredientsList = !this.recipeTemplate;
        this.searchRecipes = false;
        this.userListTemplate = false;
        // this.showRecipe = false;
        this.showExpendedRecipe = false;

    }

    handleToggleSearchRecipe(event: boolean): void {

        this.searchRecipes = !this.searchRecipes;
        this.showIngredientsList = !this.searchRecipes;
        this.recipeTemplate = false;
        this.userListTemplate = false;
        // this.showRecipe = false;
        this.showExpendedRecipe = false;

    }

    onLoginSuccess(event: boolean): void {
        this.isFeatureEnabled = event;
        this.userLoggedIn = event;
        this.showIngredientsList = event;
    }

    exitUser(): void {
        this.isFeatureEnabled = false;
        this.userLoggedIn = false;
        this.showIngredientsList = false;
        this.showExpendedRecipe = false;
        this.recipeTemplate = false
        this.searchRecipes = false;
        this.userListTemplate = false;
    }

    onLoading(event: boolean) {

        this.isLoading = event;
    }

    userList(event: boolean) {

        this.userListTemplate = event;
        this.showIngredientsList = !event;
    }

    onRecipeSelected(recipe: any) {
        this.selectedRecipe = recipe;
        this.showExpendedRecipe = true;
        if (this.recipeTemplate) {
            this.recipeTemplate = false;
            this.previousTemplate = true;
        } else {
            this.searchRecipes = false;
        }
    }

    showRecipeDetails(event: boolean) {

        this.showExpendedRecipe = event;
        if (this.previousTemplate) {
            this.recipeTemplate = true;
            this.previousTemplate = false;
        } else {
            this.searchRecipes = true;
        }
    }
}
