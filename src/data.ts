  export type User = {
    username:  string
  }
  
  
  export type Post = {
    idPost: number
    title: string
    description: string
    author: User
    createdAt: Date
    counter: number
    comments: Comment[]
  }
  
  
  export type Vote = {
    type: number
    voterUsername: string
    post: Post
  }
  
  
  export type Comment = {
    idComment: number 
    body: string
    authorComment: User
    postedOn?: Post
    createdAt: Date
    counter: number
  }
  
  
  export type VoteComment = {
    type: number
    voterComUsername: string
    commentId: number      
    voter: User   
  }