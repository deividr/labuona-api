'use strict';

import type { FastifyReply, FastifyRequest } from 'fastify';

module.exports = async function (fastify: any, opts: any) {
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      return 'this is an example';
    }
  );
};
