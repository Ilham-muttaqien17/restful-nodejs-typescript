import User from '@src/models/user.model';
import bcrypt from 'bcrypt';

const createTestUser = async () => {
  await User.create({
    name: 'test',
    password: bcrypt.hashSync('test123ASD', 10),
    email: 'test@gmail.com',
    description: 'test'
  });
};

const removeTestUser = async () => {
  await User.destroy({
    where: {
      email: 'test@gmail.com'
    }
  });
};

export default {
  createTestUser,
  removeTestUser
};
