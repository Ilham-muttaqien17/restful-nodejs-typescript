import supertest from 'supertest';
import app from '@src/app';
import logger from '@src/utils/logger';
import tesUser from '@test/utils/user';

describe('Register New User', () => {
  afterAll(async () => {
    await tesUser.removeTestUser();
  });

  it('should can register user', async () => {
    const result = await supertest(app).post('/api/register').send({
      name: 'test',
      email: 'test@gmail.com',
      password: 'test123ASD'
    });

    logger.info(result.body);
    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it('should reject if has invalid request', async () => {
    const result = await supertest(app).post('/api/register').send({
      name: '',
      email: '',
      password: ''
    });

    logger.info(result.body);

    expect(result.status).toBe(422);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if has invalid email format', async () => {
    const result = await supertest(app).post('/api/register').send({
      name: 'test',
      email: 'test@@@@@',
      password: 'test123ASD'
    });

    logger.info(result.body);

    expect(result.status).toBe(422);
    expect(result.body.errors.email).toBeDefined();
  });

  it('should reject if has invalid password format', async () => {
    const result = await supertest(app).post('/api/register').send({
      name: 'test',
      email: 'test@gmail.com',
      password: 'test'
    });

    logger.info(result.body);

    expect(result.status).toBe(422);
    expect(result.body.errors.password).toBeDefined();
  });

  it('should reject if email already registered', async () => {
    const result = await supertest(app).post('/api/register').send({
      name: 'test',
      email: 'test@gmail.com',
      password: 'test123ASD'
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.message).toBe('Email already registered');
  });
});

describe('Login User', () => {
  beforeAll(async () => {
    await tesUser.createTestUser();
  });

  afterAll(async () => {
    await tesUser.removeTestUser();
  });

  it('should login new session user', async () => {
    const result = await supertest(app).post('/api/login').send({
      email: 'test@gmail.com',
      password: 'test123ASD'
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.access_token).toBeDefined();
  });

  it('should reject if invalid credentials', async () => {
    const result = await supertest(app).post('/api/login').send({
      email: 'test@gmail.com',
      password: 'test'
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.message).toBe('Email or password is not valid');
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(app).post('/api/login').send({});

    logger.info(result.body);

    expect(result.status).toBe(422);
    expect(result.body.errors).toBeDefined();
  });
});

describe('Logout', () => {
  beforeAll(async () => {
    await tesUser.createTestUser();
  });

  afterAll(async () => {
    await tesUser.removeTestUser();
  });

  it('should can logout', async () => {
    const loginInfo = await supertest(app).post('/api/login').send({
      email: 'test@gmail.com',
      password: 'test123ASD'
    });
    const result = await supertest(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${loginInfo.body.data.access_token}`);

    logger.info(result.body);

    expect(result.statusCode).toBe(200);
    expect(result.body.message).toBe('Logout success');
  });

  it('should reject logout if token is not present', async () => {
    const result = await supertest(app).delete('/api/logout');

    logger.info(result.body);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });

  it('should reject logout if invalid token', async () => {
    const result = await supertest(app).delete('/api/logout').set('Authorization', 'Basic asdasd');

    logger.info(result.body);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('Unauthorized');
  });
});
