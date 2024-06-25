import {Component, EventEmitter, Output, Input} from '@angular/core';
import {ProductsService} from '../products.service'

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

    constructor(private productService: ProductsService) {
    }

    @Input() isFeatureEnabled: boolean = false;
    // @Output() toggleRecipeTemplate: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() toggleRecipeTemplate: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() toggleSearchRecipe: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() logOutButton: EventEmitter<any> = new EventEmitter<any>();

    recipeTemplate: boolean = false;
    searchRecipes: boolean = false;
    searchRecipeText: string = "Custom recipe search";
    recipesText: string = "List of recipes"

    onRecipesButtonClick() {

        if (!this.searchRecipes) {
            if (this.recipesText === "List of recipes") {
                this.recipesText = "main page";
            } else {
                this.recipesText = "List of recipes";
            }

            this.recipeTemplate = !this.recipeTemplate;
            this.searchRecipeText = "Custom recipe search";
            this.toggleRecipeTemplate.emit(this.recipeTemplate);
        }
    }

    onSearchButtonClick() {

        if (!this.recipeTemplate) {
            if (this.searchRecipeText === "Custom recipe search") {
                this.searchRecipeText = "Ingredient list";
            } else {
                this.searchRecipeText = "Custom recipe search";
            }

            this.searchRecipes = !this.searchRecipes;
            this.recipesText = "List of recipes";
            this.toggleSearchRecipe.emit(this.searchRecipes);
        }
    }

    async logOut(): Promise<void> {
        await this.productService.logOut();
        console.log("logout clicked");
        this.logOutButton.emit();
    }
}
