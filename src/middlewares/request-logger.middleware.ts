import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const body = req.body;
    const headers = req.headers;

    this.logger.log(
      `Request: ${method} ${originalUrl} - Body: ${JSON.stringify(body)} `,
    );

    next();
  }
}
