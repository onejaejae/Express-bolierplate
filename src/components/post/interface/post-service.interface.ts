import { CreatePostDTO } from "../dto/create.post.dto";
import { Post } from "../entity/post.entity";

export interface IPostService {
  getPost(postId: number): Promise<Post>;
  createPost(createPostDto: CreatePostDTO): Promise<boolean>;
  deletePost(postId: number): Promise<boolean>;
}
