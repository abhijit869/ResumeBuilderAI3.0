/**
 * MongoDB Atlas Connection Pool Singleton for Next.js App Router
 *
 * Implements recommended Next.js caching on global namespace to prevent
 * excessive connection pooling during Hot Module Replacement (HMR).
 */

import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const defaultDbName = process.env.MONGODB_DB_NAME || 'resumebuilderai_db';

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI || '';
  return Boolean(uri && uri.startsWith('mongodb'));
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI || '';
  const defaultDbName = process.env.MONGODB_DB_NAME || 'resumebuilderai_db';

  if (!isMongoConfigured()) {
    return Promise.reject(
      new Error('MONGODB_URI is not configured in environment variables.')
    );
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the MongoClient instance
    // is not recreated on every module reload caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, it is best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Retrieves the default database instance.
 */
export async function getMongoDb(dbName: string = defaultDbName): Promise<Db> {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db(dbName);
}

export default getMongoClientPromise;
