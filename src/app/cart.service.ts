import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// import {Product} from'./products'
import  {Product} from './products.service'

@Injectable({
  providedIn: 'root'
})
export class CartService {
items: Product[]= [];
  constructor(
      private  http: HttpClient
  ) { }

  addToCart(ingredient: Product){
   this.items.push(ingredient);
  }
  getItems(){
    return this.items;
  }
  clearCart(){
    this.items = [];
    return this.items;
  }
  getShippingPrice(){
    return this.http.get<{type: string, price: number}[]>
    ('/assets/shipping.json');
  }
}
