import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

type ExceptionBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        response.status(status).json({
          statusCode: status,
          message: body,
        });
        return;
      }

      const payload = body as ExceptionBody;
      const rawMessage = payload.message;
      const errors = Array.isArray(rawMessage) ? rawMessage : undefined;

      response.status(status).json({
        statusCode: status,
        message: errors
          ? 'Validation failed'
          : (rawMessage ?? exception.message),
        ...(errors ? { errors } : {}),
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
