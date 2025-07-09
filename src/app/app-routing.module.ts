import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from 'src/app/components/quiz/quiz.component';
import { ResultComponent } from 'src/app/components/result/result.component';

const routes: Routes = [
  { path: '', component: QuizComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'result', component: ResultComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
