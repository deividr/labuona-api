import { FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an auth";
  });
};

export default auth;
