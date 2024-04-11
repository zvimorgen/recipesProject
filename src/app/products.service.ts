import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {
    addDoc, collection, getFirestore,
    getDocs, deleteDoc, doc, onSnapshot,
    query, where, QuerySnapshot, DocumentData,
    setDoc
} from 'firebase/firestore';


export interface Product {
    id: string;
    // name: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private ingredients: Product[] = [];
    // @ts-ignore
    private db: FirebaseFirestore;


    constructor() {
        this.connectDataBase().then(r =>
            console.log("connected"));
    }

    async connectDataBase(): Promise<void> {
        // Initialize Firebase app
        const firebaseConfig = {
            apiKey: "AIzaSyBP5HF1y7ktcCs8LiAU0UHHQNFB5sa5idc",
            authDomain: "recipes-ad251.firebaseapp.com",
            projectId: "recipes-ad251",
            storageBucket: "recipes-ad251.appspot.com",
            messagingSenderId: "1071942898897",
            appId: "1:1071942898897:web:90cd360204b7f5cc4561f0"
        };

        initializeApp(firebaseConfig);

        this.db = getFirestore();
    }

    async getProducts(): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {

            const colRef = collection(this.db, 'Ingredients');

            // Listen to real-time updates on the collection
            onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
                this.ingredients = [];
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (data && typeof data === 'object') {
                        this.ingredients.push({...data, id: doc.id});
                        console.log(this.ingredients);
                    } else {
                        console.error('Invalid or missing data in document:', doc.id);
                    }
                });
                // Resolve the promise with the ingredients array
                resolve(this.ingredients);
            });
        });
    }

    async addIngredient(ingredient: string) {

        const colRef = collection(this.db, 'Ingredients');

        //set ID
        const customDocRef = doc(colRef, ingredient);

        //Adding data to firestore
        await setDoc(customDocRef, {
            // id: ingredient,
            title: ingredient,
        });

    }

    catch(error: any) {
        console.error('Error adding ingredient: ', error);
    }

    async deleteIngredient(id: string) {

        const colRef = collection(this.db, 'Ingredients');
        const docRef = doc(this.db, 'Ingredients', id)

        await deleteDoc(docRef)
    }
}


