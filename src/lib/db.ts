import mongoose from "mongoose";

// Connection object type

type ConnectionObjectType = {
  // Indicates whether the database connection is established
  isConnected?: number;
};

// Connection object
const connection: ConnectionObjectType = {};

const connectDb = async (): Promise<void> => {
  // Check if the connection is already established
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }

  try {
    //  Establish a new connection to the MongoDB database
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    // Update the connection object with the ready state
    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to Database");
  } catch (error) {
    /*
     * Handle connection errors
     */
    console.log("Database Connection failed ", error);
    process.exit(1);
  }
};

export default connectDb;
