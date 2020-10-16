import { Component } from "@angular/core";

import { Platform, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { userProfile } from './models/user.model';
import { Observable } from 'rxjs';
import { HomePage } from './home/home.page';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  navigate;
  userProfile:Observable<userProfile>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navctrl: NavController,
    private authserve: AuthService,
    private router: Router
  ) {
    this.initializeApp();
    this.sideMenu();

    this.userProfile = this.authserve.user$;
    
  }

  initializeApp() {
    this.splashScreen.hide();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  sideMenu() {
    this.navigate = [
      {
        title: "All Tasks",
        url: "/home/all",
      },
      {
        title: "Due Tasks",
        url: "/home/due",
      },
      {
        title: "Finished Tasks",
        url: "/home/com",
      },
      {
        title: "Performance",
        url: "/register",
      },
      {
        title: "Ask Queries",
        url: "/queries",
      },
      {
        title: "About",
        url: "/about",
      },
    ];
  }

  goLogout() {
    try {
      this.authserve.userLogout().then(res=>{
        console.log(res);
        if(res == "Logout")
          this.navctrl.navigateBack('/login');
          // this.router.navigate(['/login']);
      })
      .catch(err=>{
        console.log(err);
      });
      
    } catch (error) {
      console.dir(error);
    }
  }
}
