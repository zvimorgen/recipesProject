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
    private itemList: string[] = [
        "agar-agar", "allspice", "almond", "anchovy", "anise", "apple", "artichoke", "arugula",
        "asparagus", "avocado", "baking powder", "baking soda", "balsamic vinegar", "bamboo shoot",
        "banana", "barbecue sauce", "basil", "basil leaf", "bay leaf", "beef",
        "beetroot", "bell pepper", "black bean", "black olive", "black pepper", "black sesame seed",
        "black-eyed pea", "blackberry", "blue cheese", "blueberry", "bran", "bread", "bread crumb",
        "brie cheese", "broccoli", "brussels sprout", "buckwheat", "bulgur", "butter", "buttermilk",
        "cabbage", "cacao nib", "cajun seasoning", "camembert cheese", "canned tomato",
        "cannellini bean", "cardamom", "carob", "carrot", "cashew", "catfish", "cauliflower",
        "cayenne pepper", "celeriac", "celery", "chard", "cheddar cheese", "cheese", "chia seed",
        "chicken", "chickpea", "chili flake", "chili powder", "chipotle pepper", "chocolate",
        "cilantro", "cinnamon", "clam", "clove", "coconut milk", "coconut oil", "coconut sugar",
        "coconut water", "coffee", "coriander", "corn", "cottage cheese", "couscous", "cranberry",
        "cream", "cream cheese", "creme fraiche", "crouton", "crustacean", "cucumber", "cumin",
        "curry powder", "dill", "dried apricot", "dried fig", "dried mango", "dried thyme", "edam cheese",
        "edamame", "egg", "emmental cheese", "endive", "evaporated milk", "farro", "fennel",
        "fennel seed", "fenugreek", "feta cheese", "fig", "fish", "fish fillet", "fish sauce",
        "fish stock", "five spice powder", "flatbread", "flaxseed", "flour", "frosting", "fruit preserve",
        "garam masala", "garlic", "ghee", "ginger", "goat cheese", "goji berry", "gorgonzola cheese",
        "gouda cheese", "graham cracker", "grape", "green bean", "green onion", "green pea",
        "ground beef", "ground turkey", "gruyere cheese", "guacamole", "guava", "halloumi cheese",
        "ham", "harissa paste", "hazelnut spread", "hazelnut", "herbes de provence", "hoisin sauce",
        "honey", "honey mustard", "horseradish", "hot sauce", "hummus", "jalapeño", "jasmine rice",
        "jicama", "kale", "kefir", "ketchup", "kombu", "kumquat", "lamb", "leek", "lemon", "lentil",
        "lettuce", "lime", "liver", "macadamia nut", "mace", "mango", "maple syrup", "margarine",
        "marjoram", "marmalade", "mascarpone cheese", "matcha powder", "mayonnaise", "milk", "mint",
        "molasses", "monterey jack cheese", "mozzarella cheese", "mung bean", "mushroom", "mustard",
        "naan", "nectarine", "noodle", "nut butter", "nutmeg", "nutritional yeast", "oat", "olive oil",
        "olive", "onion", "orange", "oregano", "oregano leaf", "paprika", "parmesan cheese",
        "parsley", "passion fruit", "pasta", "peach", "peanut", "pear", "pea", "pecan", "pepper",
        "pickle", "pineapple", "pistachio", "potato", "provolone cheese", "pumpkin seed", "quinoa",
        "raspberry", "rice", "ricotta cheese", "rosemary", "sage", "salsa", "salt", "sesame seed",
        "sour cream", "soy sauce", "spinach", "strawberry", "sugar", "sunflower seed", "swiss cheese",
        "tea", "thyme", "tahini", "tamarind", "tapioca", "tarragon", "tempeh", "tilapia", "tofu",
        "tomato paste", "tomato sauce", "trout", "turmeric", "turnip", "vermicelli", "walnut oil",
        "walnut", "water chestnut", "watercress", "wheat bran", "white bean", "white chocolate",
        "white pepper", "whole wheat flour", "wild rice", "worcestershire sauce", "yogurt", "zucchini",
        "apricot", "beet", "cherry", "date", "fig", "grapefruit", "kiwifruit", "leek", "lime", "plum",
        "almond milk", "coconut milk", "greek yogurt", "oat milk", "soy milk",
        "bacon", "duck", "lamb", "pork", "tofu",
        "barley", "buckwheat", "millet", "rye", "quinoa",
        "brazil nut", "chia seed", "flaxseed", "hemp seed", "pine nut",
        "allspice", "anise", "cardamom", "cayenne pepper", "turmeric",
        "alfredo sauce", "hoisin sauce", "sriracha", "teriyaki sauce", "worcestershire sauce",
        "baking powder", "baking soda", "cocoa powder", "cornstarch", "yeast",
        "avocado oil", "canola oil", "coconut oil", "sesame oil", "vegetable oil",
        "apple cider", "cranberry juice", "grape juice", "lemonade", "orange juice",
        "agave nectar", "caramel", "chocolate chip", "marshmallow", "peanut butter",
        "beef broth", "chicken broth", "evaporated milk", "tomato paste", "vinegar",
        "artichoke heart", "bok choy", "butternut squash", "cranberry", "dragon fruit",
        "lychee", "passion fruit", "rutabaga", "coconut cream", "rice milk",
        "venison", "quail", "bison", "amaranth", "sorghum", "pecan",
        "sunflower seed", "pumpkin seed", "pectin", "arrowroot powder", "clarified butter",
        "peanut oil", "pomegranate juice", "mango juice", "fruit jam", "gelatin",
        "vegetable broth",
        // Added new items from the given ingredients list
        "onion", "tomato", "kale", "anchovy", "tomato sauce", "cream", "rosemary", "ham",
        "noodle", "clove", "garlic", "black pepper", "egg", "carrot", "yeast", "vanilla", "sesame seed",
        "sriracha", "jalapeño", "cheddar cheese", "mint", "guacamole", "cucumber", "couscous", "hot sauce",
        "barley", "coffee", "cream cheese", "yogurt", "whole wheat flour", "sage", "dried thyme", "pineapple",
        "pickles", "pear", "worcestershire sauce", "honey", "orange juice", "allspice", "nutmeg",
        "strawberry", "pecan", "coconut oil", "frosting", "baking soda", "ginger", "white sugar", "vanilla extract",
        "cornstarch", "brown sugar", "potato", "dried fig", "chili flakes", "rice", "cayenne pepper",
        "mayonnaise", "parsley", "dates", "blueberry", "grape juice", "olive oil", "apple cider", "bamboo shoot",
        "peach", "asparagus", "cayenne pepper", "cayenne pepper", "cola", "ribs", "sake", "mirin",
        "chive", "chive", "dill", "beef"
    ];





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

    async updateTheDataBase(){
        this.itemList.forEach(item => this.addIngredient(item))
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
        // } else {
            // alert("The product already exists in the list of components")
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
                const productsData:Product[] = await this.getProducts() || [];

                const filteredProducts: Product[] = productsData.filter((product: Product) => product.id.includes(toSearch));

                console.log(filteredProducts);
                resolve(filteredProducts);
            } catch (error) {
                console.error("Error searching ingredients: ", error);
                reject(error);
            }
        });
    }

    async searchUserIngredient(toSearch: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                const userIngredients = await this.getUserData();

                const filteredUserIngredients: Product[] = userIngredients.filter((ingredient: Product) => ingredient.id.includes(toSearch));

                console.log(filteredUserIngredients);
                resolve(filteredUserIngredients);
            } catch (error) {
                console.error("Error searching user ingredients: ", error);
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