import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';


import {
    collection, getFirestore,
    getDocs, deleteDoc, doc, onSnapshot,
    query, where, QuerySnapshot, DocumentData,
    setDoc, getDoc, updateDoc, arrayRemove
} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,

} from 'firebase/auth'

export interface Product {
    id: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private ingredients: Product[] = [];
    // @ts-ignore
    private db: FirebaseFirestore;
    // @ts-ignore
    private auth: ReturnType<typeof getAuth>;
    private user: any = null;


    constructor() {
        this.connectDataBase().then(r =>
            console.log("connected"));
    }

    async connectDataBase(): Promise<void> {
        // Initialize Firebase app
        const firebaseConfig = {
            apiKey: "AIzaSyANQzR4gnTp4U1QueWDPbcajFsoDco0CPU",
            authDomain: "market-75977.firebaseapp.com",
            projectId: "market-75977",
            storageBucket: "market-75977.appspot.com",
            messagingSenderId: "575415187020",
            appId: "1:575415187020:web:455ef44d30a4767de6e6e9",
            measurementId: "G-559YBQ4G3Q"
        };

        initializeApp(firebaseConfig);

        this.db = getFirestore();
        this.auth = getAuth()
    }

    async getProducts(): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            const colRef = collection(this.db, 'Ingredients');

            onSnapshot(colRef, (snapshot) => {
                this.ingredients = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    if (data && typeof data === 'object') {
                        return { ...data, id: doc.id};
                    }
                    console.error('Invalid or missing data in document:', doc.id);
                    return null;
                }).filter(item => item !== null) as Product[];

                resolve(this.ingredients);
            }, reject);
        });
    }

    // async getProducts(): Promise<Product[]> {
    //     return new Promise<Product[]>((resolve, reject) => {
    //
    //         const colRef = collection(this.db, 'Ingredients');
    //
    //         // Listen to real-time updates on the collection
    //         onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
    //             this.ingredients = [];
    //             snapshot.docs.forEach((doc) => {
    //                 const data = doc.data();
    //                 if (data && typeof data === 'object') {
    //                     this.ingredients.push({...data, id: doc.id, description: doc.description});
    //
    //                 } else {
    //                     console.error('Invalid or missing data in document:', doc.id);
    //                 }
    //             });
    //             // Resolve the promise with the ingredients array
    //             resolve(this.ingredients);
    //         });
    //     });
    // }

    async addIngredient(ingredient: string) {

        if (ingredient === '')
            return;
        if (!await this.isExist(ingredient)) {

            const colRef = collection(this.db, 'Ingredients');
            //set ID
            const customDocRef = doc(colRef, ingredient);
            //Adding data to firestore
            await setDoc(customDocRef, {
                title: ingredient,
            });
            console.log('Ingredient added successfully!');
        } else {
            alert("The product already exists in the list of components")
        }
    }

    async deleteIngredient(id: string) {

        if (id === '')
            return;
        const docRef = doc(this.db, 'Ingredients', id)
        await deleteDoc(docRef)
    }

    async searchIngredient(toSearch: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                const colRef = collection(this.db, 'Ingredients');
                const q = query(colRef, where("title", "==", toSearch));

                console.log(q)
                const querySnapshot = await getDocs(q);
                const ingredients: Product[] = [];

                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    ingredients.push({...doc.data(), id: doc.id} as Product);
                });

                console.log(ingredients);
                resolve(ingredients);
            } catch (error) {
                console.error("Error searching ingredients: ", error);
                reject(error);
            }
        });
    }

    async signUp(email: string, password: string) {

        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            this.user = userCredential.user;

            const userData = {
                email: this.user.email,
                password: password,
                createdAt: new Date(),
            };

            await setDoc(doc(this.db, "users", this.user.uid), userData);
            console.log("User data saved successfully!");
        } catch (error) {
            console.error("Error during registration: ", error);
        }
    }

    async signIn(email: string, password: string): Promise<boolean> {
        try {
            // const cred = await signInWithEmailAndPassword(this.auth, email, password);
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            this.user = userCredential.user;
            console.log("user logged in:", userCredential.user);
            return true;
        } catch (error: any) { // Explicitly cast error to type any
            console.error((error as Error).message); // Cast error to type Error
        }
        return false;
    }


    async logOut() {
        signOut(this.auth)
            .then(() => {
                this.user = ''
                console.log("the user signed out");
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    async addAdditionalSettings(userId: string, ingredients: Product[]) {
        try {
            // עדכון הגדרות נוספות למשתמש במסד הנתונים
            const userData = await this.getUserData();

            // עדכון רשימת toAddList על ידי הסרת האובייקטים הקיימים כבר ב-userData
            userData.forEach(data => {
                const indexToRemove = ingredients.findIndex(item => item.id === data.id);
                if (indexToRemove !== -1) {
                    ingredients.splice(indexToRemove, 1);
                }
            });

            userData.forEach(data => {
                ingredients.push(data);
            })

            // // וידוא ש-ingredients הוא מערך תקין
            // if (!Array.isArray(ingredients) || ingredients.some(item => !item.id)) {
            //     throw new Error('Invalid or missing data in additionalSettings.');
            // }
            // מסירים את האובייקט מהמערך

            await setDoc(doc(this.db, 'users', userId), {ingredients}, {merge: true});
            console.log('Additional settings added successfully!');
        } catch (error) {
            console.error('Error adding additional settings: ', error);
        }
    }

    async addIngredientsToUser(ingredients: Product[]) {
        try {
            await this.addAdditionalSettings(this.user.uid, ingredients);
            console.log('ingredients added successfully for user:', this.user.uid);
        } catch (error) {
            console.error('Error adding ingredients for user:', this.user.uid, error);
        }
    }

    async deleteFromUserList(ingredient: Product) {
        const userId = this.user.uid;
        const userDocRef = doc(this.db, `users/${userId}`);

        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedIngredients = userData['ingredients'].filter((item: Product) => item.id !== ingredient.id);
                await updateDoc(userDocRef, {ingredients: updatedIngredients});
                console.log(`Ingredient with id ${ingredient.id} has been removed.`);
            } else {
                console.log('User document not found.');
            }
        } catch (error) {
            console.error('Error removing ingredient: ', error);
            throw error;
        }
    }

    // async deleteFromUserList(ingredient: Product) {
    //     const userId = this.user.uid;
    //     const userDocRef = doc(this.db, users/${userId});
    //
    //     try {
    //         const userDoc = await getDoc(userDocRef);
    //         if (userDoc.exists()) {
    //             const userData = userDoc.data();
    //             const updatedIngredients = userData['ingredients'].filter((item: Product) => item.id !== ingredient.id);
    //             await updateDoc(userDocRef, {ingredients: updatedIngredients});
    //             console.log(Ingredient with id ${ingredient.id} has been removed.);
    //         } else {
    //             console.log('User document not found.');
    //         }
    //     } catch (error) {
    //         console.error('Error removing ingredient: ', error);
    //     }
    // }

    async isExist(toSearch: string): Promise<boolean> {

        return this.ingredients.some(product => product.id === toSearch);
    }


    async getUserData(): Promise<Product[]> {
        try {
            const userDocRef = doc(this.db, 'users', this.user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                console.log('User data:', userData);

                // Check if additionalSettings exist before accessing ingredients
                if (userData && userData['ingredients']) {
                    const ingredientsData = userData['ingredients'];
                    if (Array.isArray(ingredientsData)) {
                        this.ingredients = ingredientsData.map((ingredient: any) => ({
                            ...ingredient,
                            id: ingredient.id || '', // Ensure each ingredient has an id
                        }));
                        console.log(this.ingredients);
                        return this.ingredients;
                    } else {
                        console.error('Invalid or missing data in additionalSettings:', this.user.uid);
                        throw new Error('Invalid or missing data in additionalSettings.');
                    }
                } else {
                    console.warn('No additionalSettings found for user:', this.user.uid);
                    return [];
                }
            } else {
                console.warn('No document found for user!');
                return []; // Return null when no document is found for the user
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
}






// import { Injectable } from '@angular/core';
// import { initializeApp } from 'firebase/app';
// import { BehaviorSubject } from 'rxjs';
//
// import {
//     collection, getFirestore,
//     getDocs, deleteDoc, doc, onSnapshot,
//     query, where, QuerySnapshot, DocumentData,
//     setDoc, getDoc,
// } from 'firebase/firestore';
// import {
//     getAuth,
//     createUserWithEmailAndPassword,
//     signOut,
//     signInWithEmailAndPassword,
//
// } from 'firebase/auth'
//
// export interface Product {
//     id: string;
// }
//
// @Injectable({
//     providedIn: 'root'
// })
// export class ProductsService {
//     private ingredientsSubject = new BehaviorSubject<Product[]>([]);
//     // @ts-ignore
//     private db: FirebaseFirestore;
//     private auth?: ReturnType<typeof getAuth>;
//     private user: any = null;
//     private ingredients: any;
//
//     constructor() {
//         this.connectDataBase().then(() =>
//             console.log("connected"));
//     }
//
//     async connectDataBase(): Promise<void> {
//         // Initialize Firebase app
//         const firebaseConfig = {
//             apiKey: "AIzaSyANQzR4gnTp4U1QueWDPbcajFsoDco0CPU",
//             authDomain: "market-75977.firebaseapp.com",
//             projectId: "market-75977",
//             storageBucket: "market-75977.appspot.com",
//             messagingSenderId: "575415187020",
//             appId: "1:575415187020:web:455ef44d30a4767de6e6e9",
//             measurementId: "G-559YBQ4G3Q"
//         };
//         initializeApp(firebaseConfig);
//         this.db = getFirestore();
//         this.auth = getAuth()
//     }
//
//     async getProducts(): Promise<Product[]> {
//         return new Promise<Product[]>((resolve, reject) => {
//             const colRef = collection(this.db, 'Ingredients');
//             // Listen to real-time updates on the collection
//             onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
//                 const ingredients: Product[] = [];
//                 snapshot.docs.forEach((doc) => {
//                     const data = doc.data();
//                     if (data && typeof data === 'object') {
//                         ingredients.push({ ...data, id: doc.id });
//                     } else {
//                         console.error('Invalid or missing data in document:', doc.id);
//                     }
//                 });
//                 // Resolve the promise with the ingredients array
//                 console.log(ingredients)
//                 resolve(ingredients);
//             });
//         });
//     }
//
//     async addIngredient(ingredient: string) {
//         if (!ingredient.trim()) {
//             return Promise.reject(new Error('Ingredient name is required'));
//         }
//         if (!(await this.isExist(ingredient))) {
//             const colRef = collection(this.db, 'Ingredients');
//             // Set ID
//             const customDocRef = doc(colRef, ingredient);
//             // Adding data to firestore
//             await setDoc(customDocRef, { title: ingredient });
//             console.log('Ingredient added successfully!');
//         } else {
//             alert("The product already exists in the list of components")
//         }
//     }
//
//     async deleteIngredient(id: string) {
//         if (!id.trim()) {
//             return Promise.reject(new Error('Ingredient ID is required'));
//         }
//         const docRef = doc(this.db, 'Ingredients', id)
//         await deleteDoc(docRef)
//     }
//
//     async searchIngredient(toSearch: string): Promise<Product[]> {
//         try {
//             const colRef = collection(this.db, 'Ingredients');
//             const q = query(colRef, where("name", "array-contains", toSearch));
//             const querySnapshot = await getDocs(q);
//             const ingredients: Product[] = [];
//             querySnapshot.forEach((doc) => {
//                 ingredients.push({ ...doc.data(), id: doc.id } as Product);
//             });
//             return ingredients;
//         } catch (error) {
//             console.error("Error searching ingredients: ", error);
//             throw error;
//         }
//     }
//
//     async signUp(email: string, password: string) {
//         try {
//             // @ts-ignore
//             const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//             this.user = userCredential.user;
//             const userData = {
//                 email: this.user.email,
//                 password: password,
//                 createdAt: new Date(),
//             };
//             await setDoc(doc(this.db, "users", this.user.uid), userData);
//             console.log("User data saved successfully!");
//         } catch (error) {
//             console.error("Error during registration: ", error);
//             throw error;
//         }
//     }
//
//     async signIn(email: string, password: string): Promise<boolean> {
//         try {
//             // @ts-ignore
//             const cred = await signInWithEmailAndPassword(this.auth, email, password);
//             console.log("user logged in:", cred.user);
//             return true;
//         } catch (error) {
//             // @ts-ignore
//             console.error(error.message);
//             return false;
//         }
//     }
//
//     async logOut() {
//         // @ts-ignore
//         signOut(this.auth)
//             .then(() => {
//                 this.user = '';
//                 console.log("the user signed out");
//             })
//             .catch((err) => {
//                 console.log(err.message)
//             })
//     }
//
//     async addAdditionalSettings(userId: string, ingredients: Product[]) {
//         try {
//             const userData = await this.getUserData();
//             userData.forEach(data => {
//                 const indexToRemove = ingredients.findIndex(item => item.id === data.id);
//                 if (indexToRemove !== -1) {
//                     ingredients.splice(indexToRemove, 1);
//                 }
//             });
//             await setDoc(doc(this.db, 'users', userId), { ingredients }, { merge: true });
//             console.log('Additional settings added successfully!');
//         } catch (error) {
//             console.error('Error adding additional settings: ', error);
//             throw error;
//         }
//     }
//
//     async addIngredientsToUser(ingredients: Product[]) {
//         try {
//             await this.addAdditionalSettings(this.user.uid, ingredients);
//             console.log('ingredients added successfully for user:', this.user.uid);
//         } catch (error) {
//             console.error('Error adding ingredients for user:', this.user.uid, error);
//             throw error;
//         }
//     }
//
//     async isExist(toSearch: string): Promise<boolean> {
//         return this.ingredients.some((product: { id: string; }) => product.id === toSearch);
//     }
//
//     async getUserData(): Promise<Product[]> {
//         try {
//             const userDocRef = doc(this.db, 'users', this.user.uid);
//             const userDocSnap = await getDoc(userDocRef);
//             if (userDocSnap.exists()) {
//                 const userData = userDocSnap.data();
//                 if (userData && userData['ingredients']) {
//                     const ingredientsData = userData['ingredients'];
//                     if (Array.isArray(ingredientsData)) {
//                         this.ingredients = ingredientsData.map((ingredient: any) => ({
//                             ...ingredient,
//                             id: ingredient.id || '',
//                         }));
//                         return this.ingredients;
//                     } else {
//                         console.error('Invalid or missing data in additionalSettings:', this.user.uid);
//                         throw new Error('Invalid or missing data in additionalSettings.');
//                     }
//                 } else {
//                     console.warn('No additionalSettings found for user:', this.user.uid);
//                     return [];
//                 }
//             } else {
//                 console.warn('No document found for user!');
//                 return [];
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             throw error;
//         }
//     }
// }






// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
//
// export interface Product {
//     id: string;
//     title: string;
// }
//
// export class ProductsService {
//     private ingredients: Product[] = [];
//     private db: FirebaseFirestore | null = null;
//     private auth: ReturnType<typeof getAuth> | null = null;
//
//     constructor() {
//         this.connectDataBase().then(() => {
//             console.log("connected");
//         }).catch((error) => {
//             console.error("Error connecting to database: ", error);
//         });
//     }
//
//     private async connectDataBase(): Promise<void> {
//         const firebaseConfig = {
//             apiKey: "AIzaSyANQzR4gnTp4U1QueWDPbcajFsoDco0CPU",
//             authDomain: "market-75977.firebaseapp.com",
//             projectId: "market-75977",
//             storageBucket: "market-75977.appspot.com",
//             messagingSenderId: "575415187020",
//             appId: "1:575415187020:web:455ef44d30a4767de6e6e9",
//             measurementId: "G-559YBQ4G3Q"
//         };
//
//         initializeApp(firebaseConfig);
//         this.db = getFirestore();
//         this.auth = getAuth();
//     }
//
//     public async getProducts(): Promise<Product[]> {
//         if (!this.db) {
//             throw new Error("Database not initialized");
//         }
//
//         return new Promise<Product[]>((resolve, reject) => {
//             const colRef = collection(this.db, 'Ingredients');
//
//             onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
//                 this.ingredients = [];
//                 snapshot.docs.forEach((doc) => {
//                     const data = doc.data();
//                     if (data && typeof data === 'object') {
//                         this.ingredients.push({ ...data, id: doc.id });
//                     }
//                 });
//
//                 this.ingredients.forEach(a => {
//                     console.log(a.title);
//                 });
//
//                 resolve(this.ingredients);
//             }, (error) => {
//                 console.error("Error fetching products: ", error);
//                 reject(error);
//             });
//         });
//     }
//
//     public async isExist(toSearch: string): Promise<boolean> {
//         if (!this.db) {
//             throw new Error("Database not initialized");
//         }
//
//         try {
//             const docRef = doc(this.db, 'Ingredients', toSearch);
//             const docSnap = await getDoc(docRef);
//
//             return docSnap.exists();
//         } catch (error) {
//             console.error('Error checking if ingredient exists: ', error);
//             return false;
//         }
//     }
//
//     public async addIngredient(ingredient: string): Promise<void> {
//         if (!this.db) {
//             throw new Error("Database not initialized");
//         }
//
//         try {
//             const exists = await this.isExist(ingredient);
//
//             if (!exists) {
//                 const colRef = collection(this.db, 'Ingredients');
//                 const customDocRef = doc(colRef, ingredient);
//
//                 await setDoc(customDocRef, { title: ingredient });
//                 console.log(`Ingredient ${ingredient} added successfully`);
//             } else {
//                 console.log(`Ingredient ${ingredient} already exists`);
//             }
//         } catch (error) {
//             console.error('Error adding ingredient: ', error);
//         }
//     }
//
//     public async deleteIngredient(id: string): Promise<void> {
//         if (!this.db) {
//             throw new Error("Database not initialized");
//         }
//
//         try {
//             const docRef = doc(this.db, 'Ingredients', id);
//             await deleteDoc(docRef);
//             console.log(`Ingredient ${id} deleted successfully`);
//         } catch (error) {
//             console.error('Error deleting ingredient: ', error);
//         }
//     }
// }
//
//
