import { Controller } from "@presentation/protocols";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function fastifyAdapterController(
  request: FastifyRequest,
  reply: FastifyReply,
  controller: Controller<any, any>,
): Promise<void> {
  const body = {
    ...(request.body as any),
    ...(request.params as any),
    ...(request.query as any),
  };

  const response = await controller.handle(body);

  reply.code(response.statusCode);
  reply.send(response.body);
}
