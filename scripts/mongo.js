import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {MongoMemoryServer} from 'mongodb-memory-server';
const dbPath=fileURLToPath(new URL('../.data/mongodb',import.meta.url));
await mkdir(dbPath,{recursive:true});
const mongo=await MongoMemoryServer.create({instance:{port:27017,dbPath,storageEngine:'wiredTiger'},binary:{version:'7.0.14'}});
console.log('Local MongoDB ready at mongodb://127.0.0.1:27017 — data persists in .data/mongodb');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await mongo.stop();process.exit(0)});
