import { Controller } from '@nestjs/common';
import {
    Body,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common/decorators';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserPatchDTO } from './dtos/update-user-patch.dto';
import { UpdateUserPutDTO } from './dtos/update-user-put.dto';
import { UserService } from './user.service';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    // @UseInterceptors(LogInterceprtor)

    @Post()
    async create(@Body() body: CreateUserDTO) {
        return this.userService.createUser(body);
    }

    @Get()
    async read() {
        return this.userService.list();
    }

    @Get(':id')
    async readOne(@ParamId() id) {
        return this.userService.show(id);
    }

    @Put(':id')
    async updateTotal(@Body() body: UpdateUserPutDTO, @ParamId() id) {
        return this.userService.update(id, body);
    }

    @Patch(':id')
    async updatePartial(@Body() body: UpdateUserPatchDTO, @ParamId() id) {
        return this.userService.updatePartial(id, body);
    }

    @Delete(':id')
    async delete(@ParamId() id) {
        return this.userService.delete(id);
    }
}
