import {Client, expect} from '@loopback/testlab';
import {LoopbackAssignmentApplication} from '../..';
import {CustomerRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('CustomerController', () => {
  let app: LoopbackAssignmentApplication;
  let client: Client;
  let customerRepo: CustomerRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  before(givenCustomerRepository);

  it('gives status 200 when customer is added', async () => {
    await customerRepo.deleteAll();
    await addCustomer();
    const response = await client.get('/customers').expect(200);
    expect(response.body[0].name).to.be.equal('test_customer');
  });

  it('updates customer successfully', async () => {
    await customerRepo.deleteAll();
    const customerId = await addCustomer();

    const customerToUpdate = {
      name: 'updated_customer', //updated
      website: 'test_website',
      address: 'test_address',
    };

    await client
      .put(`/customers/${customerId}`)
      .send(customerToUpdate)
      .expect(204);

    const response = await client.get(`/customers`);
    expect(response.body[0].name).to.be.equal('updated_customer');
  });

  it('deletes a customer successfully', async () => {
    await customerRepo.deleteAll();
    const customerId = await addCustomer();
    await client.del(`/customers/${customerId}`).expect(204);
  });

  it('should return count', async () => {
    await customerRepo.deleteAll();
    await addCustomer();
    const response = await client.get(`/customers/count`).expect(200);
    expect(response.body.count).to.be.equal(1);
  });

  async function givenCustomerRepository() {
    customerRepo = await app.getRepository(CustomerRepository);
  }

  async function addCustomer() {
    const customer = {
      name: 'test_customer',
      website: 'test_website',
      address: 'test_address',
    };

    const response = await client
      .post(`/customers`)
      .send(customer)
      .expect(200);

    return response.body.id;
  }
});
