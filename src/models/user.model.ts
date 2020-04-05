import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 20,
      minLength: 3,
    },
  })
  firstName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 20,
      minLength: 3,
    },
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 10,
      minLength: 10,
      pattern: '^[0-9]*$',
    },
  })
  phoneNo?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 20,
      minLength: 3,
    },
  })
  address?: string;

  @belongsTo(() => Role)
  roleId: number;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
