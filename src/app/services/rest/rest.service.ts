import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post, Vote, Comment, VoteComment } from '../../../data';
import { AuthService } from '../auth/auth.service';
import { map, catchError, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private baseUrl = 'http://localhost:3000';
  private http: HttpClient;
  private authService: AuthService;

  constructor(http: HttpClient, auth: AuthService) {
    this.http = http;
    this.authService = auth;
  }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({ 'Autorizzazione': token as string });
    } else {
      return new HttpHeaders();
    }
  }

  login(credentials: { username: string; password: string }) {
    const url = `${this.baseUrl}/login`;
    return this.http.post(url, credentials, { headers: this.getAuthHeaders() });
  }

  logout() {
    const url = `${this.baseUrl}/logout`;
    const headers = this.getAuthHeaders(); 
    return this.http.post(url, {}, { headers });
  }

  registrazione(credentials: { username: string; password: string }) {
    const url = `${this.baseUrl}/registrazione`;
    return this.http.post(url, credentials, { headers: this.getAuthHeaders() });
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

  createPost(title: string, description: string) {
    const url = `${this.baseUrl}/posts`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { title, description }, { headers });
  }

  deletePost(id: number) {
    const url = `${this.baseUrl}/posts/${id}`;
    const headers = this.getAuthHeaders();
    return this.http.delete(url, { headers });
  }

  votePost(id: number, type: 'Like' | 'Dislike') {
    const url = `${this.baseUrl}/posts/${id}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { type }, { headers });
  }

  removeVote(id: number) {
    const url = `${this.baseUrl}/posts/${id}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.delete(url, { headers });
  }

  getComments(postId: number) {
    const url = `${this.baseUrl}/posts/${postId}/comments`;
    return this.http.get<Comment[]>(url);
  }

  addComment(postId: number, body: string) {
    const url = `${this.baseUrl}/posts/${postId}/comments`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { body }, { headers });
  }

  getUserVote(postId: number) {
    const url = `${this.baseUrl}/posts/${postId}/votes`;
    const headers = this.getAuthHeaders();
    return this.http.get<Vote>(url, { headers }).pipe(
      catchError(() => EMPTY)
    );
  }

  voteComment(commentId: number, type: 'Like' | 'Dislike') {
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
    return this.http.get<VoteComment>(url, { headers }).pipe(
      catchError(() => EMPTY)
    );
  }
}
