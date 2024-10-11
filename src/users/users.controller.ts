import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import {
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { User } from '../common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { LocalAuthGuard } from '../auth/guard/local-auth.guard';
import { LoggedInGuard } from '../auth/guard/logged-in.guard';
import { NotLoggedInGuard } from '../auth/guard/not-logged-in.guard';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({
        description: '성공',
        type: UserDto,
    })
    @ApiResponse({
        status: 500,
        description: '서버에러',
    })
    @ApiOperation({ summary: '내 정보 조회' })
    @Get()
    getUsers(@User() user) {
        return user || false;
    }

    @UseGuards(NotLoggedInGuard)
    @ApiOperation({ summary: '회원가입' })
    @Post()
    async postUsers(@Body() body: JoinRequestDto) {
        await this.usersService.postUsers(
            body.email,
            body.nickname,
            body.password,
        );
    }

    @ApiOkResponse({
        status: 200,
        description: '성공',
        type: UserDto,
    })
    @ApiOperation({ summary: '로그인' })
    @Post('login')
    @UseGuards(LocalAuthGuard)
    logIn(@User() user) {
        return user;
    }

    @UseGuards(LoggedInGuard)
    @ApiOperation({ summary: '로그아웃' })
    @Post('logout')
    logOut(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
}
