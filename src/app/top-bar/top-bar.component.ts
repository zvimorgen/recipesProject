import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  @Input() isFeatureEnabled: boolean = false;
  @Output() toggleRecipeTemplate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleSearchRecipe: EventEmitter<boolean> = new EventEmitter<boolean>();

  recipeTemplate: boolean = false;
  searchRecipes: boolean = false;
  searchRecipeText: string = "Custom recipe search";
  recipesText: string = "List of recipes"

  onRecipesButtonClick() {

if(this.recipesText === "List of recipes"){
  this.recipesText = "main page";
}else{
  this.recipesText = "List of recipes";
}
      this.recipeTemplate = !this.recipeTemplate;
      this.toggleRecipeTemplate.emit();

  }

  onSearchButtonClick() {

      this.searchRecipes = !this.searchRecipes;
      this.toggleSearchRecipe.emit();

      if (this.searchRecipeText === "Custom recipe search") {
        this.searchRecipeText = "Ingredient list";
      } else {
        this.searchRecipeText = "Custom recipe search";
      }
    }
}
