import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post, Vote, Comment, VoteComment } from '../../../data';
import { AuthService } from '../auth/auth.service';
import { map, catchError, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor(http: HttpClient, auth: AuthService) {
    this.http = http;
    this.authService = auth;
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({ 'authorization': token });
    } else {
      return new HttpHeaders();
    }
  }


  login(credentials: { username: string; password: string }) {
    const url = `${this.baseUrl}/login`;
    const headers = this.getAuthHeaders();
    return this.http.post<string>(url, credentials, { headers });
  }
  

  logout() {
    const url = `${this.baseUrl}/logout`;
    const headers = this.getAuthHeaders(); 
    return this.http.post<string>(url, {}, { headers });
  }


  registrazione(credentials: { username: string; password: string }) {
    const url = `${this.baseUrl}/registrazione`;
    console.log("quarto penesrnello");
    const headers = this.getAuthHeaders();
    return this.http.post<string>(url, credentials, { headers });
  }


  getPosts() {
    const url = `${this.baseUrl}/posts`;
    return this.http.get<Post[]>(url).pipe(
      map(posts => posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      })))
    );
  }


  getPostsByAge(days: number) {
    const url = `${this.baseUrl}/posts`;
    const params = new HttpParams().set('maxAge', days.toString());
    return this.http.get<Post[]>(url, { params }).pipe(
      map(posts => posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      })))
    );
  }


  getPostById(id: number) {
    const url = `${this.baseUrl}/posts/${id}`;
    return this.http.get<Post>(url).pipe(
      map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }))
    );
  }

  getComments(postId: number) {
    const url = `${this.baseUrl}/posts/${postId}/comments`;
    return this.http.get<Comment[]>(url).pipe(
      map(comments => comments.map(comment => ({
        ...comment,
        createdAt: new Date(comment.createdAt)
      })))
    );
  }


  createPost(post: {title: string, description: string}) {
    console.log("il secondo penesrnello salvatempo"); 
    const url = `${this.baseUrl}/posts`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, post, { headers });
  }


  deletePost(id: number) {
    const url = `${this.baseUrl}/posts/${id}`;
    const headers = this.getAuthHeaders();
    return this.http.delete(url, { headers });
  }


  votePost(postId: number, type: number) {
    const url = `${this.baseUrl}/posts/${postId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { type }, { headers }).pipe(
      catchError(() => {
        console.error('Vote failed');
        return EMPTY;
      })
    );
  }


  removeVote(postId: number) {
    const url = `${this.baseUrl}/posts/${postId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.delete(url, { headers }).pipe(
      catchError(() => {
        console.error('Remove vote failed');
        return EMPTY;
      })
    );
  }


  addComment(postId: number, body: string) {
    const url = `${this.baseUrl}/posts/${postId}/comments`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { body }, { headers });
  }
  

  getUserVote(postId: number) {
    const url = `${this.baseUrl}/posts/${postId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.get<{ votes: Vote[], counter: number }>(url, { headers }).pipe(
      map(response => {
        return {
          votes: response.votes,
          counter: response.counter
        };
      }),
      catchError(() => EMPTY)
    );
  }


  voteComment(commentId: number, type: 1 | -1) {
    const url = `${this.baseUrl}/comments/${commentId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { type }, { headers });
  }


  removeCommentVote(commentId: number) {
    const url = `${this.baseUrl}/comments/${commentId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.delete(url, { headers });
  }


  getCommentVote(commentId: number) {
    const url = `${this.baseUrl}/comments/${commentId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.get<{ votes: VoteComment, counter: number }>(url, { headers }).pipe(
      catchError(() => EMPTY)
    );
  }
}
