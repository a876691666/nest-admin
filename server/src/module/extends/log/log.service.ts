import { Injectable, Inject, Scope } from '@nestjs/common';
import { Repository, In, SelectQueryBuilder, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './log.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ResultData } from 'src/common/utils/result';
import { UserDto } from 'src/module/system/user/user.decorator';
import { PagingDto } from 'src/common/dto';

@Injectable({ scope: Scope.REQUEST })
export class ExtendsLogService {
  @Inject(REQUEST)
  private readonly request: Request & { user: UserDto };

  constructor(
    @InjectRepository(LogEntity)
    readonly logRepo: Repository<LogEntity>,
  ) {}

  async findAll(query: PagingDto, where?: FindOptionsWhere<LogEntity>) {
    const entity = this.logRepo.createQueryBuilder('entity');

    if (query.pageSize && query.pageNum) {
      entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    }

    const orderMap: { [key: string]: 'ASC' | 'DESC' } = {
      descending: 'DESC',
      ascending: 'ASC',
    };

    if (where) entity.where(where);

    if (query.orderByColumn && query.isAsc) {
      entity.orderBy(`entity.${query.orderByColumn}`, orderMap[query.isAsc]);
    }

    const [list, total] = await entity.getManyAndCount();

    return ResultData.ok({ list, total });
  }

  /**
   * @description: 录入日志
   */
  async logAction(logItem: Partial<LogEntity>) {
    const { originalUrl, method, headers, ip, body, query, user } = this.request;

    const userAgent = headers['user-agent'];

    const newBody = { ...body };

    if (newBody.password) {
      newBody.password = '******';
    }

    if (newBody.newPassword) {
      newBody.newPassword = '******';
    }

    const params: Partial<LogEntity> = {
      handleUrl: originalUrl,
      handleMethod: method,
      handleRemoteIp: ip,
      handleUa: userAgent,
      handleParam: { body: newBody, query },

      deptId: this.request.user?.user?.deptId,

      createBy: user?.user?.userName || body.userName,
      createTime: new Date(),

      ...logItem,
    };

    await this.logRepo.save(params);
  }
}
