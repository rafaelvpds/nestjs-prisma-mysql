import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserPatchDTO } from './dtos/update-user-patch.dto';
import { UpdateUserPutDTO } from './dtos/update-user-put.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}
    async createUser({ name, email, password, birthAt, role }: CreateUserDTO) {
        const salt = await bcrypt.genSalt();
        console.log('Salt UserController =>', { salt });
        password = await bcrypt.hash(password, salt);

        return this.prismaService.user.create({
            data: {
                email,
                name,
                password,
                birthAt: birthAt ? new Date(birthAt) : null,
                role: Number(role),
            },
        });
    }

    async list() {
        return this.prismaService.user.findMany();
    }
    async show(id: number) {
        await this.exist(id);
        return this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
    }
    async update(
        id: number,
        { name, email, password, birthAt, role }: UpdateUserPutDTO,
    ) {
        await this.exist(id);
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        return this.prismaService.user.update({
            data: {
                name,
                email,
                password,
                birthAt: birthAt ? new Date(birthAt) : null,
                role,
            },
            where: {
                id,
            },
        });
    }

    async updatePartial(
        id: number,
        { name, email, password, birthAt, role }: UpdateUserPatchDTO,
    ) {
        await this.exist(id);

        const data: any = {};
        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }
        if (name) {
            data.name = name;
        }
        if (email) {
            data.email = email;
        }
        if (password) {
            const salt = await bcrypt.genSalt();

            password = await bcrypt.hash(password, salt);

            data.password = password;
        }
        if (role) {
            data.role = Number(role);
        }

        return this.prismaService.user.update({
            data,
            where: {
                id,
            },
        });
    }

    async delete(id: number) {
        await this.exist(id);
        return this.prismaService.user.delete({
            where: {
                id,
            },
        });
    }

    async exist(id: number) {
        if (
            !(await this.prismaService.user.count({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`O usuario ${id} não existe`);
        }
    }
}
