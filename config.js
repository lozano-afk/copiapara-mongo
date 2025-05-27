import "dotenv/config";

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/miapp_dev'
    },
    server: {
      port: process.env.SERVER_PORT || 3000
    }
  },
  test: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/miapp_test'
    },
    server: {
      port: process.env.SERVER_PORT || 3001
    }
  },
  production: {
    mongodb: {
      uri: process.env.MONGODB_URI
    },
    server: {
      port: process.env.SERVER_PORT || 3000
    }
  }
};

export default config[env];