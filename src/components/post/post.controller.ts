import { NextFunction, Response, Request } from "express";
import { Service } from "typedi";
import { tryCatch } from "../../common/decorator/try-catch.decorator";
import PostService from "./post.service";
import { CreatePostDTO } from "./dto/create.post.dto";
import { CustomRequest } from "../../types/common";
import { BadRequestException } from "../../common/exception/badRequest.exception";
import statusCode from "../../common/constant/statusCode";
import util from "../../common/util/response.util";

@Service()
class PostController {
  constructor(private readonly postService: PostService) {}

  @tryCatch()
  async createPost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.userId) throw new BadRequestException("don't exist userId");

    const { title, content } = req.body;
    const createPostDto = new CreatePostDTO(req.userId, title, content);

    await this.postService.createPost(createPostDto);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED));
  }
}

export default PostController;
