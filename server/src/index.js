import mongoose from 'mongoose';
import {configFromEnv} from './config.js';
import {initializeModels} from './models/index.js';
import {createApp} from './app.js';
const config=configFromEnv();
await mongoose.connect(config.mongoUri,{serverSelectionTimeoutMS:5000});
await initializeModels();
const server=createApp(config).listen(config.port,'127.0.0.1',()=>console.log(`Placement API ready at http://127.0.0.1:${config.port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await mongoose.disconnect();process.exit(0)}));
