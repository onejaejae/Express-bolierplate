import { Service } from "typedi";
import { IPostService } from "./interface/post-service.interface";
import { PostRepository } from "./repository/post.repository";
import { CreatePostDTO } from "./dto/create.post.dto";
import { Post } from "./entity/post.entity";
import { Transactional } from "../../common/decorator/transaction.decorator";

@Service()
class PostService implements IPostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getPost(postId: number) {
    return this.postRepository.findByIdOrThrow(postId);
  }

  @Transactional()
  async createPost(createPostDto: CreatePostDTO) {
    const { authorId, content, title } = createPostDto;

    const post = new Post(authorId, title, content);
    return this.postRepository.create(post);
  }

  @Transactional()
  async deletePost(postId: number) {
    return this.postRepository.softDelete(postId);
  }
}

export default PostService;
