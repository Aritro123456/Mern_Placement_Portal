import mongoose from 'mongoose';
import {configFromEnv} from './config.js';
import {initializeModels} from './models/index.js';
import {createApp} from './app.js';
const config=configFromEnv();
await mongoose.connect(config.mongoUri,{serverSelectionTimeoutMS:5000});
await initializeModels();
const server=createApp(config).listen(config.port,config.host,()=>console.log(`Placement API listening on ${config.host}:${config.port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await mongoose.disconnect();process.exit(0)}));
