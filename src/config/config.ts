export default {
  jwtSecret: process.env.JWT_SECRET || 'tokenasd123',
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost/notasapp',
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD,
  },
};
