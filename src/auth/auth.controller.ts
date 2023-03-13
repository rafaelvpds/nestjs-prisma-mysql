import {
    BadRequestException,
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseEnumPipe,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { AuthForgetDTO } from './dto/auth-forget-dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterLoginDTO } from './dto/auth-register.dto';
import { AuthResetDTO } from './dto/auth-reset-dto';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly filservice: FileService,
    ) {}

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterLoginDTO) {
        return this.authService.register(body);
    }
    // recuperar a senha
    @Post('forget')
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token);
    }
    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user) {
        return { user };
    }
    // Somente um Arquivo
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: 'image/*' }), //tipo de arquivo
                    new MaxFileSizeValidator({ maxSize: 1024 * 20 }), //tamanho do arquivo
                ],
            }),
        )
        photo: Express.Multer.File,
    ) {
        try {
            const patch = join(
                __dirname,
                '..',
                '..',
                'storage',
                'photos',
                `photo-${user.id}.png`,
            );

            await this.filservice.upload(photo, patch);
        } catch (e) {
            throw new BadRequestException(e);
        }

        return { sucess: true };
    }

    //Varios Arquivos

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(
        @User() user,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return files;
    }

    //Outra forma de multiplos Arquivos

    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo',
                maxCount: 1,
            },
            {
                name: 'documents',
                maxCount: 10,
            },
        ]),
    )
    @UseGuards(AuthGuard)
    @Post('files-field')
    async uploadFileField(
        @User() user,
        @UploadedFiles()
        files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
    ) {
        return files;
    }
}
