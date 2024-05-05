const { Role } = require('../../models');
const roles = require('../../config/roles');

/**
 * Build Roles Array to Seed User Roles to the Database
 * In Roles collection
 * @returns {Promise<[{name: string},{name: string}]>}
 */
const rolesList = () => {
  return [
    {
      name: roles.admin,
    },
    {
      name: roles.user,
    },
  ];
};

/**
 * Run The above configured Seeders
 * @returns {Promise<void>}
 */
const seedDB = async () => {
  // Delete Previously stored Roles
  await Role.deleteMany({});

  // Seed Roles in DB
  await Role.insertMany(rolesList());
};

/**
 * Entry Point For seeder
 */
const seedRoles = () => {
  seedDB()
    .then(() => {
      console.log('Roles Seeded Successfully');
    })
    .catch(() => {
      console.log('Error Seeding Roles');
    });
};

module.exports = seedRoles;
