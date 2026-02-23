import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface UpsertUserDto {
  clerkId: string;
  email: string;
  name: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async upsert(dto: UpsertUserDto): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { clerkId: dto.clerkId },
    });

    if (user) {
      user.email = dto.email;
      user.name = dto.name;
      return this.userRepository.save(user);
    }

    user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }
}
