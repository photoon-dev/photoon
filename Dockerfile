# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# As NEXT_PUBLIC_* sao inlined no bundle: precisam existir no build.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_ROOT_DOMAIN
ARG NEXT_PUBLIC_PROTOCOL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN \
    NEXT_PUBLIC_PROTOCOL=$NEXT_PUBLIC_PROTOCOL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- worker de renderizacao ----
#
# Imagem separada do site, e de proposito. O runner do Next so carrega o
# `standalone` — nao tem `tools/` nem `src/`, entao `node tools/worker-render.ts`
# nunca teria como rodar la. O worker precisa do codigo TypeScript em pe porque
# importa `src/lib/impressao.ts` (o mesmo renderizador do editor: a conta da
# impressao nao pode divergir da que o cliente aprovou na tela).
#
# `fontconfig` + as fontes nao sao enfeite: sem elas o `sharp` desenha os
# quadros de texto com a substituta do sistema, e o texto sai no papel com
# outra letra. Liberation cobre Arial/Helvetica/Times por metrica.
FROM node:22-alpine AS worker
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache fontconfig ttf-liberation font-dejavu
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY tools ./tools
COPY src ./src
# `--import` registra o resolvedor: o `strip-types` do Node apaga os tipos mas
# nao resolve import relativo sem extensao, que e como `src/lib/**` e escrito.
CMD ["node", "--experimental-strip-types", "--import", "./tools/resolver-ts.mjs", "tools/worker-render.ts"]

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
