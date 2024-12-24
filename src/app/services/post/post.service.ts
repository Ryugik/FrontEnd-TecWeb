import { Injectable } from '@angular/core';
import { Post } from '../../../data';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];

  constructor() { }

  getAllPosts(): Post[] {
    return this.posts;
  }

  createPost(post: Post): void {
    this.posts.push(post);
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find(post => post.idPost === id);
  }
}