import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

// --- IMPORTANTE: Ajuste os caminhos se necessário ---
import { Usuario } from '../src/usuario/entities/usuario.entity';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { AuthModule } from '../src/auth/auth.module';

// Se você já tiver Postagem e Tema, mantenha. Se não, comente as linhas abaixo:
import { Postagem } from '../src/postagem/entities/postagem.entity';
import { PostagemModule } from '../src/postagem/postagem.module';
import { Tema } from '../src/tema/entities/tema.entity';
import { TemaModule } from '../src/tema/tema.module';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  let app: INestApplication;
  let token: any;
  let usuarioId: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          // Aqui carregamos as entidades diretamente ao invés de usar caminho de arquivo
          entities: [Usuario, Postagem, Tema],
          synchronize: true,
          dropSchema: true,
        }),
        // Importamos apenas os módulos que vamos testar, não o AppModule inteiro
        UsuarioModule,
        AuthModule,
        PostagemModule,
        TemaModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar Usuario', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: 'https://i.imgur.com/FETvs2O.jpg', // Coloquei uma foto válida por garantia
      })
      .expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Não Deve Duplicar o Usuário', async () => {
    return request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: 'https://i.imgur.com/FETvs2O.jpg',
      })
      .expect(400); // Espera Erro 400 (Bad Request)
  });

  it('03 - Deve Autenticar Usuario (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });

  it('04 - Deve Listar todos os Usuários', async () => {
    return request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`) // Passando o token no Header
      .send({})
      .expect(200);
  });

  it('05 - Deve Atualizar um Usuário', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root Atualizado',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: 'https://i.imgur.com/FETvs2O.jpg',
      })
      .expect(200)
      .then((resposta) => {
        expect(resposta.body.nome).toEqual('Root Atualizado');
      });
  });
});
