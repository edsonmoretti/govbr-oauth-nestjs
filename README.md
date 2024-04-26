# GovBR OAuth NestJS

Este projeto é um exemplo de integração com o Login único do governo federal utilizando NestJS.

## Rotas

Aqui estão as rotas disponíveis neste projeto:

- `GET /login`: Inicia o fluxo de autenticação OAuth com o Login único do governo federal. Redireciona o usuário para a página de login do Login único.

- `GET /login/openid`: Esta rota é usada como URI de redirecionamento após o usuário ter feito login no Login único. Ela recebe um código de autorização como parâmetro de consulta e troca esse código por um token de acesso.

## Configuração

Para configurar o projeto, você precisa definir as seguintes variáveis de ambiente no arquivo `.env`:

```dotenv
# NODE
NODE_ENV=development
PORT=80
TZ=America/Sao_Paulo

# GOVBR
GOVBR_URL_PROVIDER=https://sso.staging.acesso.gov.br
GOVBR_URL_SERVICE=https://api.staging.acesso.gov.br
GOVBR_REDIRECT_URI=
GOVBR_SCOPES=openid+email+phone+profile
GOVBR_CLIENT_ID=
GOVBR_SECRET=
```

## Executando o projeto

Para executar o projeto, siga estas etapas:

1. Instale as dependências do projeto com `npm install`.
2. Inicie o servidor com `npm start`.

## Documentação oficial do GovBR OAuth

Para mais informações sobre a integração com o Login único do governo federal, consulte a [documentação oficial do GovBR OAuth](https://acesso.gov.br/roteiro-tecnico/).
