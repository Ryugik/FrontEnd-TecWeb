import { Component, inject, Input, OnInit } from '@angular/core';
import { Post } from '../../../data';
import { RouterLink } from '@angular/router';
import { RestService } from '../../services/rest/rest.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-vote-post-homepage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vote-post-homepage.component.html',
  styleUrls: ['./vote-post-homepage.component.scss']
})
export class VotePostHomepageComponent implements OnInit {
  private rest = inject(RestService);
  auth = inject(AuthService);

  @Input() post: Post = {
    idPost: 20,
    title: "Title",
    description: "Description",
    Likes: 0,
    Dislikes: 0,
    createdAt: new Date(1721002952),
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