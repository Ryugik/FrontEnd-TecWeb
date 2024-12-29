import { Component, Input, OnInit, inject } from '@angular/core';
import { Comment } from '../../../data';
import { RestService } from '../../!services/rest/rest.service';
import { AuthService } from '../../!services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vote-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-comment.component.html',
  styleUrls: ['./vote-comment.component.scss']
})
export class VoteCommentComponent implements OnInit {

  private rest = inject(RestService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  @Input() comment: Comment = {
    idComment: 30,
    body: "test",
    authorComment: { username: "userr" },
    createdAt: new Date(Date.now()),
    counter: 0,
    voteComment: [],
  } as Comment;


  userVote: number | null = null;

  ngOnInit() {


    this.rest.getCommentVote(this.comment.idComment).subscribe({
      next: (response) => {
        const { votes, counter } = response;
        this.comment.counter = counter;
        const userVote = votes.find(voteComment => voteComment.voterComUsername === this.auth.getUsername());
        this.userVote = userVote ? userVote.type : null;
      }
    });
  }

  likeComment() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === 1) {
      this.removeVote();
      return;
    }
    this.rest.voteComment(this.comment.idComment, 1).subscribe({
      next: () => {
        this.comment.counter += (this.userVote === -1) ? 2 : 1;
        this.userVote = 1;
      }
    });
  }

  dislikeComment() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === -1) {
      this.removeVote();
      return;
    }
    this.rest.voteComment(this.comment.idComment, -1).subscribe({
      next: () => {
        this.comment.counter -= (this.userVote === 1) ? 2 : 1;
        this.userVote = -1;
      }
    });
  }

  removeVote() {
    this.rest.removeCommentVote(this.comment.idComment).subscribe({
      next: () => {
        this.comment.counter += (this.userVote === 1) ? -1 : 1;
        this.userVote = null;
      }
    });
  }
}