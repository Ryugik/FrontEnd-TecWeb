import { Component, Input, OnInit, inject } from '@angular/core';
import { Post } from '../../../data';
import { RestService } from '../../!services/rest/rest.service';
import { AuthService } from '../../!services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-post-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-post-homepage.component.html',
  styleUrls: ['./vote-post-homepage.component.scss']
})
export class VotePostHomepageComponent implements OnInit {
  private rest = inject(RestService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  @Input() post: Post = {
    idPost: 6,
    title: "test",
    description: "test23",
    counter: 0,
    createdAt: new Date(Date.now()),
    author: { username: "userr" },
    comments: []
  };

  userVote: number | null = null;

  ngOnInit() {

    this.rest.getPostById(this.post.idPost).subscribe({
      next: (post) => {
        this.post.counter = post.counter
      }
    });


    this.rest.getUserVote(this.post.idPost).subscribe({
      next: (response) => {
        const { votes, counter } = response;
        this.post.counter = counter;
        const userVote = votes.find(vote => vote.voterUsername === this.auth.getUsername());
        this.userVote = userVote ? userVote.type : null;
      }      
    });
  }


upvotePost() {
    if (!this.auth.checkAuth()) {
      this.toastr.error("Fai il login prima di mettere mi piace");
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === 1) {
      this.removeVote();
      return;
    }
    this.rest.votePost(this.post.idPost, 1).subscribe({
      next: () => {
        this.post.counter += (this.userVote === -1) ? 2 : 1;
        this.userVote = 1;
      }
    }); 
  }


  downvotePost() {
     if (!this.auth.checkAuth()) {
      this.toastr.error("Fai il login prima di mettere non mi piace");
      this.router.navigate(['/login']);
      return;
    }
    if (this.userVote === -1) {
      this.removeVote();
      return;
    }
    this.rest.votePost(this.post.idPost, -1).subscribe({
      next: () => {
        this.post.counter -= (this.userVote === 1) ? 2 : 1;
        this.userVote = -1;
      }
    }); 
  }


  removeVote() {
     this.rest.removeVote(this.post.idPost).subscribe({
      next: () => {
        if(this.userVote === 1 || this.userVote === -1){
        this.post.counter += (this.userVote === 1) ? -1 : 1;
        this.userVote = 0;
       }
     }}); 
  }
}