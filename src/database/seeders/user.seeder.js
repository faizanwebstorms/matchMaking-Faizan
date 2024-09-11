const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { User, Role, Token, OTP, UserFollower, Post, Hashtag, UserRole } = require('../../models');
const roles = require('../../config/roles');

/**
 * Build 2 Users, with Admin and User role respectively
 * For testing
 * @returns {Promise<[{password: *, phoneNumber: string, roleId, name: string, uuid: (string|*), email: string, isEmailVerified: string, username: string},{password: *, phoneNumber: string, roleId, name: string, uuid: (string|*), email: string, isEmailVerified: string, username: string}]>}
 */
const seedUsers = async () => {
  return [
    {
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin1234', 8),
      isEmailVerified: 'false',
      username: 'admin12',
      phoneNumber: '1233211231',
      uuid: uuid.v4(),
    },
    {
      firstName: 'User',
      lastName: 'Test',
      email: 'user@user.com',
      password: await bcrypt.hash('user1234', 8),
      isEmailVerified: 'false',
      username: 'user12',
      phoneNumber: '1233211231',
      uuid: uuid.v4(),
    },
  ];
};

const assignRoles = async () => {
  const adminRole = await Role.findOne({ name: roles.admin });
  const userRole = await Role.findOne({ name: roles.user });
  const admin = await User.findOne({ firstName: 'Admin' });
  const user = await User.findOne({ firstName: 'User' });
  await UserRole.create({
    userId: admin._id,
    roleId: adminRole,
  });
  await UserRole.create({
    userId: user._id,
    roleId: userRole._id,
  });
};

const seedDB = async () => {
  // Delete All Users
  await User.deleteMany({});

  // Delete All tokens
  await Token.deleteMany({});

  // Delete all OTPs
  await OTP.deleteMany({});

  // Remove Followers and Following
  await UserFollower.deleteMany({});

  // Delete Posts
  await Post.deleteMany({});

  // Delete Post Hashtag
  await Hashtag.deleteMany({});

  // Seed above created Users
  await User.insertMany(await seedUsers());

  // Assign Roles
  await assignRoles();
};

/**
 * Entry Point for seeder
 */
const seedUser = () => {
  seedDB()
    .then(() => {
      console.log('User Collection Seeded Successfully');
    })
    .catch(() => {
      console.log('Error Seeding Users');
    });
};

module.exports = seedUser;
