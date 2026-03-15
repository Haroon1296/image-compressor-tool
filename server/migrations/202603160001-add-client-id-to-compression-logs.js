'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('compression_logs', 'client_id', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'unknown'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('compression_logs', 'client_id');
  }
};
