require('dotenv').config()
const connectDB = require('./config/db')
const app = require('./app')
const PORT = process.env.PORT || 5000
const startServer = async () => {

  await connectDB();
  app.listen(PORT, () => console.log(`Serveur démarré sur ${PORT}`));
};
startServer();