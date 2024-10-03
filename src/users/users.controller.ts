import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    getUsers() {}

    @Post()
    postUsers() {}

    @Post('login')
    logInb() {}

    @Post('logout')
    logOut() {}
}
