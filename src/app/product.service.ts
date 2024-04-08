import {Injectable} from '@angular/core';
import {Product} from './products';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private products: Product[] = [
        {
            id: 1,
            name: 'bread',
            // price: 799,
            description: '',
            show: true,
        },
        {
            id: 2,
            name: 'Beef',
            // price: 699,
            description: '',
            show: true,
        },
        {
            id: 3,
            name: 'Meat',
            // price: 299,
            description: '',
            show: true,
        },
        {
            id: 4,
            name: 'Milk',
            // price: 900,
            description: '',
            show: true,
        },
        {
            id: 5,
            name: 'Cheese',
            // price: 900,
            description: ' ',
            show: true,
        },
        {
            id: 6,
            name: 'Tomato paste',
            // price: 900,
            description: '',
            show: true,
        },
        {
            id: 7,
            name: 'Chili sauce',
            // price: 900,
            description: '',
            show: true,
        },
        {
            id: 8,
            name: 'Chicken Breast',
            // price: 900,
            description: '',
            show: true,
        },
    ];

    constructor() {
    }
    // פונקציה לעדכון הערך של show במוצר מסויים
    updateProductShow(productId: number, newValue: boolean): void {
        const productToUpdate = this.products.find((product: { id: number; }) => product.id === productId);
        if (productToUpdate) {
            productToUpdate.show = newValue;
        }
    }

// פונקציה לקבלת רשימת המוצרים
    getProducts(): Product[] {
        return this.products;
    }
}
