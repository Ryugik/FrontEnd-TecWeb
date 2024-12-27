import { Component, Input, OnInit, inject } from '@angular/core';
import { Comment } from '../../../data';
import { RestService } from '../../services/rest/rest.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote-comment',
  standalone: true,
  templateUrl: './vote-comment.component.html',
  styleUrls: ['./vote-comment.component.scss']
})
export class VoteCommentComponent implements OnInit {
  @Input() comment!: Comment;

  userVote: "Like" | "Dislike" | null = null;
  likes = 0;
  dislikes = 0;

  private rest = inject(RestService);
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.updateVoteCounts();
    this.rest.getCommentVote(this.comment.idComment).subscribe({
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
    this.likes = this.comment.voteComment.filter(vote => vote.type === "Like").length;
    this.dislikes = this.comment.voteComment.filter(vote => vote.type === "Dislike").length;
  }

  likeComment() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === "Like") {
      this.removeVote();
      return;
    }
    this.rest.voteComment(this.comment.idComment, "Like").subscribe({
      next: () => {
        this.likes++;
        if (this.userVote === "Dislike") {
          this.dislikes--;
        }
        this.userVote = "Like";
        this.updateVoteCounts();
      }
    });
  }

  dislikeComment() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === "Dislike") {
      this.removeVote();
      return;
    }
    this.rest.voteComment(this.comment.idComment, "Dislike").subscribe({
      next: () => {
        this.dislikes++;
        if (this.userVote === "Like") {
          this.likes--;
        }
        this.userVote = "Dislike";
        this.updateVoteCounts();
      }
    });
  }

  removeVote() {
    this.rest.removeCommentVote(this.comment.idComment).subscribe({
      next: () => {
        if (this.userVote === "Like") {
          this.likes--;
        }
        if (this.userVote === "Dislike") {
          this.dislikes--;
        }
        this.userVote = null;
        this.updateVoteCounts();
      }
    });
  }
}