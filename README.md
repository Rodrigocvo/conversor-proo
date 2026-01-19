
# CONVERSOR PRO — Deploy na Vercel (estático)

Estrutura pronta para fazer deploy do seu conversor na Vercel em 1 minuto.

## Como publicar
1. Faça login em https://vercel.com (GitHub/Google)
2. Clique **New Project → Import** e arraste a pasta **conversor-pro** (ou mande para um repositório Git e importe)
3. Nas opções do projeto, defina:
   - Framework: **Other**
   - Root Directory: **/** (raiz do zip)
   - Output / Public Directory: **public**
4. Clique **Deploy**

Ao finalizar, a Vercel mostrará a URL, ex.: `https://conversor-pro.vercel.app`.

## Executar localmente (opcional)
- `npm -g i http-server`
- `http-server public -p 8080`
- Acesse: http://localhost:8080

## Fontes de dados
- Fiat: ExchangeRate-API (Open, atualização diária)
- Cripto: Binance ticker (quase em tempo real)

