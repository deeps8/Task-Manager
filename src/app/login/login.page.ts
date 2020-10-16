import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup;
  userCred;
  alertctrl;
  loadctrl;
  constructor(private authserve: AuthService,
              private loading: LoadingController,
              private alert: AlertController,
              private router:Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(6)])
    }); 
  }

  async goLogin(logf){
    // console.log(logf.value);
    //open loading
    this.presentLoading();

    this.userCred = await this.authserve.userLogin(logf.value).then(res=>{
      
      // console.log(res);
      
      //resenting the form fields
      this.loginForm.reset();

      this.loading.dismiss();

      //navigating to home page
      this.router.navigate(['/home','all']);

    })
    .catch(error=>{

      // console.log(error.code);
      

      if(error.code == "auth/user-not-found"){
        this.loading.dismiss();
        this.loginForm.reset();
        
        this.presentAlert("Login","Incorrect Email","","Try Again");
      }
      
      //alert for incorrect password
      if(error.code=="auth/wrong-password"){
        this.loading.dismiss();
        this.loginForm.reset();

        this.presentAlert("Login","Incorrect Password","","Try Again");
      }

    });
  }

  async presentAlert(head,subHead,msg,btn) {
    this.alertctrl = await this.alert.create({
      header: head,
      subHeader: subHead,
      message: msg,
      buttons: [btn]
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
