import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { taskDetails } from '../models/tasks.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(private afstore: AngularFirestore,
              private afauth: AngularFireAuth,
              ) { }

    //adding the new task to database          
    addTask(taskDetails){
      try {
              const docid = this.afstore.createId();
              return this.afstore.collection('tasks').doc(docid)
                                 .set({
                                   uid:taskDetails.uid,
                                   dateCreated: taskDetails.dateCreated,
                                   done:false,
                                   title:taskDetails.title,
                                   description:taskDetails.desc,
                                   dueDate:taskDetails.dueDate,
                                   time:taskDetails.time,
                                   reminder:taskDetails.reminder,
                                   priority:taskDetails.priority,
                                   checklist:taskDetails.checklist
                                 }).then(res=>{
                                   return "Task Added";
                                 }).catch(err=>{
                                   return err;
                                 });
            
      } catch (error) {
        return error;
      }
    }


    //get All tasks with high to low priority
    getAllTasks(uid):Observable<any>{
      console.log(uid);
      try {
              return this.afstore.collection<taskDetails>('tasks',ref=>ref.where("uid","==",uid).orderBy("priority","asc")).snapshotChanges().pipe(
                map(actions=>{
                  return actions.map(a=>{
                    const data = a.payload.doc.data();
                    const tid = a.payload.doc.id;
                    return {tid,...data};
                  })
                })
              );
            
      } catch (error) {
        return error;
      }
    }


    //get a perticular task
    getTask(tid){
      try {
        return this.afstore.collection<any>('tasks').doc(tid).snapshotChanges().pipe(
          map(actions=>{
              const data:any = actions.payload.data();
              const tid = actions.payload.id;
              
              return {tid,...data};
          })
        )
      } catch (error) {
        return error;
      }
    }

    //deleting the task
    deleteTask(tid){
      try {
        return this.afstore.collection<any>('tasks').doc(tid).delete().then(res=>{
          return "Task Deleted";
        })
        .catch(err=>{
          return err;
        })
        
      } catch (error) {
        return error;
      }
    }


    //updating the checkList
    updateTaskChecklist(tid,chlist,tdone){
      try {
        return this.afstore.collection<any>('tasks').doc(tid).update({checklist:chlist,done:tdone}).then(res=>{
          return ("Task Updated");
        })
        .catch(err=>{
          return err;
        });

      } catch (error) {
        return error;
      }
    }

    //updating the checkList
    updateTask(tid,task){
      try {
        return this.afstore.collection<any>('tasks').doc(tid).update(task).then(res=>{
          return ("Task Updated");
        })
        .catch(err=>{
          return err;
        });

      } catch (error) {
        return error;
      }
    }


    //get All tasks with high to low priority
    getFilteredTasks(filter,uid):Observable<any>{
      try {
              if(filter == "due"){
                return this.afstore.collection<taskDetails>('tasks',ref=>ref.where("done","==",false).where("uid","==",uid).orderBy("priority","asc")).snapshotChanges().pipe(
                  map(actions=>{
                    return actions.map(a=>{
                      const data = a.payload.doc.data();
                      const tid = a.payload.doc.id;
                      return {tid,...data};
                    })
                  })
                );
              }
              else if(filter == "com"){
                return this.afstore.collection<taskDetails>('tasks',ref=>ref.where("done","==",true).where("uid","==",uid).orderBy("priority","asc")).snapshotChanges().pipe(
                  map(actions=>{
                    return actions.map(a=>{
                      const data = a.payload.doc.data();
                      const tid = a.payload.doc.id;
                      return {tid,...data};
                    })
                  })
                );
              }
              else if(filter=="asc"){
                return this.afstore.collection<taskDetails>('tasks',ref=>ref.where("uid","==",uid).orderBy("priority","asc")).snapshotChanges().pipe(
                  map(actions=>{
                    return actions.map(a=>{
                      const data = a.payload.doc.data();
                      const tid = a.payload.doc.id;
                      return {tid,...data};
                    })
                  })
                );
              }
              else if(filter == "des"){
                return this.afstore.collection<taskDetails>('tasks',ref=>ref.where("uid","==",uid).orderBy("priority","desc")).snapshotChanges().pipe(
                  map(actions=>{
                    return actions.map(a=>{
                      const data = a.payload.doc.data();
                      const tid = a.payload.doc.id;
                      return {tid,...data};
                    })
                  })
                );
              }else if(filter == "all"){
                this.getAllTasks(uid);
              }
              
            
      } catch (error) {
        return error;
      }
    }

}
