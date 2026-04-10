import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../auth/user.entity';
import { PostsService } from '../posts.service';

interface OwnerRequest extends Request {
  user: User;
}

@Injectable()
export class IsPostOwnerGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OwnerRequest>();
    const user = request.user;
    const postId = request.params.id;

    const post = await this.postsService.getPostWithAuthorById(postId);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('You do not own this post');
    }

    return true;
  }
}
