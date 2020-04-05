import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 100,
      minLength: 4,
    },
  })
  address: string;

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
