import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Link from '../src/app/models/Link';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Link', Link, {
  title: faker.name.firstName(),
  url: faker.name.firstName(),
  redirect_url: faker.internet.url(),
});

faker.locale = 'pt_BR';

export default factory;
