import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm:FormGroup;
  userCred;
  alertctrl;
  loadctrl;
  constructor(private authserve: AuthService,
              private loading: LoadingController,
              private alert: AlertController,
              private router:Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('',[Validators.required,Validators.pattern('[a-zA-z][a-zA-z ]+'),Validators.minLength(6)]),
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required,Validators.minLength(6)])
    })
  }

  async goRegister(regf){
      //console.log(regf.value);
      this.presentLoading();
      
      try {
        const response:any = await this.authserve.userRegister(regf.value);
        //console.log(response);  

        //resenting the form fields
        this.registerForm.reset();

        if(response.code == "auth/email-already-in-use"){
          this.loading.dismiss();
          this.registerForm.reset();
          
          this.presentAlert("Register","Already have an Account","","Login");
        }else{
          this.loading.dismiss();
  
          //navigating to home page
          //console.log("In home");
          this.router.navigate(['/home','all']);
        }
      

      } catch (error) {
        //console.log(error);
        
  
        if(error.code == "auth/email-already-in-use"){
          this.loading.dismiss();
          this.registerForm.reset();
          
          this.presentAlert("Register","Already have an Account","","Login");
        }
      }
  }

  async presentAlert(head,subHead,msg,btn) {
    this.alertctrl = await this.alert.create({
      header: head,
      subHeader: subHead,
      message: msg,
      buttons: [
        {
          text: btn,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.router.navigate(['/login']);
          }
        }, {
          text: 'Try Again',
          role: 'ok',
          handler: (blah) => {
            this.router.navigate(['/register']);
          }
        }
      ]
      
    });

    await this.alertctrl.present();
  }


  async presentLoading() {
    this.loadctrl = await this.loading.create({
      message: 'Please wait...',
    });

    await this.loadctrl.present();
  }


}
