import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';
dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url)),quiet:true});
export function configFromEnv(){
 const {MONGODB_URI,SESSION_SECRET,NODE_ENV='development',CLIENT_ORIGIN='http://127.0.0.1:5175',PORT='4000',TRUST_PROXY}=process.env;
 if(!MONGODB_URI||!SESSION_SECRET||SESSION_SECRET.length<32||SESSION_SECRET.startsWith('replace-'))throw new Error('Set MONGODB_URI and a random SESSION_SECRET (32+ characters) in server/.env.');
 return {mongoUri:MONGODB_URI,sessionSecret:SESSION_SECRET,production:NODE_ENV==='production',origin:new URL(CLIENT_ORIGIN).origin,port:Number(PORT),trustProxy:TRUST_PROXY==='true'};
}
