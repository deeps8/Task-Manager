import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { userProfile } from '../models/user.model';
import { first, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$:Observable<userProfile>;

  constructor(  private afauth:AngularFireAuth, 
                private router: Router,
                private afstore:AngularFirestore ) { 

        // initializing it with user details for logged in user          
        this.user$ = this.afauth.authState.pipe(
          switchMap(user =>{
            //logged in
            if(user){
              return this.afstore.doc<userProfile>(`userProfile/${user.uid}`).valueChanges();
            }else{
              //logged out
              return of(null);
            }
          })
        );
  }


  //get a user
  getUser():Promise<firebase.User>{
    return this.afauth.authState.pipe(first()).toPromise();
  }

  //login with email and password
  userLogin(userDetails:any):Promise<firebase.auth.UserCredential>{
   try {
    return this.afauth.signInWithEmailAndPassword(userDetails.email,userDetails.password);
   } catch (error) {
     return error;
   }
  }

  async userRegister(userDetails):Promise<firebase.auth.UserCredential>{
    try {
      
      const newUserCredential: firebase.auth.UserCredential = await this.afauth.createUserWithEmailAndPassword(userDetails.email,userDetails.password);

      await this.afstore.doc(`userProfile/${newUserCredential.user.uid}`)
                        .set({email: userDetails.email, username: userDetails.username, uid:newUserCredential.user.uid });
      
      return newUserCredential;                  
                        
    } catch (error) {
      return error;
    }
  }

  userLogout():Promise<any>{
    try {
      return this.afauth.signOut().then(res=>{
        return "Logout";
      })
      .catch(err=>{
        return err;
      });
    } catch (error) {
      return error;
    }
  }

}
