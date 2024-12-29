import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestService } from '../../!services/rest/rest.service';
import { Comment } from '../../../data';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../!services/auth/auth.service';
import { VoteCommentComponent } from "../vote-comment/vote-comment.component";


@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, RouterLink, VoteCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {

    auth = inject(AuthService);
    private readonly restService = inject(RestService);
    readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
  
    currPage = 1;
    currPageComments: Comment[] = [];
    postComments: Comment[] = [];
    author: string | null = null;
    body: string = '';
    id: number = 0;
  
  

      sortBy = {
        mostRecent: (comment1: Comment, comment2: Comment) => comment2.createdAt.getTime() - comment1.createdAt.getTime(),
        mostPopular: (comment1: Comment, comment2: Comment) => comment2.counter - comment1.counter,
        mostUnpopular: (comment1: Comment, comment2: Comment) => comment1.counter - comment2.counter,
        mostControversial: (comment1: Comment, comment2: Comment) => {
          const totalVotes1 = comment1.counter + comment1.counter;
          const totalVotes2 = comment2.counter + comment2.counter;
          if (totalVotes1 === 0 && totalVotes2 === 0) {
            return 0;
          }
          if (totalVotes1 === 0) {
            return 1;
          }
          if (totalVotes2 === 0) {
            return -1;
          }
    
          const ratio1 = comment1.counter / totalVotes1;
          const ratio2 = comment2.counter / totalVotes2;
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
    
          return Math.abs(comment1.counter - comment1.counter) - Math.abs(comment2.counter - comment2.counter);
        },
      };

  
    ngOnInit() {
      const idPost = this.route.snapshot.params['idPost'];
        this.restService.getComments(idPost).subscribe({
          next: (comment) => {
            this.postComments = comment;
            this.id = idPost;
            console.log(this.id);
            console.log(this.postComments);
            this.sortAndUpdateComments();
          }
        });


    }

    currentSortFunction = this.sortBy.mostRecent; 
  
  
    sortComments(sortingFunction: (comment1: Comment, comment2: Comment) => number) {
        this.currentSortFunction = sortingFunction; 
        this.sortAndUpdateComments(); 
      }
    
    
      private sortAndUpdateComments() { 
        this.postComments.sort(this.currentSortFunction); 
        this.updateCurrPageComments(); 
      }
    
    
      private updateCurrPageComments() { 
        const start = (this.currPage - 1) * 10;
        const end = this.currPage * 10;
        this.currPageComments = this.postComments.slice(start, end);
      }
    
    
      pageLeft() {
        if (this.currPage > 1) {
          this.currPage--;
          this.updateCurrPageComments(); 
        }
      }
    
    
      pageRight() {
        if (this.currPage < Math.ceil(this.postComments.length / 10)) {
          this.currPage++;
          this.updateCurrPageComments(); 
        }
      }
    }