import request from 'supertest';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('Link', () => {
  describe('Store', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('must pass all data', async () => {
      const user = await factory.attrs('User');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      const response = await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('creating a link', async () => {
      const user = await factory.attrs('User');
      const link = await factory.attrs('Link');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      const response = await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(link);

      expect(response.status).toBe(200);
    });

    it('should not be able to register with duplicated url', async () => {
      const user = await factory.attrs('User');
      const link = await factory.attrs('Link');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(link);

      const response = await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(link);

      expect(response.status).toBe(400);
    });
  });

  describe('Index', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('checking link listing', async () => {
      const user = await factory.attrs('User');
      const link = await factory.attrs('Link');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(link);

      const response = await request(app)
        .get('/all/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send();

      expect(response.status).toBe(200);
    });
  });

  describe('Show', () => {
    beforeEach(async () => {
      await truncate();
    });

    it("checking if link doesn't exist", async () => {
      const link = await factory.attrs('Link');

      const response = await request(app)
        .get(`/${link.url}`)
        .send();

      expect(response.status).toBe(400);
    });

    it('checking return of an existing link', async () => {
      const user = await factory.attrs('User');
      const link = await factory.attrs('Link');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(link);

      const response = await request(app)
        .get(`/${link.url}`)
        .send();

      expect(response.body).toHaveProperty('redirect_url');
    });
  });
});
