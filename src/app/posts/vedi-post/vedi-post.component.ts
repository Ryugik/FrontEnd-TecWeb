import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { RestService } from '../../services/rest/rest.service';
import { Post, Comment } from '../../../data';
import { marked } from 'marked';
import { formatDistanceToNow } from 'date-fns';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommentComponent } from '../../comments/comment/comment.component';
import { VoteCommentComponent } from '../../comments/vote-comment/vote-comment.component';

@Component({
  selector: 'app-vedi-post',
  standalone: true,
  imports: [CommonModule, CommentComponent, VoteCommentComponent],
  templateUrl: './vedi-post.component.html',
  styleUrls: ['./vedi-post.component.scss']
})
export class VediPostComponent implements OnInit {
  @Input() post: Post = {
      idPost: 1,
      title: "Titolo",
      description: "descr",
      author: {username: "User"},
      createdAt: new Date(Date.now()),
      Likes: 0,
      Dislikes: 0,
      comments: []
    } as Post;

  postComments: Comment[] = [];
  userVote: string | null = null;
  likePercent: number = 0;
  dislikePercent: number = 0;
  parsedDescription: string = '';
  relativeTime: string = '';

  constructor(
    public auth: AuthService,
    private rest: RestService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.updateVoteCounts();
    this.loadComments();
    this.parsedDescription = marked(this.post.description) as string;
    this.relativeTime = formatDistanceToNow(new Date(this.post.createdAt), { addSuffix: true });
  }

  updateVoteCounts() {
    const totalVotes = this.post.Likes + this.post.Dislikes;
    this.likePercent = (this.post.Likes / totalVotes) * 100;
    this.dislikePercent = (this.post.Dislikes / totalVotes) * 100;
  }

  loadComments() {
    this.rest.getComments(this.post.idPost).subscribe((comments) => {
      this.postComments = comments.map(comment => ({
        ...comment,
        relativeTime: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
      }));
    });
  }

  onLikePost() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    this.rest.votePost(this.post.idPost, 'Like').subscribe(() => {
      this.post.Likes++;
      if (this.userVote === 'Dislike') {
        this.post.Dislikes--;
      }
      this.userVote = 'Like';
      this.updateVoteCounts();
    });
  }

  onDislikePost() {
    if (!this.auth.checkAuth()) {
      this.router.navigate(['/login']);
      return;
    }
    this.rest.votePost(this.post.idPost, 'Dislike').subscribe(() => {
      this.post.Dislikes++;
      if (this.userVote === 'Like') {
        this.post.Likes--;
      }
      this.userVote = 'Dislike';
      this.updateVoteCounts();
    });
  }

  onCancelVote() {
    this.rest.removeVote(this.post.idPost).subscribe(() => {
      if (this.userVote === 'Like') {
        this.post.Likes--;
      }
      if (this.userVote === 'Dislike') {
        this.post.Dislikes--;
      }
      this.userVote = null;
      this.updateVoteCounts();
    });
  }

  onDeletePost() {
    this.rest.deletePost(this.post.idPost).subscribe(() => {
      this.toastr.success('Post eliminato con successo!');
      this.router.navigate(['/']);
    }, error => {
      this.toastr.error('Errore durante l\'eliminazione del post. Riprova.');
    });
  }

  updateComments() {
    this.loadComments();
  }

  trackByCommentId(comment: Comment) {
    return comment.idComment;
  }
}