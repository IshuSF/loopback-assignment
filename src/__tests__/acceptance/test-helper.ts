import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {LoopbackAssignmentApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new LoopbackAssignmentApplication({
    rest: restConfig,
  });

  await app.boot();
  app.bind('datasources.config.db').to({
    name: 'db',
    connector: 'memory',
  });
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: LoopbackAssignmentApplication;
  client: Client;
}
