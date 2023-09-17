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
  async getPost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.parsedId) throw new BadRequestException(`postId don't exist`);

    const post = await this.postService.getPost(req.parsedId);
    return res.status(statusCode.OK).send(util.success(statusCode.OK, post));
  }

  @tryCatch()
  async createPost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.userId) throw new BadRequestException("don't exist userId");

    await this.postService.createPost(req.body);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED));
  }

  @tryCatch()
  async deletePost(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.parsedId) throw new BadRequestException(`postId don't exist`);

    await this.postService.deletePost(req.parsedId);
    return res.status(statusCode.OK).send(util.success(statusCode.OK));
  }
}

export default PostController;
