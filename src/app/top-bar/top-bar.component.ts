import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {ProductsService} from '../products.service'

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit{

    constructor(private productService: ProductsService) {
    }

    @Input() isFeatureEnabled: boolean = false;
    @Output() toggleRecipeTemplate: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() toggleSearchRecipe: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() logOutButton: EventEmitter<any> = new EventEmitter<any>();

    recipeTemplate: boolean = false;
    searchRecipes: boolean = false;
    searchRecipeText: string = "Custom recipe search";
    recipesText: string = "List of recipes"
    recipesSearch: boolean = true;
    recipesList: boolean = true;

    async ngOnInit() {
        await this.resetButtons();
    }

    async resetButtons(){
        this.searchRecipeText = "Custom recipe search";
        this.recipesText = "List of recipes"
        this.recipesSearch = true;
        this.recipesList = true;
    }
    onRecipesButtonClick() {

        if (!this.searchRecipes) {
            if (this.recipesText === "List of recipes") {
                this.recipesText = "main page";
                this.recipesSearch = false;
            } else {
                this.recipesText = "List of recipes";
                this.recipesSearch = true;
            }

            this.recipeTemplate = !this.recipeTemplate;
            this.searchRecipeText = "Custom recipe search";

            this.toggleRecipeTemplate.emit(this.recipeTemplate);
        }
    }

    onSearchButtonClick() {

        if (!this.recipeTemplate) {
            if (this.searchRecipeText === "Custom recipe search") {
                this.searchRecipeText = "main page";
                this.recipesList = false;
            } else {
                this.searchRecipeText = "Custom recipe search";
                this.recipesList = true;

            }

            this.searchRecipes = !this.searchRecipes;
            this.recipesText = "List of recipes";
            this.toggleSearchRecipe.emit(this.searchRecipes);
        }
    }

    async logOut(): Promise<void> {
        try {
            await this.productService.logOut();
            await this.resetButtons();
            console.log("logout clicked");
            this.logOutButton.emit();
        } catch (error) {
            console.error("Error during logout: ", error);
        }
    }
}
