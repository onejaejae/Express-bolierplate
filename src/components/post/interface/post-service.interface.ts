import { CreatePostDTO } from "../dto/create.post.dto";

export interface IPostService {
  createPost(createPostDto: CreatePostDTO): any;
}
