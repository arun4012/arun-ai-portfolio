import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ChatMessage, ChatResponse } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly apiUrl = '/api/chat';
  private readonly timeoutMs = 20000;

  constructor(private http: HttpClient) {}

  sendMessage(
    question: string,
    history: ChatMessage[]
  ): Observable<ChatResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      question: question.trim().slice(0, 500),
      history: history.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      })),
    };

    return this.http
      .post<ChatResponse>(this.apiUrl, body, { headers })
      .pipe(
        timeout(this.timeoutMs),
        catchError(err => {
          if (err.name === 'TimeoutError') {
            return throwError(() => ({
              message: 'The AI assistant is taking too long to respond. Please try again.',
            }));
          }
          if (err.status === 429) {
            return throwError(() => ({
              message: 'Too many requests. Please wait a moment and try again.',
            }));
          }
          if (err.status === 503 || err.status === 0) {
            return throwError(() => ({
              message: 'The AI assistant is temporarily unavailable. You can still browse the portfolio or contact Arun directly.',
            }));
          }
          return throwError(() => ({
            message: 'Something went wrong. Please try again or contact Arun directly.',
          }));
        })
      );
  }
}

