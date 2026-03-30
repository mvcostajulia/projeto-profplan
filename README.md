# PROFPLAN
Projeto profissional estruturado e desenvolvido para uma empresa da área educacional, com o objetivo de estruturar as agendas dos professores, conforme demanda de cursos, turmas e pessoas disponíveis.

Codificado em NodeJs com integração ao **MongoDB (driver oficial)**, sem uso de ORMs/ODMs como Mongoose, e **CSS nativo**, sem frameworks ou bibliotecas de abstração.


## Tecnologias

- Node.js (puro)
- Express
- MongoDB (driver oficial)
- HTML
- CSS (nativo)

## Como executar o projeto

### 1. Repositório

Clone o repositório do projeto e acesse o diretório local para iniciar a configuração:

```bash
git clone https://github.com/mvcostajulia/projeto-profplan.git
cd projeto-profplan
```

### 2. Dependências

Instale as dependências do projeto executando o comando abaixo na raiz da aplicação:

```bash
npm install 
```

### 3. Configuração do banco de dados

Este projeto utiliza MongoDB Atlas e requer algumas configurações para ser executado corretamente:

- Criar um cluster no MongoDB Atlas 
- Criar um usuário de banco de dados
- Liberar acesso de IP (IP local ou 0.0.0.0/0)
- Obter a string de conexão 

### 4. Variáveis de ambiente

Para o correto funcionamento da aplicação, é necessário definir as variáveis de ambiente responsáveis pela conexão com o banco de dados e pela segurança do processo de autenticação.

- Criar um arquivo .env na raiz do projeto contendo:

```
MONGODB_URI=string_de_conexao_obtida_no_cluster
JWT_SECRET=chave_secreta_utilizada_para_assinatura_dos_tokens
```

Recomenda-se que a variável `JWT_SECRET` seja composta por uma sequência longa e aleatória de caracteres, garantindo maior segurança no processo de autenticação.

### 5. Execução

Após a configuração do ambiente, execute o projeto com:

```
npm run dev
```

A aplicação estará disponível em ambiente local no endereço:

http://localhost:3000

### 6. Dados iniciais

Para facilitar os testes da aplicação, é possível criar um usuário padrão executando o script de seed:
```
npm run seed
```
O seed irá criar um usuário administrador de teste com as seguintes credenciais:

- **Matrícula:** 1234 
- **Senha:** 1234 

### 7. Funcionalidades

- Cadastro de usuários com autenticação via JWT  
- Criação e gerenciamento de cursos, contemplando sua matriz curricular
- Criação e gerenciamento de turmas, vinculadas ao cursos pré-existentes
- Criação e gerenciamento de técnicos de ensino (professores), contemplando suas formas de contratação e disponibilidade semanal 
- Criação e gerenciamento de agendamentos, estabelecendo vículos entre técnicos, turma e curso
- Criação e gerenciamento de usuários, com hierarquia de acesso
- Visualização geral e unificada dos calendários dos técnicos, das turmas e das áreas internas
- Registro de logs de inclusão, alteração e remoção de dados

### 8. Estrutura do projeto

```
.
├── node_modules/
├── src/
│   ├── database/
│   │   ├── db_agendamento.js
│   │   ├── db_curso.js
│   │   ├── db_logs.js
│   │   ├── db_seed.js
│   │   ├── db_tecnico.js
│   │   ├── db_turma.js
│   │   ├── db_usuario.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── acess_controller.js
│   │   ├── auth_controller.js
│   │   ├── login_controller.js
│   │   ├── logout_controller.js
│   │   └── token_controller.js
│   ├── img/
│   ├── calendarios/
│   │   ├── header_config.js
│   │   ├── index_calendario.html
│   │   ├── script_calendario.js
│   │   ├── style_calendario.css
│   ├── conta/
│   │   ├── header_config.js
│   │   ├── editar_conta.html
│   │   ├── script_gerenciar_conta.js
│   │   ├── style_gerenciar_conta.css
│   ├── login/
│   │   ├── login.html
│   │   ├── style_login.css
│   ├── shared/
│   │   ├── header.js
│   │   ├── cores.css
│   │   ├── padrap.css
│   │   ├── registroLogs.js
│   ├── agendamentos/
│   │   ├── editar_agendamento.html
│   │   ├── header_config.js
│   │   ├── index_agendamento.html
│   │   ├── novo_agendamento.html
│   │   ├── script_agenda_tecnico.js
│   │   ├── script_agendamentos.js
│   │   ├── script_gerenciar_agendamento.js
│   │   ├── script_novo_agendamento.js
│   │   ├── style_agendamento.css
│   │   ├── style_gerenciar_agendamento.css
│   │   └── ver_agendamento.html
│   ├── cursos/
│   │   ├── editar_curso.html
│   │   ├── header_config.js
│   │   ├── index_curso.html
│   │   ├── novo_curso.html
│   │   ├── script_cursos.js
│   │   ├── script_gerenciar_curso.js
│   │   ├── script_novo_curso.js
│   │   ├── script_ucs.js
│   │   ├── style_curso.css
│   │   ├── style_gerenciar_curso.css
│   │   └── ver_curso.html
│   ├── tecnicos/
│   │   ├── editar_tecnico.html
│   │   ├── header_config.js
│   │   ├── index_tecnicos.html
│   │   ├── novo_tecnico.html
│   │   ├── script_horarios_ausencia_tecnico.js
│   │   ├── script_tecnicos.js
│   │   ├── script_gerenciar_tecnico.js
│   │   ├── script_novo_tecnico.js
│   │   ├── style_tecnicos.css
│   │   ├── style_gerenciar_tecnico.css
│   │   └── ver_tecnico.html
│   ├── turmas/
│   │   ├── editar_turma.html
│   │   ├── header_config.js
│   │   ├── index_turmas.html
│   │   ├── nova_turma.html
│   │   ├── script_turmas.js
│   │   ├── script_gerenciar_turma.js
│   │   ├── script_nova_turma.js
│   │   ├── style_turmas.css
│   │   ├── style_gerenciar_turma.css
│   │   └── ver_turma.html
│   ├── usuarios/
│   │   ├── editar_usuario.html
│   │   ├── header_config.js
│   │   ├── index_usuarios.html
│   │   ├── novo_usuario.html
│   │   ├── script_usuarios.js
│   │   ├── script_gerenciar_usuario.js
│   │   ├── script_novo_usuario.js
│   │   ├── style_usuario.css
│   │   ├── style_gerenciar_usuario.css
│   │   └── ver_usuario.html
├── .env
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

### 9. Considerações técnicas

- Utilização do driver oficial do MongoDB, sem uso de ORMs/ODMs, garantindo controle direto sobre as operações de banco  
- Estrutura modular com separação de responsabilidades entre conexão, rotas e regras de negócio  
- Implementação de autenticação baseada em JWT para controle de acesso  
- Organização do código voltada à clareza, manutenção e evolução da aplicação  
- Manipulação explícita dos dados e da lógica de negócio, priorizando entendimento e previsibilidade do sistema  
- Decisões de implementação orientadas às necessidades do cliente, priorizando os fluxos internos e com vista para evolução da aplicação.

### 10. Considerações finais

Este projeto foi desenvolvido com foco em atender demandas reais de organizações educacionais.