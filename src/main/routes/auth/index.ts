import { FastifyPluginAsync } from "fastify";
import { makeLoginControler } from "../../factory/presentation/controllers/login-controller-factory";
import { fastifyAdapterController } from "../../adapters/fastify-adapter-controller";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/login", async function (request, response) {
    await fastifyAdapterController(request, response, makeLoginControler());
  });
};

export default auth;
