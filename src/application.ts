import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import path from 'path';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';
export class LoopbackAssignmentApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    super(options);

    const connector = process.env.connector;
    const url = process.env.url;
    const host = process.env.host;
    const port = process.env.port;
    const user = process.env.user;
    const password = process.env.password;
    const database = process.env.database;

    this.bind('datasources.config.db').to({
      name: 'db',
      connector: connector,
      url: url,
      host: host,
      port: port,
      user: user,
      password: password,
      database: database,
    });
    this.bind('datasources.db').toClass(DbDataSource);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
