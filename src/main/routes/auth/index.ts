import { FastifyPluginAsync } from "fastify";
import { makeLoginControler } from "../../factory/presentation/controllers/login-controller-factory";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/login", async function (request, response) {
    const controller = makeLoginControler();
    const result = await controller.handle(request.body as any);
    response.send(result);
  });
};

export default auth;
