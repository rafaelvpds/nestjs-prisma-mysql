import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceprtor } from './interceptors/log.interceptor';

async function bootstrap() {
    // Ela cria um App que é uma aplicação express
    // eperamos a criação de uma promisse
    // eu tenho uma função que e responsavel por fabrica a  minha aplicação
    // o Modulo de entrada e o App Module;
    // TODAS AS CONFIGURAÇÕES VEM NO BOOTSTRAP
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new LogInterceprtor());
    app.useGlobalPipes(new ValidationPipe());

    //e a porta que a apliação vai estar executando
    await app.listen(3000);
}
// Algo que vai ajudar voce iniciar;
//  Função que vai ser chamada primeiro, ponto de iniciar a nossa aplicação;
//Toda vez que sua aplicação NESTJS for iniciada, essa e a Primeira função que vai ser chamada
// Nela temos configurações
bootstrap();
