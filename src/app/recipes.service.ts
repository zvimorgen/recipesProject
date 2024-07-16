import {Injectable} from '@angular/core';
import {initializeApp, FirebaseApp} from 'firebase/app';
import {
    collection, getFirestore, onSnapshot, addDoc,
    QuerySnapshot, DocumentData, setDoc, doc,
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


export interface Recipe {
    id?: string;
    title: string;
    url: string;
    ingredients: string[];
    image: string;
    category: string;
}

@Injectable({
    providedIn: 'root'
})
export class RecipesService {
    private recipes: Recipe[] = [];
// @ts-ignore
    private db: FirebaseFirestore;
// @ts-ignore
    private auth: ReturnType<typeof getAuth>;
    private user: any = null;
// @ts-ignore
    private firebaseApp: FirebaseApp;


    private toLoad: Recipe[] =  [
        {
            "title": "Chocolate chip cookies recipe",
            "image": "https://img.taste.com.au/Zm-PXYI2/w720-h480-cfill-q80/taste/2010/01/chocolate-chip-cookies-cropped-199866-1.jpg",
            "ingredients": [
                "milk",
                "beef",
                "cola",
                "sugar",
                "butter",
                "vanilla",
                "egg",
                "white sugar",
                "brown sugar",
                "chocolate",
                "flour",
                "sage",
                "rye",
                "chocolate chip",
                "vanilla extract"
            ],
            "url": "https://www.taste.com.au/recipes/chocolate-chip-cookies-2/1bfaa0e6-13b4-489d-bbd8-1cc5caf1fa32",
            "category": "cookies"
        }];





    constructor() {
        this.connectDataBase().then(() => {
            console.log("Firebase connected for RecipesService");
        });
    }

    async connectDataBase(): Promise<void> {
        if (!this.firebaseApp) {
            const firebaseConfig = {
                apiKey: "AIzaSyBDZ_PV71qFugJJ5ZUlgKPRUPua0b4p3kI",
                authDomain: "recipes-2d831.firebaseapp.com",
                projectId: "recipes-2d831",
                storageBucket: "recipes-2d831.appspot.com",
                messagingSenderId: "621784550989",
                appId: "1:621784550989:web:316f40cc9737709510d604"
            };

            this.firebaseApp = initializeApp(firebaseConfig, "recipesApp");
        }

        this.db = getFirestore(this.firebaseApp);
        this.auth = getAuth(this.firebaseApp);
    }

    async addRecipes(){
        this.toLoad.forEach(recipe => {this.addRecipe(recipe)})
    }

    async getRecipes(): Promise<Recipe[]> {
        return new Promise<Recipe[]>((resolve, reject) => {
            const colRef = collection(this.db, 'Recipes');

            // Listen to real-time updates on the collection
            onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
                this.recipes = [];
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    console.log(data)
                    if (data && typeof data === 'object') {
                        this.recipes.push({
                            id: doc.id,
                            title: data['title'] || '',
                            url: data['url'] || '',
                            ingredients: data['ingredients'] || [],
                            image: data['image'] || [],
                            category: data['category'] || [],
                        });
                    } else {
                        console.error('Invalid or missing data in document:', doc.id);
                    }
                });

                // Resolve the promise with the recipes array
                console.log(this.recipes)
                resolve(this.recipes);
            });
        });
    }
    async addRecipe(recipe: Recipe) {
        try {
            // Collection reference
            const recipesRef = collection(this.db, 'Recipes');

            // Add a new document with a generated id
            const docRef = await addDoc(recipesRef, {
                title: recipe.title,
                url: recipe.url,
                ingredients: recipe.ingredients,
                image: recipe.image,
                category: recipe.category || '' // אופציונלי, אם אין קטגוריה יוכל להיות ריק
            });

            console.log('Recipe added with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding recipe: ', e);
        }
    }
}
