/**import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../!services/auth/auth.service';
import { RestService } from '../../!services/rest/rest.service';
import { Post, Comment } from '../../../data';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommentComponent } from '../../comments/comment/comment.component';
import { VoteCommentComponent } from '../../comments/vote-comment/vote-comment.component';
import {}

@Component({
  selector: 'app-vedi-post',
  standalone: true,
  imports: [CommonModule, CommentComponent, VoteCommentComponent],
  templateUrl: './vedi-post.component.html',
  styleUrls: ['./vedi-post.component.scss']
})
export class VediPostComponent implements OnInit {

  post: Post = {
    idPost: 6,
    title: "test",
    description: "test23",
    counter: 0,
    createdAt: new Date(Date.now()),
    author: { username: "userr" },
    comments: []
  };


  postComments: Comment[] = [];
  userVote: number | null = null;


    public auth = inject(AuthService);
    private rest = inject(RestService);
    private router = inject(Router);
    private toastr = inject(ToastrService)
    private actRoute = inject(ActivatedRoute);


  ngOnInit() {
    const postID = this.actRoute.snapshot.params['id'];
    this.rest.getPostById(postID).subscribe({
      next: (post) => {
        this.post = post;
      }
    });
    this.loadComments();

    this.rest.getUserVote(this.post.idPost).subscribe({
      next: (response) => {
        const { votes, counter } = response;
        this.post.counter = counter;
        const userVote = votes.find(vote => vote.voterUsername === this.auth.getUsername());
        this.userVote = userVote ? userVote.type : null;
      }      
    });

  }


  loadComments() {
    this.rest.getComments(this.post.idPost).subscribe((comments) => {
      this.postComments = comments.map(comment => ({
        ...comment,
        relativeTime: new Date(comment.createdAt).toLocaleDateString()
      }));
    });
  }


  onLikePost() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === 1) {
      this.onCancelVote();
      return;
    }
    this.rest.votePost(this.post.idPost, 1).subscribe(() => {
      this.post.counter += (this.userVote === -1) ? 2 : 1;
      this.userVote = 1;
    });
  }


  onDislikePost() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === -1) {
      this.onCancelVote();
      return;
    }
    this.rest.votePost(this.post.idPost, -1).subscribe(() => {
    this.userVote = -1;
    this.post.counter -= (this.userVote === 1) ? 2 : 1;
    });
  }


  onCancelVote() {
    this.rest.removeVote(this.post.idPost).subscribe(() => {
    this.post.counter += (this.userVote === 1) ? -1 : 1;
    this.userVote = null;
    });
  }

  onDeletePost() {
    this.rest.deletePost(this.post.idPost).subscribe({
      next: () => {
        this.toastr.success('Post eliminato con successo!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.toastr.error('Errore durante l\'eliminazione del post. Riprova.');
      }
    });
  }


  updateComments() {
    this.loadComments();
  }
  

  trackByCommentId(index: number, comment: Comment) {
    return comment.idComment;
  }

}