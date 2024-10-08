import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm';
import { Users } from './entities/Users';
import { Workspaces } from './entities/Workspaces';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { ChannelMembers } from './entities/ChannelMembers';
import { ChannelChats } from './entities/ChannelChats';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        WorkspacesModule,
        ChannelsModule,
        DmsModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            keepConnectionAlive: true,
            entities: [
                ChannelChats,
                ChannelMembers,
                Channels,
                DMs,
                Mentions,
                Users,
                WorkspaceMembers,
                Workspaces,
            ],
            migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
            seeders: [__dirname + '/src/database/seeds/**/*{.ts,.js}'],
            charset: 'utf8mb4_general_ci',
            synchronize: false,
            logging: true,
        } as SeederOptions & DataSourceOptions),
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
