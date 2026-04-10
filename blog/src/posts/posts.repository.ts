import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
  ) {}

  getPosts(): Promise<PostEntity[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findById(id: string): Promise<PostEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByIdWithAuthor(id: string): Promise<PostEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });
  }

  async createPost(
    createPostDto: CreatePostDto,
    author: User,
  ): Promise<PostEntity> {
    const post = this.repository.create({
      ...createPostDto,
      author,
    });

    return this.repository.save(post);
  }

  save(post: PostEntity): Promise<PostEntity> {
    return this.repository.save(post);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
