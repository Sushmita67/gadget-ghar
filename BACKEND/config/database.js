const mongoose = require("mongoose");

exports.connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected at: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
  }

  // Optional: log the state
  const state = mongoose.connection.readyState;
  const states = {
    0: "🔴 Disconnected",
    1: "🟢 Connected",
    2: "🟡 Connecting",
    3: "🟠 Disconnecting",
  };

  console.log(`Mongoose connection state: ${states[state]}`);
};
