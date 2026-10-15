import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'node:path';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {api} from './routes/index.js';
import {csrfGuard} from './middleware/auth.js';
export function createApp(config,{store}={}){
 const app=express();app.locals.config=config;
 if(config.trustProxy)app.set('trust proxy',1);
 app.disable('x-powered-by');app.use(helmet());
 app.use('/api',(req,res,next)=>{
  if(req.get('Origin')===config.origin){res.set('Access-Control-Allow-Origin',config.origin);res.set('Access-Control-Allow-Credentials','true');res.vary('Origin')}
  if(req.method==='OPTIONS'){
   if(req.get('Origin')!==config.origin)return res.sendStatus(403);
   res.set('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');
   res.set('Access-Control-Allow-Headers','Content-Type,X-CSRF-Token');
   return res.sendStatus(204);
  }
  next();
 });
 app.use('/api',rateLimit({windowMs:60*1000,limit:300,standardHeaders:'draft-8',legacyHeaders:false,message:{message:'Too many requests. Please try again shortly.'}}));
 app.use(express.json({limit:'32kb'}));
 app.use(session({name:'placement.sid',secret:config.sessionSecret,resave:false,saveUninitialized:false,store:store||MongoStore.create({client:mongoose.connection.getClient(),ttl:60*60*8}),cookie:{httpOnly:true,secure:config.production,sameSite:config.crossSiteCookies?'none':'strict',maxAge:1000*60*60*8,path:'/'}}));
 app.get('/api/health',(req,res)=>res.status(mongoose.connection.readyState===1?200:503).json({status:mongoose.connection.readyState===1?'ok':'unavailable'}));
 app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');next()},csrfGuard(config.origin),api);
 app.use('/api',(req,res)=>res.status(404).json({message:'API endpoint not found.'}));
 const clientPath=fileURLToPath(new URL('../../client/dist',import.meta.url));
 if(existsSync(path.join(clientPath,'index.html'))){app.use(express.static(clientPath));app.get('/{*path}',(req,res)=>res.sendFile(path.join(clientPath,'index.html')))}
 app.use((error,req,res,next)=>{if(res.headersSent)return next(error);if(error.code===11000)return res.status(409).json({message:error.keyPattern?.email?'An account with this email already exists.':'You have already applied to this job.'});if(error.type==='entity.parse.failed')return res.status(400).json({message:'Invalid JSON request.'});if(error.type==='entity.too.large')return res.status(413).json({message:'Request is too large.'});if(error.name==='ValidationError')return res.status(400).json({message:'The submitted data is invalid.'});console.error('API error:',error.name);res.status(500).json({message:'Something went wrong. Please try again.'})});
 return app;
}


