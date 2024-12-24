import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../post-list/post-list.component';
import { Post } from '../../../data';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [PostListComponent, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  posts: Post[] = [];


  }



