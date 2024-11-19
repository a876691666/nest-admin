import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtendsUploadService } from './upload.service';
import { ExtendsUploadController } from './upload.controller';
import { SysUploadEntity } from './entities/upload.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SysUploadEntity])],
  controllers: [ExtendsUploadController],
  providers: [ExtendsUploadService],
  exports: [ExtendsUploadService],
})
export class ExtendsUploadModule {}
