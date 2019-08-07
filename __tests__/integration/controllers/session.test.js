import request from 'supertest';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('Session', () => {
  describe('Store', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('must pass all data', async () => {
      const user = await request(app)
        .post('/new/sessions')
        .send({});

      expect(user.status).toBe(400);
    });

    it('should be able to sign in', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const response = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      expect(response.body).toHaveProperty('token');
    });

    it('must find the user', async () => {
      const user = await factory.attrs('User');

      const response = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      expect(response.status).toBe(401);
    });

    it('checking different passwords', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const response = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: '000000' });

      expect(response.status).toBe(401);
    });
  });
});
