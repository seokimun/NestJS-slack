import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Workspaces } from '../entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(Workspaces)
        private readonly workspacesRepository: Repository<Workspaces>,
        @InjectRepository(Channels)
        private readonly channelsRepository: Repository<Channels>,
        @InjectRepository(WorkspaceMembers)
        private readonly workspaceMembersRepository: Repository<WorkspaceMembers>,
        @InjectRepository(ChannelMembers)
        private readonly channelMembersRepository: Repository<ChannelMembers>,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {}

    async findById(id: number) {
        return this.workspacesRepository.findOne({ where: { id } });
    }

    async findMyWorkspaces(myId: number) {
        return this.workspacesRepository.find({
            where: {
                WorkspaceMembers: [{ UserId: myId }],
            },
        });
    }

    async createWorkspace(name: string, url: string, myId: number) {
        const workspace = this.workspacesRepository.create({
            name,
            url,
            OwnerId: myId,
        });
        await this.workspacesRepository.save(workspace);

        const workspacemembers = this.workspaceMembersRepository.create({
            UserId: myId,
            WorkspaceId: workspace.id,
        });
        await this.workspaceMembersRepository.save(workspacemembers);

        const channel = this.channelsRepository.create({
            name: '일반',
            WorkspaceId: workspace.id,
        });
        await this.channelsRepository.save(channel);

        const channelmembers = this.channelMembersRepository.create({
            UserId: myId,
            ChannelId: channel.id,
        });
        await this.channelMembersRepository.save(channelmembers);
    }

    async getWorkspaceMembers(url: string) {
        this.usersRepository
            .createQueryBuilder('users')
            .innerJoin('user.WorkspaceMembers', 'members')
            .innerJoin(
                'members.Worksapce',
                'workspace',
                'workspace.url = :url',
                { url },
            )
            .getMany();
    }

    async getWorkspaceMember(url: string, id: number) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .innerJoin(
                'user.Workspaces',
                'workspaces',
                'workspaces.url = :url',
                {
                    url,
                },
            )
            .getOne();
    }

    async createWorkspaceMembers(url, email) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
            join: {
                alias: 'workspace',
                innerJoinAndSelect: {
                    channels: 'workspace.Channels',
                },
            },
        });
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const workspaceMember = new WorkspaceMembers();
        workspaceMember.WorkspaceId = workspace.id;
        workspaceMember.UserId = user.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers();
        channelMember.ChannelId = workspace.Channels.find(
            (v) => v.name === '일반',
        ).id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
}
