export interface Post {
  _id: string;
  title: string;
  content: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  image: {
    url: string;
    public_id: string;
  };
  author: User | string; // Can be either populated User or just ID
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username?: string;
  email?: string;
  image?: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User; 
  createdAt: string | Date;
  updatedAt?: string | Date;
}





