import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { QuizQuestion } from 'src/app/models/quiz-question';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  // OpenTDB (Free API - No authentication required)
  private openTdbUrl = 'https://opentdb.com/api.php';

  // QuizAPI (Requires API key)
  private quizApiUrl = 'https://quizapi.io/api/v1/questions';
  private quizApiKey = 'emlLrCR0PaosoArvo4KWVnDhvjn0vzunHsivZ3MR';

  // Category mappings for OpenTDB
  private categoryMap: { [key: string]: number } = {
    general: 9,
    books: 10,
    film: 11,
    music: 12,
    theatres: 13,
    television: 14,
    videoGames: 15,
    boardGames: 16,
    science: 17,
    computers: 18,
    mathematics: 19,
    mythology: 20,
    sports: 21,
    geography: 22,
    history: 23,
    politics: 24,
    art: 25,
    celebrities: 26,
    animals: 27,
    vehicles: 28,
    comics: 29,
    gadgets: 30,
    anime: 31,
    cartoons: 32,
  };

  constructor(private http: HttpClient) {}

  // Get questions from OpenTDB (Free API)
  getQuestionsFromOpenTDB(
    amount: number = 10,
    difficulty: string = 'easy',
    category: string = 'general'
  ): Observable<QuizQuestion[]> {
    let params = new HttpParams()
      .set('amount', amount.toString())
      .set('type', 'multiple');

    if (difficulty && difficulty !== 'any') {
      params = params.set('difficulty', difficulty);
    }

    if (category && category !== 'any') {
      const categoryId = this.categoryMap[category] || 9;
      params = params.set('category', categoryId.toString());
    }

    return this.http.get<any>(this.openTdbUrl, { params }).pipe(
      map((response) => {
        if (response.response_code === 0) {
          return response.results.map((item: any, index: number) => {
            // Combine and shuffle answers
            const allAnswers = [item.correct_answer, ...item.incorrect_answers];
            // Shuffle
            for (let i = allAnswers.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
            }
            // Map to keys A, B, C, D
            const answerKeys = ['A', 'B', 'C', 'D'];
            const answers: { [key: string]: string } = {};
            allAnswers.forEach((ans, idx) => {
              answers[answerKeys[idx]] = ans;
            });
            return {
              id: index + 1,
              question: this.decodeHtmlEntities(item.question),
              answers,
              correct_answer: item.correct_answer,
              category: item.category,
              difficulty: item.difficulty,
            };
          });
        } else {
          throw new Error('No questions found');
        }
      })
    );
  }

  // Get questions from QuizAPI (Requires API key)
  getQuestionsFromQuizAPI(
    limit: number = 10,
    difficulty?: string,
    category?: string
  ): Observable<QuizQuestion[]> {
    let params = new HttpParams()
      .set('apiKey', this.quizApiKey)
      .set('limit', limit.toString());

    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<QuizQuestion[]>(this.quizApiUrl, { params });
  }

  // Main method - defaults to OpenTDB (free)
  getQuestions(
    limit: number = 10,
    difficulty: string = 'easy',
    category: string = 'general',
    apiSource: 'opentdb' | 'quizapi' = 'opentdb'
  ): Observable<QuizQuestion[]> {
    if (apiSource === 'opentdb') {
      return this.getQuestionsFromOpenTDB(limit, difficulty, category);
    } else {
      return this.getQuestionsFromQuizAPI(limit, difficulty, category);
    }
  }

  // Get available categories for OpenTDB
  getOpenTDBCategories(): Observable<any[]> {
    return this.http
      .get<any>('https://opentdb.com/api_category.php')
      .pipe(map((response) => response.trivia_categories));
  }

  // Helper method to decode HTML entities
  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
}
