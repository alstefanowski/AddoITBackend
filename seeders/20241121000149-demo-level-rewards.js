'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('LevelRewards', [
      {"level": 1, "experienceThreshold": 0, "goldReward": 0},
      {"level": 2, "experienceThreshold": 100, "goldReward": 10},
      {"level": 3, "experienceThreshold": 300, "goldReward": 20},
      {"level": 4, "experienceThreshold": 600, "goldReward": 30},
      {"level": 5, "experienceThreshold": 1000, "goldReward": 40},
      {"level": 6, "experienceThreshold": 1500, "goldReward": 50},
      {"level": 7, "experienceThreshold": 2100, "goldReward": 60},
      {"level": 8, "experienceThreshold": 2800, "goldReward": 70},
      {"level": 9, "experienceThreshold": 3600, "goldReward": 80},
      {"level": 10, "experienceThreshold": 4500, "goldReward": 90},
      {"level": 11, "experienceThreshold": 5500, "goldReward": 100},
      {"level": 12, "experienceThreshold": 6600, "goldReward": 110},
      {"level": 13, "experienceThreshold": 7800, "goldReward": 120},
      {"level": 14, "experienceThreshold": 9100, "goldReward": 130},
      {"level": 15, "experienceThreshold": 10500, "goldReward": 140},
      {"level": 16, "experienceThreshold": 12000, "goldReward": 150},
      {"level": 17, "experienceThreshold": 13600, "goldReward": 160},
      {"level": 18, "experienceThreshold": 15300, "goldReward": 170},
      {"level": 19, "experienceThreshold": 17100, "goldReward": 180},
      {"level": 20, "experienceThreshold": 19000, "goldReward": 190},
      {"level": 21, "experienceThreshold": 21000, "goldReward": 200},
      {"level": 22, "experienceThreshold": 23100, "goldReward": 210},
      {"level": 23, "experienceThreshold": 25300, "goldReward": 220},
      {"level": 24, "experienceThreshold": 27600, "goldReward": 230},
      {"level": 25, "experienceThreshold": 30000, "goldReward": 240},
      {"level": 26, "experienceThreshold": 32500, "goldReward": 250},
      {"level": 27, "experienceThreshold": 35100, "goldReward": 260},
      {"level": 28, "experienceThreshold": 37800, "goldReward": 270},
      {"level": 29, "experienceThreshold": 40600, "goldReward": 280},
      {"level": 30, "experienceThreshold": 43500, "goldReward": 290}
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('LevelRewards', null, {});
  }
};
