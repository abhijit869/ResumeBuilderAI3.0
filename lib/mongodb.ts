/**
 * MongoDB Atlas Cloud Connection Pool Singleton for Next.js App Router
 *
 * Connects directly to the user's MongoDB Atlas Cloud Cluster
 * (Cluster0: cluster0.0079pe2.mongodb.net / database: resumebuilderai_db).
 *
 * Implements connection caching on the global namespace to prevent
 * excessive connection pooling during Next.js Hot Module Replacement (HMR).
 */

import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const defaultDbName = process.env.MONGODB_DB_NAME || 'resumebuilderai_db';

const atlasOptions: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  tls: true,
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  const connectionUri = process.env.MONGODB_URI || '';
  return Boolean(connectionUri && connectionUri.startsWith('mongodb'));
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const connectionUri = process.env.MONGODB_URI || '';

  if (!isMongoConfigured()) {
    return Promise.reject(
      new Error('MONGODB_URI is not configured in environment variables.')
    );
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(connectionUri, atlasOptions);
    global._mongoClientPromise = client.connect().catch(async (err) => {
      global._mongoClientPromise = undefined;
      await client.close().catch(() => {});
      throw err;
    });
  }
  return global._mongoClientPromise;
}

/**
 * Retrieves the default MongoDB Atlas database instance.
 */
export async function getMongoDb(dbName: string = defaultDbName): Promise<Db> {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db(dbName);
}

export default getMongoClientPromise;
