import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authserv: AuthService,private router: Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      return new Promise(async (resolve, reject)=>{
        try {
          const user = await this.authserv.getUser();
          if(user){
            resolve(true);
          }else{
            reject("No user Logged in");
            this.router.navigate(['/login']);
          }
        } catch (error) {
            reject(error);
        }
      });

  }
  
}
