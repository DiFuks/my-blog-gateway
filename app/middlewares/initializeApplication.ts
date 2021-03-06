import { Container } from 'inversify';
import { Application, NextFunction, Request, Response } from 'express';
import * as createError from 'http-errors';
import * as httpStatusCodes from 'http-status-codes';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { typesServices } from '@di/typesServices';
import { ErrorsHandlerService } from '@services/errorsHandler/ErrorsHandlerService';
import { passport } from '@passport/passport';

export const initializeApplicationMiddlewares = (app: Application) => {
  app.use(bodyParser.json({ limit: '300mb' }));
  app.use(express.json());
  app.use(cors({
    origin: [process.env.BLOG_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true
  }));
  app.use(passport.initialize())
};

export const initializeApplicationErrorMiddlewares = (app: Application, container: Container) => {
  const errorsHandlerService = container.get<ErrorsHandlerService>(typesServices.ErrorsHandlerService);

  app.use((req: Request, res: Response, next: NextFunction) => next(createError(httpStatusCodes.NOT_FOUND)));
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => errorsHandlerService.handle(err, req, res));
};
