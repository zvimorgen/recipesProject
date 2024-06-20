import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductsService} from '../products.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit{

    @Output() loginSuccess = new EventEmitter<void>();
    email: string = '';
    password: string = '';

    constructor(
        private productsService: ProductsService,
    ) {
    }
    ngOnInit(): void{}

    async logIn() {
        try {
            // Call your product service to handle the login or signup
            if (this.email !== '' && this.password !== '') {
                console.log('Email:', this.email);
                console.log('Password:', this.password);

                await this.productsService.signUp(this.email, this.password)
                    .then(() => {
                        this.email = '';
                        this.password = '';
                        this.loginSuccess.emit();
                    });
            }
        } catch (error) {
            console.error('Error during form submission', error);
        }
    }

    async signIn() {
        try {
             const res = await this.productsService.signIn(this.email, this.password);
            if(res) {
                this.email = '';
                this.password = '';
                this.loginSuccess.emit();
            }
        } catch (error) {
            console.error('Error signing in', error);
        }
    }

    async logOut() {
        try {
            await this.productsService.logOut();
            console.log("logout clicked");
        } catch (error) {
            console.error('Error logging out', error);
        }
    }
}


//   async logIn() {
//     try {
//       // Call your product service to handle the login or signup
//       if (this.email !== '' && this.password !== '') {
//         console.log('Email:', this.email);
//         console.log('Password:', this.password);
//
//         await this.productsService.signUp(this.email, this.password)
//             .then(() => {
//               this.email = '';
//               this.password = '';
//               this.loginSuccess.emit();
//             });
//       }
//     }
//     catch
//       (error)
//       {
//         console.error('Error during form submission', error);
//       }
//     }
//
//     async signIn(){
//
//       await this.productsService.signIn(this.email, this.password)
//       this.loginSuccess.emit();
//   }
//   async logOut(){
//
//     await this.productsService.logOut()
//     console.log("logout clicked");
//   }
// }
