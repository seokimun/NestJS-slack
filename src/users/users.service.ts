import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) {}
    getUser() {}

    async postUsers(email: string, nickname: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new UnauthorizedException('이미 존재하는 사용자입니다');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await this.userRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
    }
}
