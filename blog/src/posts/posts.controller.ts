import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPostOwnerGuard } from './guards/is-post-owner.guard';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Returns every blog post ordered from newest to oldest.',
  })
  @ApiOkResponse({
    description: 'List of blog posts.',
    type: PostResponseDto,
    isArray: true,
  })
  getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Returns a single public post.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the post.',
    example: '8d4a4455-6108-4337-897a-d95f4a2d6320',
  })
  @ApiOkResponse({
    description: 'Requested post.',
    type: PostResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a post',
    description: 'Creates a new post owned by the authenticated user.',
  })
  @ApiCreatedResponse({
    description: 'Post created successfully.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed for the post body.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token.',
  })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto, user);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, IsPostOwnerGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update a post',
    description:
      'Updates a post owned by the authenticated user. At least one field must be provided.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the post to update.',
    example: '8d4a4455-6108-4337-897a-d95f4a2d6320',
  })
  @ApiOkResponse({
    description: 'Post updated successfully.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or the body was empty.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token.',
  })
  @ApiForbiddenResponse({
    description: 'The authenticated user does not own this post.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, IsPostOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Deletes a post owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the post to delete.',
    example: '8d4a4455-6108-4337-897a-d95f4a2d6320',
  })
  @ApiNoContentResponse({
    description: 'Post deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token.',
  })
  @ApiForbiddenResponse({
    description: 'The authenticated user does not own this post.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  deletePost(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.postsService.deletePost(id, user);
  }
}
