import supertest from 'supertest';
import app from '@src/app';
import logger from '@src/utils/logger';
import tesUser from '@test/utils/user';

describe('Get Current User', () => {
  beforeAll(async () => {
    await tesUser.createTestUser();
  });

  afterAll(async () => {
    await tesUser.removeTestUser();
  });

  it('should can get current logged in user data', async () => {
    const loginInfo = await supertest(app).post('/api/login').send({
      email: 'test@gmail.com',
      password: 'test123ASD'
    });

    const result = await supertest(app)
      .get('/api/current-user')
      .set('Authorization', `Bearer ${loginInfo.body.data.access_token}`);

    logger.info(result.body);
    expect(result.statusCode).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.description).toBeDefined();
  });

  it('should reject if token is not defined', async () => {
    const result = await supertest(app).get('/api/current-user');

    logger.info(result.body);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should reject if token is not valid', async () => {
    const result = await supertest(app).get('/api/current-user').set('Authorization', 'Bearer asdasd');

    logger.info(result.body);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });
});

describe('Update Current User', () => {
  beforeAll(async () => {
    await tesUser.createTestUser();
  });

  afterAll(async () => {
    await tesUser.removeTestUser();
  });

  it('should can update current user data', async () => {
    const loginInfo = await supertest(app).post('/api/login').send({
      email: 'test@gmail.com',
      password: 'test123ASD'
    });

    const result = await supertest(app)
      .patch('/api/current-user')
      .send({
        name: 'tester1',
        description: 'test1'
      })
      .set('Authorization', `Bearer ${loginInfo.body.data.access_token}`);

    logger.info(result.body);

    expect(result.statusCode).toBe(200);
    expect(result.body.message).toBe('Profile updated successfully');
    expect(result.body.data.name).toBe('tester1');
    expect(result.body.data.description).toBe('test1');
  });

  it('should reject if token is not defined', async () => {
    const result = await supertest(app)
      .patch('/api/current-user')
      .send({ name: 'tester1', description: 'test1' });

    logger.info(result.body);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should reject if token is not valid', async () => {
    const result = await supertest(app)
      .patch('/api/current-user')
      .send({ name: 'tester1', description: 'test1' })
      .set('Authorization', 'Bearer asdasd');

    logger.info(result.body);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should reject if token is not valid', async () => {
    const loginInfo = await supertest(app).post('/api/login').send({
      email: 'test@gmail.com',
      password: 'test123ASD'
    });

    const result = await supertest(app)
      .patch('/api/current-user')
      .send({
        name: '',
        description: ''
      })
      .set('Authorization', `Bearer ${loginInfo.body.data.access_token}`);

    logger.info(result.body);

    expect(result.statusCode).toBe(422);
    expect(result.body.errors.name).toBeDefined();
  });
});
