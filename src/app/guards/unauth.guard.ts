import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
  constructor(private authserv: AuthService,private router: Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      return new Promise(async (resolve, reject)=>{
        try {
          const user = await this.authserv.getUser();
          if(user){
            //rejects("No user Logged in");
            this.router.navigate(['/home']);
          }else{
            resolve(true);
          }
        } catch (error) {
            reject(error);
        }
      });
  }
  
}
