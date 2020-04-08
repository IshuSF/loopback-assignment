import {Client, expect} from '@loopback/testlab';
import {LoopbackAssignmentApplication} from '../..';
import {UserRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('UserController', () => {
  let app: LoopbackAssignmentApplication;
  let client: Client;
  let userRepo: UserRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  before(givenUserRepository);

  it('gives status 200 when user is added and return role and customer relations', async () => {
    await userRepo.deleteAll();
    await addRole();
    await addCustomer();
    await addUser();

    const response = await client
      .get(
        `/users?filter={"include":[{"relation":"role", "scope":{"fields":{"id":true,"name":true}}}, {"relation":"customer", "scope":{"fields":{"id":true,"name":true}}}]}`,
      )
      .expect(200);
    expect(response.body[0].firstName).to.be.equal('test_firstName');
    expect(response.body[0].role.name).to.be.equal('test_role');
    expect(response.body[0].customer.name).to.be.equal('test_customer');
  });

  it('updates user successfully', async () => {
    await userRepo.deleteAll();
    const userId = await addUser();

    const userToUpdate = {
      firstName: 'updated_firstName', // updated
      middleName: 'test_middleName',
      lastName: 'test_lastName',
      email: 'email@gmail.com',
      address: 'test_address',
      phoneNo: '1234567890',
      roleId: 1,
      customerId: 1,
    };

    await client
      .put(`/users/${userId}`)
      .send(userToUpdate)
      .expect(204);

    const response = await client.get(`/users`);
    expect(response.body[0].firstName).to.be.equal('updated_firstName');
  });

  it('deletes a user successfully', async () => {
    await userRepo.deleteAll();
    const userId = await addUser();
    await client.del(`/users/${userId}`).expect(204);
  });

  it('should return count', async () => {
    await userRepo.deleteAll();
    await addUser();
    const response = await client.get(`/users/count`).expect(200);
    expect(response.body.count).to.be.equal(1);
  });

  async function addUser() {
    const userToAdd = {
      firstName: 'test_firstName',
      middleName: 'test_middleName',
      lastName: 'test_lastName',
      email: 'email@gmail.com',
      address: 'test_address',
      phoneNo: '1234567890',
      roleId: 1,
      customerId: 1,
    };

    const response = await client
      .post(`/users`)
      .send(userToAdd)
      .expect(200);

    return response.body.id;
  }

  async function givenUserRepository() {
    userRepo = await app.getRepository(UserRepository);
  }

  async function addRole() {
    const role = {
      name: 'test_role',
      description: 'test_description',
    };

    await client
      .post(`/roles`)
      .send(role)
      .expect(200);
  }

  async function addCustomer() {
    const customer = {
      name: 'test_customer',
      website: 'test_website',
      address: 'test_address',
    };

    await client
      .post(`/customers`)
      .send(customer)
      .expect(200);
  }
});
