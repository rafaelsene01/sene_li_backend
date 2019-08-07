import request from 'supertest';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

// code is working but access testing is in trouble, apparently has to do with my custom attributes part

describe('Accecce', () => {
  describe('Show', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('valid access return check', async () => {
      const user = await factory.attrs('User');
      const link = await factory.attrs('Link');

      await request(app)
        .post('/new/users')
        .send(user);

      const login = await request(app)
        .post('/new/sessions')
        .send({ email: user.email, password: user.password });

      const myLink = await request(app)
        .post('/new/link')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(link);

      await request(app)
        .get(`/${myLink.body.url}`)
        .send();

      const response = await request(app)
        .get(`/${myLink.body.id}/accesses`)
        .set('Authorization', `Bearer ${login.body.token}`)
        .send();

      expect(response.status).toBe(200);
    });
  });
});
