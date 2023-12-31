import { Service } from "typedi";
import { IPostService } from "./interface/post-service.interface";
import { PostRepository } from "./repository/post.repository";
import { CreatePostDto } from "./dto/create.post.dto";
import { Post } from "./entity/post.entity";
import { Transactional } from "../../common/decorator/transaction.decorator";
import { Release } from "../../common/decorator/connection.release.decorator";

@Service()
class PostService implements IPostService {
  constructor(private readonly postRepository: PostRepository) {}

  @Release()
  async getPost(postId: number): Promise<Post> {
    return this.postRepository.findByIdOrThrow(postId);
  }

  @Transactional()
  async createPost(createPostDto: CreatePostDto): Promise<boolean> {
    const { authorId, content, title } = createPostDto;

    const post = new Post(authorId, title, content);
    return this.postRepository.create(post);
  }

  @Transactional()
  async deletePost(postId: number): Promise<boolean> {
    return this.postRepository.softDelete(postId);
  }
}

export default PostService;
