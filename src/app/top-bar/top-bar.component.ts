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

  onRecipesButtonClick() {
    if (this.isFeatureEnabled) {
      this.recipeTemplate = !this.recipeTemplate;
      this.toggleRecipeTemplate.emit(this.recipeTemplate);
    }
  }

  onSearchButtonClick() {
    if (this.isFeatureEnabled) {
      this.searchRecipes = !this.searchRecipes;
      this.toggleSearchRecipe.emit(this.searchRecipes);

      if (this.searchRecipeText === "Custom recipe search") {
        this.searchRecipeText = "Ingredient list";
      } else {
        this.searchRecipeText = "Custom recipe search";
      }
    }
  }
}
