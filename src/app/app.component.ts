import { Component } from '@angular/core';

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


  handleToggleRecipeTemplate() {
    this.showIngredientsList =  !this.showIngredientsList;
    this.recipeTemplate = !this.recipeTemplate;

  }

  handleToggleSearchRecipe() {

    this.showIngredientsList =  !this.showIngredientsList;
    this.searchRecipes = !this.searchRecipes;
  }
  onLoginSuccess(event: boolean):void {
    this.isFeatureEnabled = event;
    this.userLoggedIn = event;
    this.showIngredientsList = event;
  }

  onLogOut(): void {
    this.isFeatureEnabled = false;
    this.userLoggedIn = false;
    this.showIngredientsList = false;
  }

}
