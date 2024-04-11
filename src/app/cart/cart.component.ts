import { Component } from '@angular/core';
import { CartService } from '../cart.service'
import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  items = this.cartService.getItems();
  checkOutForm = this.formBuilder.group({
    name:'',
    address:''
  });
  constructor(
      private cartService: CartService,
      private formBuilder: FormBuilder,
  ) {
  }

  onSubmit(){
    //Process checkout data here
    this.items = this.cartService.clearCart();
    console.warn('Your order has been submitted', this.checkOutForm.value);
    this.checkOutForm.reset();
  }
}
