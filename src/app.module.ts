import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // ThrottlerModule.forRoot({
        //     // ignoreUserAgents ingnorar user agentes
        //     //limit limite de acesso quantas vezes o recurso seja consumido
        //     //ttl um tempo de um recurso ate outro
        // }),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'morton.berge@ethereal.email',
                    pass: 'qbjTzqJ8s63quz71gb',
                },
            },
            // transport:
            //     'smtps://morton.berge@ethereal.email:qbjTzqJ8s63quz71gb@smtp.ethereal.email', //usuario senha o dominio do servidor
            defaults: {
                from: '"Rafael" <morton.berge@ethereal.email>', //com que nome e de que email
            },
            template: {
                //templete: em qual diretorio que vai esta salvo o nosso email
                dir: __dirname + '/templates',
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

// E uma classe que não faz nada
/**
 * Qual a função do MODULE:
 * Responsavel por dividir as seções da nossa aplicação;
 * e agrupar recuros como se fosse uma pasta, onde colocamos os recursos
 * Por Exemplo: Controllers e Service
 * 
 * Podemos importar modulos, Se eu importar um outro módulo,
 * tanto os meus controles quanto os meus serviços vão ter acesso aos
 * controles e serviços do módulo que nós importamos.
 * Nesse caso, um módulo que nós importamos pode ser um módulo nosso que nós mesmos criamos ou pode ser
 * um módulo de terceiro.
 * 
 * 
 * 
 * 
 * DECORATORS:
 * Os decorators modifica um componente, classe ou objetos em tempo de execução
 * e como se eu colocasse um recurso dentro de uma fução ou chamar uma função dentro de uma função
  E toda vez que eu quiser chamar aquela minha função, eu posso personalizar 
  ou modificar o comportamento padrão daquela função
 * O decorator esta colocando recursos em tempo de execução, dentro dessa classe vazia
 * Esse decorator vai construir todos os metodos nescessarios dentro da minha classe
 * o argumento desse decorator e um objeto JSON que possui varias informações 
 * {
  imports: [],
  controllers: [AppController],
  providers: [AppService],
}

Os decorators vem sempre ante do Alvo dele



 */
