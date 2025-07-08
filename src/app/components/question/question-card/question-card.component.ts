import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizQuestion } from 'src/app/models/quiz-question';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss'],
})
export class QuestionCardComponent {
  @Input() question!: QuizQuestion;
  @Input() questionNumber!: number;
  @Input() totalQuestion!: number;
  @Input() score: number = 0;
  isAnswerCorrect: boolean = false;
  isAnswerSelected: boolean = false;
  selectedAnswerKey: string = '';

  @Output() showNextQuestion = new EventEmitter<boolean>();

  selectAnswer(question: QuizQuestion, selectedAnswerKey: string) {
    const selectedAnswerValue = question.answers[selectedAnswerKey];
    const correctAnswer = question.correct_answer;
    this.isAnswerCorrect = selectedAnswerValue === correctAnswer;
    this.isAnswerSelected = true;
    this.selectedAnswerKey = selectedAnswerKey;
  }

  nextQuestion() {
    this.isAnswerSelected = false;
    this.selectedAnswerKey = '';
    this.showNextQuestion.emit(this.isAnswerCorrect);
  }
}
