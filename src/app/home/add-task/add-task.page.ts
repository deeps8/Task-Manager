import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import * as moment from 'moment';
import { TaskService } from 'src/app/services/task.service';
import { taskDetails } from 'src/app/models/tasks.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-add-task",
  templateUrl: "./add-task.page.html",
  styleUrls: ["./add-task.page.scss"],
})
export class AddTaskPage implements OnInit {

  date;
  public chk = [ ];
  taskForm: FormGroup;
  tid;
  task;

  constructor(private alert: AlertController,
              private route: Router,
              private router: ActivatedRoute,
              private navctrl: NavController,
              private authserve: AuthService,
              private toastctrl: ToastController,
              private loadctrl: LoadingController,
              private taskserve: TaskService) {

    this.date = Date();
    //console.log(this.date);

  }

  ngOnInit() {

    // form value
    this.taskForm = new FormGroup({
      title: new FormControl("", []),
      desc: new FormControl("", []),
      dueDate: new FormControl("", []),
      time: new FormControl("", []),
      remind: new FormControl("daily", []),
      priority: new FormControl("2", []),
      checkList: new FormControl("", []),
      chkinput: new FormControl("", []),
    });

    
    this.router.paramMap.subscribe(res=>{
      if(res['params'].tid){
        this.tid = res['params'].tid;
        console.log(this.tid);
        this.taskserve.getTask(this.tid).subscribe(t=>{
          if(t.title){
            this.task = t;
            this.chk = this.task.checklist;
            this.taskForm = new FormGroup({
              title: new FormControl(this.task.title, []),
              desc: new FormControl(this.task.description, []),
              dueDate: new FormControl(this.task.dueDate, []),
              time: new FormControl(this.task.time, []),
              remind: new FormControl(this.task.reminder, []),
              priority: new FormControl(this.task.priority, []),
              checkList: new FormControl("", []),
              chkinput: new FormControl("", []),
            });
          }
        });
      }
    });

    
  }

  onAddChecklist(val) {
    var item = {
      value: val,
      checked: false,
    };
    if (val) {
      this.chk.unshift(item);
      this.taskForm.patchValue({ chkinput: "" });
    }else{
      this.presentAlert("Empty Checklist!!","","please enter data","ok")
    }
  }

  async presentAlert(head,subHead,msg,btn) {
    const alt = await this.alert.create({
      header: head,
      subHeader: subHead,
      message: msg,
      buttons: [btn]
    });

    await alt.present();
  }

  async presentLoading(msg) {
    const lctrl = await this.loadctrl.create({
      message: msg,
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


  removeItem(id) {
    this.chk.splice(id, 1);
  }

  goAddTask(taskf) {

    // moment(taskf.dueDate).format("DD MM YYYY"),
    // moment(taskf.time).format("LT"),
    this.presentLoading("Adding Task...");
    let user;
    this.authserve.user$.subscribe(res=>{
      user = res;
      //console.log(user);
      const taskDetails = {
      
        dateCreated: moment().format("DD MM YYYY hh:mm:ss A"),
        done:false,    
        uid:user.uid,
        title: taskf.title,
        desc:taskf.desc,
        dueDate: taskf.dueDate,
        time: taskf.time,
        reminder:taskf.remind,
        priority:taskf.priority,
        checklist:this.chk

    }
    //console.log(taskDetails);

      this.taskserve.addTask(taskDetails).then(res=>{
        this.loadctrl.dismiss();
        if(res == "Task Added" ){
          this.presentToast("New Task Added");
          this.route.navigate(['/home','all']);
          //this.navctrl.back();
        }else{
          this.presentAlert("Try Again","","Something went wrong!","Ok")
          this.taskForm.reset();
        }
          // console.log(res);
      });
    });
    

  }


  updateTask(taskFrm) {

    // moment(taskf.dueDate).format("DD MM YYYY"),
    // moment(taskf.time).format("LT"),
    this.presentLoading("Updating Task...");

    const taskDetails = {
      
        dateCreated: moment().format("DD MM YYYY hh:mm:ss A"),
        done:false,
        uid:this.task.uid,    
        title: taskFrm.title,
        description:taskFrm.desc,
        dueDate: taskFrm.dueDate,
        time: taskFrm.time,
        reminder:taskFrm.remind,
        priority:taskFrm.priority,
        checklist:this.chk

    }
    console.log("IN UPDATE",taskDetails);

    this.taskserve.updateTask(this.tid,taskDetails).then(res=>{
      
      this.loadctrl.dismiss();
      if(res=="Task Updated"){
        this.presentToast("Task Updated");
        this.navctrl.back();
      }else{
        this.presentAlert("Try Again","","Something went wrong!","Ok");
        this.taskForm.reset();
      }
        console.log(res);
    })
    .catch(err=>{
      console.log(err);
    });
  

  }
}
