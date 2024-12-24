import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestService } from '../../services/rest/rest.service';
import { Post } from '../../../data';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { VotePostHomepageComponent } from "../vote-post-homepage/vote-post-homepage.component";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, VotePostHomepageComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'] 
})
export class PostListComponent {
  auth = inject(AuthService);
  private readonly rest = inject(RestService);
  private readonly router = inject(Router);

  currPage = 1;
  currPagePosts: Post[] = [];
  posts: Post[] = [];

  sortBy = {
    mostRecent: (post1: Post, post2: Post) => post2.createdAt.getTime() - post1.createdAt.getTime(),
    mostPopular: (post1: Post, post2: Post) => post2.Likes - post1.Likes,
    mostUnpopular: (post1: Post, post2: Post) => post1.Dislikes - post2.Dislikes,
    mostControversial: (post1: Post, post2: Post) => {
      const totalVotes1 = post1.Likes + post1.Dislikes;
      const totalVotes2 = post2.Likes + post2.Dislikes;
      if (totalVotes1 === 0 && totalVotes2 === 0) {
        return 0;
      }
      if (totalVotes1 === 0) {
        return 1;
      }
      if (totalVotes2 === 0) {
        return -1;
      }

      const ratio1 = post1.Likes / totalVotes1;
      const ratio2 = post2.Likes / totalVotes2;
      if (ratio1 < 0.30 && ratio2 >= 0.30) {
        return 1;
      }
      if (ratio1 >= 0.30 && ratio2 < 0.30) {
        return -1;
      }

      if (Math.floor(Math.log(totalVotes1)) > Math.floor(Math.log(totalVotes2))) {
        return -1;
      }
      if (Math.floor(Math.log(totalVotes2)) > Math.floor(Math.log(totalVotes1))) {
        return 1;
      }

      return Math.abs(post1.Likes - post1.Dislikes) - Math.abs(post2.Likes - post2.Dislikes);
    },
  };

  currentSortFunction = this.sortBy.mostRecent; 

  ngOnInit() {
    this.rest.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.sortAndUpdatePosts(); 
      },
    });
  }

  sortPosts(sortingFunction: (post1: Post, post2: Post) => number) {
    this.currentSortFunction = sortingFunction; 
    this.sortAndUpdatePosts(); 
  }

  private sortAndUpdatePosts() { 
    this.posts.sort(this.currentSortFunction); 
    this.updateCurrPagePosts(); 
  }

  private updateCurrPagePosts() { 
    const start = (this.currPage - 1) * 10;
    const end = this.currPage * 10;
    this.currPagePosts = this.posts.slice(start, end);
  }

  pageLeft() {
    if (this.currPage > 1) {
      this.currPage--;
      this.updateCurrPagePosts(); 
    }
  }

  pageRight() {
    if (this.currPage < Math.ceil(this.posts.length / 10)) {
      this.currPage++;
      this.updateCurrPagePosts(); 
    }
  }
}