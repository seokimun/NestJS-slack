import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'nickname'],
        });
        console.log(email, password, user);

        if (!user) {
            return null;
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const { password, ...userWithoutPassword } = user; // user정보에서 password만 가져온다
            return userWithoutPassword;
        }
        return null;
    }
}
