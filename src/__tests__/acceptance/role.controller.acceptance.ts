import {Client, expect} from '@loopback/testlab';
import {LoopbackAssignmentApplication} from '../..';
import {RoleRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('RoleController', () => {
  let app: LoopbackAssignmentApplication;
  let client: Client;
  let roleRepo: RoleRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  before(givenRoleRepository);

  it('gives status 200 when role is added', async () => {
    await roleRepo.deleteAll();
    await addRole();
    const response = await client.get('/roles').expect(200);
    expect(response.body[0].name).to.be.equal('test_role');
  });

  it('updates role successfully', async () => {
    await roleRepo.deleteAll();
    const roleId = await addRole();

    const roleToUpdate = {
      name: 'updated_role', //updated
      description: 'test_description',
    };

    await client
      .put(`/roles/${roleId}`)
      .send(roleToUpdate)
      .expect(204);

    const response = await client.get(`/roles`);
    expect(response.body[0].name).to.be.equal('updated_role');
  });

  it('deletes a role successfully', async () => {
    await roleRepo.deleteAll();
    const roleId = await addRole();
    await client.del(`/roles/${roleId}`).expect(204);
  });

  it('should return count', async () => {
    await roleRepo.deleteAll();
    await addRole();
    const response = await client.get(`/roles/count`).expect(200);
    expect(response.body.count).to.be.equal(1);
  });

  async function givenRoleRepository() {
    roleRepo = await app.getRepository(RoleRepository);
  }

  async function addRole() {
    const role = {
      name: 'test_role',
      description: 'test_description',
    };

    const response = await client
      .post(`/roles`)
      .send(role)
      .expect(200);

    return response.body.id;
  }
});
