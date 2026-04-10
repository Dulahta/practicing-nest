import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { IsPostOwnerGuard } from './guards/is-post-owner.guard';
import { PostEntity } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, IsPostOwnerGuard],
})
export class PostsModule {}
