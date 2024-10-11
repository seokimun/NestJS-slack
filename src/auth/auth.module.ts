import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalSerializer } from './serializer/local.serializer';

@Module({
    imports: [
        PassportModule.register({ session: true }),
        TypeOrmModule.forFeature([Users]),
    ],
    providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
