import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(WorkspaceMembers)
        private readonly workspaceMembersRepository: Repository<WorkspaceMembers>,
        @InjectRepository(ChannelMembers)
        private readonly channelMembersRepository: Repository<ChannelMembers>,
    ) {}
    getUser() {}

    async postUsers(email: string, nickname: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new UnauthorizedException('이미 존재하는 사용자입니다');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await this.userRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });
        await this.workspaceMembersRepository.save({
            UserId: result.id,
            WorkspaceId: 1,
        });
        await this.channelMembersRepository.save({
            UserId: result.id,
            ChannelId: 1,
        });
        return true;
    }
}
