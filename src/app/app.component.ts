import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isFeatureEnabled: boolean = true; // Or whatever logic you have to set this
  userLoggedIn: boolean = false;
  showIngredientsList: boolean = false;
  recipeTemplate: boolean = false;
  searchRecipes: boolean = false;


  handleToggleRecipeTemplate(event: boolean) {
    // Handle the toggle event
  }

  handleToggleSearchRecipe(event: boolean) {
    // Handle the toggle event
  }
  onLoginSuccess() {
    this.userLoggedIn = true;
    this.showIngredientsList = true;
  }

}
