import mongoose from "mongoose";
import { MONGODB_URI } from "../../config";
import { User } from "../models/user-model";
import { Card } from "../models/card-model";






//change and adapte the code






// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    runFixtures();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define your fixtures
async function runFixtures() {
  try {

    await User.create({ username: 'admin', email: 'admin@gmail.com', password: 'admin@gmail.com', badge: 'gold', role: 'admin' }); 
    for (let index = 0; index < 10; index++) {
      await User.create({ username: `user${index}`, email: `user${index}@gmail.com`, password: `user${index}@gmail.com`}); 
    }

    for (let index = 0; index < 10; index++) {
      await Card.create({ name: `card${index}`, price: 100 });
    }

    console.log('Fixtures created successfully');
  } catch (error) {
    console.error('Error creating fixtures:', error);
  } finally {
    mongoose.connection.close();
  }
}
