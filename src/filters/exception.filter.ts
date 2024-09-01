import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = this.getStatusCode(exception);
    const message = this.getErrorMessage(exception);
    this.logger.error(`[${request.method}] ${request.url}`, exception.stack);
    response.status(status).json({
      statusCode: status,
      status: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'An error occurred. Please try again later.', // Generic error message for the client
      details: {
        error: message, // Return the error message to the client
      },
    });
  }
  public isDtoValidationError(exception: any) {
    return exception?.response?.message ? true : false;
  }
  private getStatusCode(exception: any): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
  private getErrorMessage(exception: any): string {
    return this.isDtoValidationError(exception)
      ? exception?.response?.message
      : (exception?.message ?? 'Internal Server Error');
  }
}
