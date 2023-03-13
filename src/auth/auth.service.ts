import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/users/user.service';
import { AuthRegisterLoginDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {
    constructor(
        private readonly JwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) {}
    createToken(user: User) {
        return {
            acessToken: this.JwtService.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                {
                    expiresIn: '7 days',
                    subject: String(user.id),
                    issuer: 'login',
                    audience: 'users',
                    //  notBefore: Math.ceil((Date.now() + 1000 * 60 * 60) / 1000), //validação somente daqui uma hora
                },
            ),
        };
    }
    checkToken(token: string) {
        try {
            const dataToken = this.JwtService.verify(token, {
                audience: 'users',
                issuer: 'login',
            });
            return dataToken;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    async login(email: string, password: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            throw new UnauthorizedException('Email e/ou usuario incorretos');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Email e/ou usuario incorretos');
        }
        return this.createToken(user);
    }

    async forget(email: string) {
        const userEmail = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
        if (!userEmail) {
            throw new UnauthorizedException('E-mail incorretos');
        }
        const token = this.JwtService.sign(
            {
                id: userEmail.id,
            },
            {
                expiresIn: '30 minutes',
                subject: String(userEmail.id),
                issuer: 'forget',
                audience: 'users',
            },
        );
        await this.mailer.sendMail({
            subject: 'Recuperação de email', //assunto
            to: 'rafaelvpds@gmail.com',
            template: 'forget',
            context: {
                name: userEmail.name,
                token,
            },
        });
        return true;
    }

    async reset(password: string, token: string) {
        try {
            const data = this.JwtService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            });
            const id = data.id;
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            const user = await this.prismaService.user.update({
                where: {
                    id,
                },
                data: {
                    password,
                },
            });
            return this.createToken(user);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
    async register(dataRegister: AuthRegisterLoginDTO) {
        const user = await this.userService.createUser(dataRegister);
        return this.createToken(user);
    }
}
