import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductsService} from '../products.service';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {

    @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() loginSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    email: string = '';
    password: string = '';

    constructor(
        private productsService: ProductsService,
    ) {
    }

    ngOnInit(): void {
    }

    async logIn() {
        this.isLoading.emit(true);
        try {
            // Call your product service to handle the login or signup
            if (this.email !== '' && this.password !== '') {
                console.log('Email:', this.email);
                console.log('Password:', this.password);

                await this.productsService.signUp(this.email, this.password)
                    .then(() => {
                        this.email = '';
                        this.password = '';
                        this.loginSuccess.emit(true);
                    });
                // this.loginSuccess.emit(true);
            }
        } catch (error) {
            console.error('Error during form submission', error);
        }
        this.isLoading.emit(false);
    }

    async signIn() {
        this.isLoading.emit(true);
        try {
            const res = await this.productsService.signIn(this.email, this.password);
            if (res) {
                this.email = '';
                this.password = '';
                this.loginSuccess.emit(true);
            }
        } catch (error) {
            console.error('Error signing in', error);
        }
        this.isLoading.emit(false);
    }

    async logOut() {
        this.isLoading.emit(true);
        try {
            await this.productsService.logOut();
            console.log("logout clicked");
            this.loginSuccess.emit(false);
        } catch (error) {
            console.error('Error logging out', error);
        }
        this.isLoading.emit(false);
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
