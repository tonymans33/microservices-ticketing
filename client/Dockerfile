FROM node:alpine

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .

# NEXT_PUBLIC_* values are inlined at build time, so the Stripe key must be
# present here rather than only at runtime.
ARG NEXT_PUBLIC_STRIPE_KEY
ENV NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY

RUN npm run build

CMD ["npm", "start"]
