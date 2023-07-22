import fastify from 'fastify';
import app from './app';

const server = fastify();
app(server, null);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
