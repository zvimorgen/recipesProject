import { Component } from '@angular/core';
import { faHourglassEmpty } from '@fortawesome/free-solid-svg-icons';

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
  faHourglassEmpty = faHourglassEmpty;


  handleToggleRecipeTemplate(event: boolean):void {

    this.recipeTemplate = !this.recipeTemplate;
    this.showIngredientsList = !this.recipeTemplate;
    this.searchRecipes = false;

  }

  handleToggleSearchRecipe(event: boolean):void {

    this.searchRecipes = !this.searchRecipes;
    this.showIngredientsList = !this.searchRecipes;
    this.recipeTemplate = false;

  }
  onLoginSuccess(event: boolean):void {
    this.isFeatureEnabled = event;
    this.userLoggedIn = event;
    this.showIngredientsList = event;
  }

  exitUser(): void {
    this.isFeatureEnabled = false;
    this.userLoggedIn = false;
    this.showIngredientsList = false;
  }
  onLoading(event: boolean){

    this.isLoading = event;
  }

}
