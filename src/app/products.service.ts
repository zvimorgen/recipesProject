import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';


import {
    collection, getFirestore,
    deleteDoc, doc, onSnapshot,
    setDoc, getDoc, updateDoc
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
    private updatedCategoryData: number = 0;


    constructor() {
        // await this.connectDataBase()
        //       console.log("connected");
        this.connectDataBase()
            .then(() => {
                console.log("connected");
            })
            .catch((error) => {
                console.error('Error connecting to database:', error);
            });

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
                        return {...data, id: doc.id};
                    }
                    console.error('Invalid or missing data in document:', doc.id);
                    return null;
                }).filter(item => item !== null) as Product[];

                resolve(this.ingredients);
            }, reject);
        });
    }

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

    async signUp(email: string, password: string) {

        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            this.user = userCredential.user;

            const userData = {
                email: this.user.email,
                password: password,
                createdAt: new Date(),
                cookies: 0,
                "meat food": 0,
                "dairy food": 0,

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

    async addIngredientsToUser(ingredient: Product) {
        try {
            await this.addAdditionalSettings(ingredient);
            console.log('ingredients added successfully for user:', this.user.uid);
        } catch (error) {
            console.error('Error adding ingredients for user:', this.user.uid, error);
        }
    }

    async addAdditionalSettings(ingredient: Product) {
        try {
            console.log('Initial ingredient:', ingredient);

            // קבלת נתוני המשתמש
            const userData = await this.getUserData();
            // console.log('User data:', userData);

            // רשימת רכיבים מעודכנת
            const ingredients = userData || [];

            // בדיקה אם הרכיב כבר קיים ברשימה
            const indexToRemove = ingredients.findIndex(item => item.id === ingredient.id);
            if (indexToRemove !== -1) {
                console.log('Ingredient already exists, removing from list to add:', ingredient.id);
                ingredients.splice(indexToRemove, 1);
            }

            // הוספת הרכיב החדש לרשימה
            ingredients.push(ingredient);

            console.log('Final ingredients to be saved:', ingredients);

            // שמירת הנתונים המעודכנים במסד הנתונים
            await setDoc(doc(this.db, 'users', this.user.uid), {ingredients}, {merge: true});
            console.log('Additional settings added successfully!');
        } catch (error) {
            console.error('Error adding additional settings:', error);
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

    async searchIngredient(toSearch: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                // const ingredients: Product[] = [];
                const productsData = await this.getProducts() || [];

                const filteredProducts = productsData.filter((product: Product) => product.id.includes(toSearch));

                console.log(filteredProducts);
                resolve(filteredProducts);
            } catch (error) {
                console.error("Error searching ingredients: ", error);
                reject(error);
            }
        });
    }

    async updateFiled(category: string, value: number): Promise<void> {

        const userDocRef = doc(this.db, 'users', this.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            if (userData) {
                const categoryData = userData[category];
                this.updatedCategoryData = categoryData + value;
                console.log('Updated category data:', this.updatedCategoryData);
            }

            await setDoc(doc(this.db, 'users', this.user.uid), {[category]: this.updatedCategoryData}, {merge: true});
            console.log('Additional settings added successfully!');
        }
    }
}