import { Injectable } from '@nestjs/common';

/**
 * O service representaria dentro de um restaurante um cozinheiro:
 * pois e ele o resposnvel de processar as regras de negocios
 *
 * Solictação dentro de um banco de dados
 *@Injectable() => Com o decorator Injectable consigo 
 injetar essa minha classe em outras classes
 *
 *
 */
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
