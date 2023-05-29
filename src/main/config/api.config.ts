import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  port: parseInt(process.env.API_PORT as string, 10) || 3000,
}));
