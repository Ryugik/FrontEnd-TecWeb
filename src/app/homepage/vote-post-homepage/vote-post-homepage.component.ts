import { Component, Input, OnInit, inject } from '@angular/core';
import { Post } from '../../../data';
import { RestService } from '../../services/rest/rest.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vote-post-homepage',
  standalone: true,
  templateUrl: './vote-post-homepage.component.html',
  styleUrls: ['./vote-post-homepage.component.scss']
})
export class VotePostHomepageComponent implements OnInit {
  private rest = inject(RestService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  @Input() post: Post = {
    idPost: 20,
    title: "Title",
    description: "Description",
    Likes: 0,
    Dislikes: 0,
    createdAt: new Date(Date.now()),
    author: {
      username: "Test User"
    },
    comments: []
  };

  userVote: "Like" | "Dislike" | null = null;
  upvotes = 0;
  downvotes = 0;

  ngOnInit() {
    this.updateVoteCounts();
    this.rest.getUserVote(this.post.idPost).subscribe({
      next: (vote) => {
        if (vote.type === "Like" || vote.type === "Dislike") {
          this.userVote = vote.type;
        } else {
          this.userVote = null;
        }
      }
    });
  }

  updateVoteCounts() {
    this.upvotes = this.post.Likes;
    this.downvotes = this.post.Dislikes;
  }

  upvotePost() {
    if (!this.auth.checkAuth()) {
      this.toastr.error("Fai il login prima di mettere mi piace");
      this.router.navigate(['/login']);
      return;
    }
    this.rest.votePost(this.post.idPost, "Like").subscribe({
      next: () => {
        this.post.Likes++;
        if (this.userVote === "Dislike") {
          this.post.Dislikes--;
        }
        this.userVote = "Like";
        this.updateVoteCounts();
      }
    });
  }

  downvotePost() {
    if (!this.auth.checkAuth()) {
      this.toastr.error("Fai il login prima di mettere non mi piace");
      this.router.navigate(['/login']);
      return;
    }
    this.rest.votePost(this.post.idPost, "Dislike").subscribe({
      next: () => {
        this.post.Dislikes++;
        if (this.userVote === "Like") {
          this.post.Likes--;
        }
        this.userVote = "Dislike";
        this.updateVoteCounts();
      }
    });
  }

  removeVote() {
    this.rest.removeVote(this.post.idPost).subscribe({
      next: () => {
        if (this.userVote === "Like") {
          this.post.Likes--;
        }
        if (this.userVote === "Dislike") {
          this.post.Dislikes--;
        }
        this.userVote = null;
        this.updateVoteCounts();
      }
    });
  }
}