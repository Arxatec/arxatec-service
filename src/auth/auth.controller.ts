import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'This endpoint allows users to register by providing the necessary details.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        email: 'user@example.com',
        fullName: 'John Doe',
        roles: ['user'],
        createdAt: '2024-08-28T12:00:00.000Z',
        updatedAt: '2024-08-28T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'User login',
    description:
      'This endpoint allows users to login by providing email and password.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Access private route with Auth decorator',
    description:
      'This endpoint allows access to a private route for authenticated users with specific roles using the Auth decorator.',
  })
  @ApiResponse({
    status: 200,
    description: 'Private route accessed successfully',
    schema: {
      example: {
        ok: true,
        user: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          email: 'user@example.com',
          fullName: 'John Doe',
          roles: ['super-user'],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('check-auth-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check authentication status',
    description:
      'This endpoint checks the current authentication status of the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication status checked successfully',
    schema: {
      example: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        email: 'user@example.com',
        fullName: 'John Doe',
        roles: ['user'],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
