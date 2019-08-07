import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('User', () => {
  describe('Store', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('should encrypt user password when new user created', async () => {
      const user = await factory.create('User', {
        password: '123456',
      });

      const compareHash = await bcrypt.compare('123456', user.password_hash);

      expect(compareHash).toBe(true);
    });

    it('should be able to register', async () => {
      const user = await factory.attrs('User');

      const response = await request(app)
        .post('/new/users')
        .send(user);

      expect(response.body).toHaveProperty('id');
    });

    it('should not be able to register with duplicated email', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const response = await request(app)
        .post('/new/users')
        .send(user);

      expect(response.status).toBe(400);
    });

    it('must pass all data', async () => {
      const user = await request(app)
        .post('/new/users')
        .send({});

      expect(user.status).toBe(400);
    });
  });

  describe('Update', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('should be able to rename', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      const response = await request(app)
        .put('/edit/users')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ name: 'Teste name', email: user.email });

      expect(response.status).toBe(200);
    });

    it('it is not possible to pass password and blank email', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      const response = await request(app)
        .put('/edit/users')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('checking if email already exists', async () => {
      const user = {
        name: 'Novo Teste',
        email: 'teste@gmail.com',
        password: '123456',
      };
      const userTwo = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      await request(app)
        .post('/new/users')
        .send(userTwo);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: userTwo.email, password: userTwo.password });

      const response = await request(app)
        .put('/edit/users')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ name: userTwo.name, email: user.email });

      expect(response.status).toBe(400);
    });

    it('checking old password is wrong', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      const response = await request(app)
        .put('/edit/users')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({
          name: user.name,
          email: user.email,
          oldPassword: '111111',
          password: '000000',
          confirmPassword: '000000',
        });

      expect(response.status).toBe(400);
    });

    it('trying to update without authentication', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const response = await request(app)
        .put('/edit/users')
        .send({
          name: user.name,
          email: user.email,
          oldPassword: '111111',
          password: '000000',
          confirmPassword: '000000',
        });

      expect(response.status).toBe(401);
    });

    it('passing invalid token', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const response = await request(app)
        .put('/edit/users')
        .set('Authorization', `Bearer tokenInvalido`)
        .send({
          name: user.name,
          email: user.email,
          oldPassword: '111111',
          password: '000000',
          confirmPassword: '000000',
        });

      expect(response.status).toBe(401);
    });
  });
});
