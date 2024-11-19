import { Module } from '@nestjs/common';
import { MemberUserModule } from './member-user/member-user.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    MemberUserModule,
    RouterModule.register([
      {
        path: 'app-api',
        module: MemberUserModule,
      },
    ]),
  ],
})
export class MemberModule {}
