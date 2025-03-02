const connectDB = require('../config/db');
const user = require('../models/user');
const note = require('../models/note');
require('dotenv').config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await user.deleteMany({});
    await note.deleteMany({});

    console.log('Existing data cleared');

    // Seed Users
    const users = await user.insertMany([
      { username: 'Adam', email: 'adam@example.com', password: "A123456789" },
      { username: 'Bob', email: 'bob@example.com', password: "B123456789" },
      { username: 'Conti', email: 'Conti@example.com', password: "C123456789" },
      { username: 'Dallas', email: 'dallas@example.com', password: "D123456789" },
    ]);

    console.log(`${users.length} users created`);

    // Seed Posts
    const notes = await note.insertMany([
      { title: 'Note 1', content: 'Content for note 1', user: users[0]._id },
      { title: 'Note 2', content: 'Content for note 2', user: users[1]._id },
      { title: 'Note 3', content: 'Content for note 3', user: users[2]._id },
      { title: 'Note 4', content: 'Content for note 4', user: users[3]._id },
      { title: 'Note 5', content: 'Content for note 5', user: users[0]._id },
    ]);

    console.log(`${notes.length} notes created`);

    console.log('Database seeding complete!');
    process.exit(0); // Exit the script
  } catch (error) {
    console.error('Error while seeding:', error.message);
    process.exit(1); // Exit with failure
  }
};

seedData();
