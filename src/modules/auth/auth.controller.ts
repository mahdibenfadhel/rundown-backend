import {
  Controller,
  Body,
  Param,
  Post,
  UseGuards,
  Get,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, LoginPayload, RegisterPayload } from './';
import { UsersService } from './../user';

@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    const user = await this.userService.create(payload);
    return await this.authService.createToken(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() request): Promise<any> {
    return request.user;
  }

  @Get('users')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsers(): Promise<any> {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('usersSinceLastWeek')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sinceLastWeek(@Request() request): Promise<any> {
    return this.userService.sinceLastWeek();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('delete/:userId')
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteOrdersFromUser(@Param('userId') userId,): Promise<any> {
    return await this.userService.deleteUser(userId);
  }
}
