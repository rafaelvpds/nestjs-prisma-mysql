import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common/decorators';

export const ParamId = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        return Number(context.switchToHttp().getRequest().params.id);
    },
);
