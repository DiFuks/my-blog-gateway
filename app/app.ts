import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Application } from 'express';
import { createConnection } from 'typeorm';

dotenv.config();

import { createContainer } from '@di/container';
import { typesConstants } from '@di/typesConstants';
import {
  initializeApplicationErrorMiddlewares,
  initializeApplicationMiddlewares
} from '@middlewares/initializeApplication';
import { init as rabbitMQInit } from '@rabbitmq/index';
import { init as initSocket } from '@io/index';

(async () => {
  const connection = await createConnection();
  const container = createContainer(connection);

  const basePath = container.get<string>(typesConstants.BasePath);

  rabbitMQInit(container);

  const server = new InversifyExpressServer(container, null, {rootPath: basePath});

  server.setConfig((app: Application) => initializeApplicationMiddlewares(app));
  server.setErrorConfig((app: Application) => initializeApplicationErrorMiddlewares(app, container));

  const app = server.build();

  const appServer = app.listen(process.env.APP_PORT);

  initSocket(appServer, container);
})();
