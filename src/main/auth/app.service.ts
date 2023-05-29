import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  login(): { status: string } {
    return { status: 'ok' };
  }
}
