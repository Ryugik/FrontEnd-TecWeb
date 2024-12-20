  export type User = {
    username:  string
  }
  
  
  export type Post = {
    idPost: number
    title: string
    description: string
    author: User
    createdAt: Date
    creatorPost: User
    Likes: number
    Dislikes: number
    comments: Comment[]
  
  }
  
  
  export type Vote = {
    type: "Like" | "Dislike" | 0
    voterUsername: string
    post: Post
  }
  
  
  export type Comment = {
    idComment: number 
    body: string
    postedOnId: number
    authorComment: User
    postedOn: Post
    voteComment: VoteComment[]
  }
  
  
  export type VoteComment = {
    type: "Like" | "Dislike" | 0
    voterComUsername: string
    commentId: number      
    voter: User   
  }