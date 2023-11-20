import { FastifyPluginAsync } from "fastify";
import { fastifyAdapterController } from "../../adapters/fastify-adapter-controller";
import { makeCreateUserController } from "../../factory/presentation/controllers/create-user-factory";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post("/", async function (request, response) {
    await fastifyAdapterController(
      request,
      response,
      makeCreateUserController(),
    );
  });
};

export default auth;
