import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { Users } from '../entities/Users';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    getMyWorkspaces(@User() user: Users) {
        return this.workspacesService.findMyWorkspaces(user.id);
    }

    @Post()
    createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
        return this.workspacesService.createWorkspace(
            body.workspace,
            body.url,
            user.id,
        );
    }

    @Get(':url/members')
    getAllMembersFromWorkspace() {}

    @Post(':url/members')
    inviteMembersToWorkspace() {}

    @Delete(':url/members/:id')
    kickMemberFromWorkspace() {}

    @Get(':url/members/:id')
    DEPRECATE_getMemberInfoInWorkspace() {}
}
