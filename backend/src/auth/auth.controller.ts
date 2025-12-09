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
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterEmployeeDto } from '../employee-profile/dto/register-employee.dto';




@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  

    // @Post()
    // @Roles(SystemRole.HR_MANAGER)
    // createEmployee(@Body() dto: RegisterEmployeeDto) {
    //     return this.svc.createEmployee(dto);
    // }


    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateEmployee(
            dto.workEmail,
            dto.password,
        );
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const { accessToken } = await this.authService.login(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // true in production (HTTPS)
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        console.log("Generated token:", accessToken);
        // const userId = user._id;
        // const userRolesTable =  

        return { message: 'Logged in successfully' };
    }


  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    return res.send({ logout: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Res() res: Response, @Body() body) {
    return res.send(res.req.user);
  }
}
