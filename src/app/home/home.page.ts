import { Component, OnInit } from '@angular/core';
import { taskDetails } from '../models/tasks.model';
import { Observable } from 'rxjs';
import { TaskService } from '../services/task.service';
import * as moment from 'moment';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  day:string="Monday";
  date:string;
  tasks:Observable<taskDetails[]>;
  data:boolean=false;
  dataAvail:Boolean=true;
  category="all";
  title:string = "ALL"
  constructor(private taskserve: TaskService,
              private authserve: AuthService,
              private route: ActivatedRoute,
              private alertctrl: AlertController,
              private toastctrl: ToastController ) {
    this.date =  Date();
  }
  ngOnInit(): void {
    
    this.category = this.route.snapshot.params['cag'];
    this.title = this.category;
    console.log(this.category);
    
    if(this.category == "com")
      this.title = "Finished";
    // console.log(this.category);
    this.authserve.user$.subscribe(user=>{
  
      if(this.category){
        this.taskserve.getFilteredTasks(this.category,user.uid).subscribe(res=>{
          this.tasks = res;
          if(res.length > 0){
           this.data = true;
           this.dataAvail = true;
          }
          else{
           this.data = true;
           this.dataAvail = false;
          }
    
       });
      }else{
        this.taskserve.getAllTasks(user.uid).subscribe(res=>{
          this.tasks = res;
          if(res.length > 0){
          this.data = true;
          this.dataAvail = true;
          }
          else{
          this.data = true;
          this.dataAvail = false;
          }
  
      }); 

      }
            
    })
    
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  taskDate(dt){
      return moment(dt).format("ddd, ll ");
  }

  taskTime(tm){
    return moment(tm).format("LT");
  }

  doneChecklist(list){
    var count=0;
    list.forEach(l => {
      if(l.checked)
        count++;
    });

    return count;
  }

  getPiorClass(pval){
    if(pval === "1")
      return "high";

    if(pval === "2")
      return "medium";

    if(pval === "3")
      return "low";

  }

  doneTask(pval,done){
    if(pval === "1" && done)
      return "high-done";

    if(pval === "2" && done)
      return "medium-done";

    if(pval === "3" && done)
      return "low-done";
  }

  taskStatus(tid,cklist,val){

    // this.presentAlert("Task Done?","Have you completed the task?");


      for (let i = 0; i < cklist.length; i++) {
        cklist[i].checked = val; 
      }
    
    // console.log(cklist,tid,val);

    this.taskserve.updateTaskChecklist(tid,cklist,val).then(res=>{
      if(res=="Task Updated")
      if(val)
        this.presentToast("Good Work!! Task Completed");
      else
        this.presentToast("Do Task");

      console.log(res);
    })
    .catch(err=>{
      console.log(err);
    });
  }


  filterTasks(val){
    this.data = false;
    this.authserve.user$.subscribe(user=>{
      
    });
    
  }



  async presentToast(msg) {
    const toast = await this.toastctrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(head,msg) {
    const alert = await this.alertctrl.create({
      cssClass: 'my-custom-class',
      header: head,
      message: msg,
      buttons: [
        {
          text: 'Yes',
          role: 'ok',
          handler: (h) => {
            return true;
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
