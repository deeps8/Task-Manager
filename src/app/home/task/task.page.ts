import { Component, OnInit } from "@angular/core";
import { TaskService } from "src/app/services/task.service";
import { ActivatedRoute, Router } from "@angular/router";
import { taskDetails } from "src/app/models/tasks.model";
import * as moment from "moment";
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: "app-task",
  templateUrl: "./task.page.html",
  styleUrls: ["./task.page.scss"],
})
export class TaskPage implements OnInit {

  taskId;
  task: taskDetails;
  checkList=[];
  count=0;
  ckcount=0;

  constructor(private taskserve: TaskService, 
              private router: ActivatedRoute,
              private route: Router,
              private alertctrl: AlertController,
              private toastctrl: ToastController,
              private loadctrl: LoadingController) {
    
  }

  ngOnInit() {
    this.taskId = this.router.snapshot.params["tid"];
      this.taskserve.getTask(this.taskId).subscribe(t=>{
        if(t.title){
          this.task = t;
          this.checkList = this.task.checklist;
          //console.log(this.checkList);
        }
      });
    
  }

  editTask(tid){

  }

  

  delTask(tid){
    //calling taskservice delete task
    this.presentAlert("Delete Task ?","Are you sure you want to delete the task ?",tid);
  }

  async presentAlert(head,msg,tid) {
    const alert = await this.alertctrl.create({
      cssClass: 'my-custom-class',
      header: head,
      message: msg,
      buttons: [
        {
          text: 'Yes',
          role: 'ok',
          handler: (h) => {
            this.deleteTask(tid);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }


  async presentLoading() {
    const lctrl = await this.loadctrl.create({
      message: 'Deleting task...',
    });

    await lctrl.present();
  }

  async presentToast(msg) {
    const toast = await this.toastctrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  deleteTask(tid){
    this.alertctrl.dismiss();

    this.presentLoading();

    this.taskserve.deleteTask(tid).then(res=>{
      this.loadctrl.dismiss();
      if(res==="Task Deleted"){
        this.presentToast(res);
        this.route.navigate(['/home','all']);
      }else{
        console.log("Something went wrong",res);
      }
    })
    .catch(err=>{
      this.loadctrl.dismiss();
      console.log(err);
    });
    
  }

  ckclicked(){
    this.ckcount++;
  }

  updateChecklist(i,cval){
    let taskDone;
      console.log(i);
      
      this.checkList[i].checked = cval;

      console.log("length = "+this.checkList.length);
      console.log("done = "+this.doneChecklist(this.checkList));
      if(this.doneChecklist(this.checkList) == this.checkList.length)
          taskDone = true;
      else
          taskDone = false;   

          console.log(taskDone);
      this.taskserve.updateTaskChecklist(this.task.tid,this.checkList,taskDone).then(res=>{
        if(res=="Task Updated")
          this.presentToast("Good Work!!");
        console.log(res);
      })
      .catch(err=>{
        console.log(err);
      });
  }

  taskStatus(tid,cklist,val){

    // this.presentAlert("Task Done?","Have you completed the task?");


      for (let i = 0; i < cklist.length; i++) {
         this.updateChecklist(i,val);
      }
    
    // console.log(cklist,tid,val);

    // this.taskserve.updateTaskChecklist(tid,cklist,val).then(res=>{
    //   if(res=="Task Updated")
    //   if(val)
    //     this.presentToast("Good Work!! Task Completed");
    //   else
    //     this.presentToast("Do Task");

    //   console.log(res);
    // })
    // .catch(err=>{
    //   console.log(err);
    // });
  }








  //formating functions
  getPiorClass(pval) {

    if (pval === "1") return "high";

    if (pval === "2") return "medium";

    if (pval === "3") return "low";
  }

  getPiorTClass(pval) {

    if (pval === "1") return "high-t";

    if (pval === "2") return "medium-t";

    if (pval === "3") return "low-t";
  }

  taskDate(dt) {
    return moment(dt).format("ddd, ll ");
  }

  taskTime(tm) {
    return moment(tm).format("LT");
  }

  doneChecklist(list) {
    this.count = 0;
    list.forEach((l) => {
      if (l.checked) this.count++;
    });

    return this.count;
  }

  doneTask(pval,done){
    if(pval === "1" && done)
      return "high-done";

    if(pval === "2" && done)
      return "medium-done";

    if(pval === "3" && done)
      return "low-done";
  }

  
}
