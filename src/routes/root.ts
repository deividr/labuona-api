'use strict';

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function (fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      return { root: true };
    }
  );
}
