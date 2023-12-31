import { NextFunction, Response, Request } from "express";
import { Service } from "typedi";
import PostService from "./post.service";
import { CustomRequest } from "../../types/common";
import { BadRequestException } from "../../common/exception/badRequest.exception";
import statusCode from "../../common/constant/statusCode";
import { TryCatch } from "../../common/decorator/try-catch.decorator";
import { ExecutionContext } from "../../common/exception/execution.context";

@Service()
class PostController extends ExecutionContext<PostController> {
  constructor(private readonly postService: PostService) {
    super(PostController);
  }

  @TryCatch(statusCode.OK)
  async getPost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.parsedId)
      throw new BadRequestException(
        `postId don't exist`,
        this.getClass(),
        "getPost"
      );

    return this.postService.getPost(req.parsedId);
  }

  @TryCatch(statusCode.CREATED)
  async createPost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.userId)
      throw new BadRequestException(
        "don't exist userId",
        this.getClass(),
        "createPost"
      );

    return this.postService.createPost(req.body);
  }

  @TryCatch(statusCode.OK)
  async deletePost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.parsedId)
      throw new BadRequestException(
        `postId don't exist`,
        this.getClass(),
        "deletePost"
      );

    return this.postService.deletePost(req.parsedId);
  }
}

export default PostController;
