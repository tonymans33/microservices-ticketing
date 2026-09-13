import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

jest.setTimeout(60000);

let mongo: MongoMemoryServer;

declare global {
  var signin: (id?: string) => string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = 'test_jwt_key';

  mongo = await MongoMemoryServer.create({
    instance: {
      ip: '127.0.0.1',
    },
  });
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db!.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();

  if (mongo) {
    await mongo.stop({ doCleanup: true, force: true });
  }
});

global.signin = (id?: string) => {
  const payload = {
      id: id || new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
   
  return [`session=${base64}`];
};
