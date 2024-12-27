import { Component, Input } from '@angular/core';
import { Comment } from '../../../data';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment: Comment = {
    body: "body",
    idComment: 1,
    createdAt: new Date(),
    authorComment: { username: "User" },
  } as Comment;
}