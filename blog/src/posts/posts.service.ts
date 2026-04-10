import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  getPosts(): Promise<PostEntity[]> {
    return this.postsRepository.getPosts();
  }

  async getPostById(id: string): Promise<PostEntity> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  createPost(
    createPostDto: CreatePostDto,
    author: User,
  ): Promise<PostEntity> {
    return this.postsRepository.createPost(createPostDto, author);
  }

  async getPostWithAuthorById(id: string): Promise<PostEntity> {
    const post = await this.postsRepository.findByIdWithAuthor(id);

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<PostEntity> {
    if (
      updatePostDto.title === undefined &&
      updatePostDto.content === undefined
    ) {
      throw new BadRequestException(
        'At least one field (title or content) must be provided',
      );
    }

    const post = await this.getPostWithAuthorById(id);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('You do not own this post');
    }

    if (updatePostDto.title !== undefined) {
      post.title = updatePostDto.title;
    }

    if (updatePostDto.content !== undefined) {
      post.content = updatePostDto.content;
    }

    return this.postsRepository.save(post);
  }

  async deletePost(id: string, user: User): Promise<void> {
    const post = await this.getPostWithAuthorById(id);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('You do not own this post');
    }

    await this.postsRepository.delete(post.id);
  }
}
