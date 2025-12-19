import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Roles } from './decorator/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterEmployeeDto } from '../employee-profile/dto/register-employee.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';




@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: RegisterEmployeeDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);

    // Set JWT cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'Employee registered successfully', user: result.user };
  }

  @Post('register/candidate')
  async registerCandidate(@Body() dto: RegisterCandidateDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.registerCandidate(dto);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'Candidate registered successfully', token: result.accessToken, user: result.user };
  }


  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(
      dto.workEmail,
      dto.password,
      dto.userType,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { accessToken } = await this.authService.login(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true in production (HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    console.log("Generated token:", accessToken);

    return { message: 'Logged in successfully', token: accessToken, userType: user.userType };
  }


  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    return res.send({ logout: true });
  }

  @Get('me')
  @Roles() // Allow any authenticated user
  @UseGuards(JwtAuthGuard)
  async me(@Res() res: Response, @Body() body) {
    console.log('[AuthController /me] Request user:', res.req.user);
    const userProfile = await this.authService.getUserProfile(res.req.user as unknown as any);
    console.log('[AuthController /me] Returning profile:', userProfile);
    console.log('[AuthController /me] Profile picture URL:', userProfile.profilePictureUrl);
    return res.send(userProfile);
  }
}
