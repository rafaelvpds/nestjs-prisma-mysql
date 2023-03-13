import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
/**
 * Os decorators vem sempre ante do Alvo dele
 *
 * neste caso o Decorator @Controller esta vindo antes da minha classe controller
 */

/**
 * O @Controllers funciona como um garçom, em um restaurante
 *
 * Servidor: Retaurante => Provem um serviço
 * Cliente: Request uma solicitação
 *
 * Toda vez que temos um acesso na aplicação quem atende esse request e o controller
 * resposavel por saber qual metodo: POST, GET, PATCH
 *
 * ELE VAI ESTA AMARRADA A UMA ROTA EXPECIFICA
 *
 */
/**
 * @Controller() recebe uma string para definirmos a rota.
 * todos os metodos dos meu controller deve iniciar com o usuario
 * definido neste parametro
 */
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
    @Post()
    SetHello(): string {
        return 'POST: HELLO HCODE!';
    }
}
