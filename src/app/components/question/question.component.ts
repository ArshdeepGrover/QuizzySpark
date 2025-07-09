import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizQuestion } from 'src/app/models/quiz-question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() questions: QuizQuestion[] = [];
  currentQuestion: number = 0;
  score: number = 0;
  isAnswerCorrect: boolean = false;
  quizFinish: boolean = false;
  isLoading: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  checkAndNextQuestion(answer: boolean) {
    if (answer) {
      this.score++;
    }
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    } else {
      this.showResult();
    }
  }

  showResult() {
    localStorage.setItem('userQuizScore', this.score.toString());
    this.router.navigate(['result']);
  }
}
