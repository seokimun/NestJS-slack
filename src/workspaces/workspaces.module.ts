import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Channels } from '../entities/Channels';
import { Workspaces } from '../entities/Workspaces';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WorkspaceMembers,
            Channels,
            Workspaces,
            ChannelMembers,
            Users,
        ]),
    ],
    providers: [WorkspacesService],
    controllers: [WorkspacesController],
})
export class WorkspacesModule {}
