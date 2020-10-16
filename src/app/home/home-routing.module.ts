import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { TaskPage } from './task/task.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/all',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'task/:tid',
    loadChildren: () => import('./task/task.module').then( m => m.TaskPageModule)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./add-task/add-task.module').then( m => m.AddTaskPageModule)
  },
  {
    path: 'add-task/:tid',
    loadChildren: () => import('./add-task/add-task.module').then( m => m.AddTaskPageModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
