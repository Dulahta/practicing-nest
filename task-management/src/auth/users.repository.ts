import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.repository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.repository.save(user);
    } catch (error: any) {
      // Handle errors, such as duplicate username
      if (error.code === '23505') {
        // Unique violation error code for PostgreSQL
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  async findOne(where: any): Promise<User | null> {
    return this.repository.findOne(where);
  }
}
