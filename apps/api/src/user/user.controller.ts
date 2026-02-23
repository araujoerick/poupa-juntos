import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getAuth } from '@clerk/express';
import type { Request } from 'express';
import { Req } from '@nestjs/common';
import { UserService } from './user.service';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

class UpsertUserBody {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me')
  async upsertMe(@Req() req: Request, @Body() body: UpsertUserBody) {
    const { userId } = getAuth(req);
    return this.userService.upsert({
      clerkId: userId!,
      email: body.email,
      name: body.name,
    });
  }
}
