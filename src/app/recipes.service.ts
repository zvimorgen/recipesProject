import {Injectable} from '@angular/core';
import {initializeApp, FirebaseApp} from 'firebase/app';
import {
    collection, getFirestore, onSnapshot, QuerySnapshot, DocumentData, setDoc, doc,
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {Product} from "./products.service";

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

}


// import { Injectable } from '@angular/core';
// import { initializeApp } from 'firebase/app';
// import {
//     collection, getFirestore, onSnapshot, QuerySnapshot, DocumentData, getAuth
// } from 'firebase/firestore';
//
// export interface Recipe {
//     id?: string;
//     title: string;
//     url: string;
//     ingredients: string[];
// }
//
// @Injectable({
//     providedIn: 'root'
// })
// export class RecipesService {
//
//     private recipes: Recipe[] = [];
//     private db: ReturnType<typeof getFirestore>;
//     private auth: ReturnType<typeof getAuth>;
//     private user: any = null;
//
//     constructor() {
//         this.connectDataBase().then(() =>
//             console.log("connected"));
//     }
//
//     async connectDataBase(): Promise<void> {
//         // Initialize Firebase app
//         const firebaseConfig = {
//             apiKey: "AIzaSyBDZ_PV71qFugJJ5ZUlgKPRUPua0b4p3kI",
//             authDomain: "recipes-2d831.firebaseapp.com",
//             projectId: "recipes-2d831",
//             storageBucket: "recipes-2d831.appspot.com",
//             messagingSenderId: "621784550989",
//             appId: "1:621784550989:web:316f40cc9737709510d604"
//         };
//
//         initializeApp(firebaseConfig);
//
//         this.db = getFirestore();
//         this.auth = getAuth();
//     }
//
//     async getProducts(): Promise<Recipe[]> {
//         return new Promise<Recipe[]>((resolve, reject) => {
//             const colRef = collection(this.db, 'Recipes');
//
//             // Listen to real-time updates on the collection
//             onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
//                 this.recipes = [];
//                 snapshot.docs.forEach((doc) => {
//                     const data = doc.data();
//                     if (data && typeof data === 'object') {
//                         // Ensure that the data contains the necessary fields
//                         const recipe: Recipe = {
//                             id: doc.id,
//                             title: data['title'],
//                             url: data['url'],
//                             ingredients: data['ingredients']
//                         };
//                         this.recipes.push(recipe);
//                     } else {
//                         console.error('Invalid or missing data in document:', doc.id);
//                     }
//                 });
//                 // Resolve the promise with the recipes array
//                 resolve(this.recipes);
//             });
//         });
//     }
// }
//
