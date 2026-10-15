import {timingSafeEqual,randomBytes} from 'node:crypto';
import {User} from '../models/index.js';
export function publicUser(user){return {id:user.id,name:user.name,email:user.email,role:user.role,isApproved:user.isApproved,isActive:user.isActive}}
export async function authenticate(req,res,next){if(!req.session.userId)return res.status(401).json({message:'Please sign in to continue.'});const user=await User.findById(req.session.userId);if(!user||!user.isActive)return res.status(401).json({message:'Your session is no longer active. Please sign in again.'});req.user=user;next()}
export const authorize=(...roles)=>(req,res,next)=>{if(!roles.includes(req.user.role))return res.status(403).json({message:'You do not have permission to perform this action.'});next()};
export function approvedRecruiter(req,res,next){if(!req.user.isApproved)return res.status(403).json({message:'An admin must approve your placement staff account before you can manage opportunities.'});next()}
export function csrfToken(req){return req.session.csrfToken??=(randomBytes(32).toString('hex'))}
export function csrfGuard(origin){return(req,res,next)=>{if(['GET','HEAD','OPTIONS'].includes(req.method))return next();if(req.headers.origin&&req.headers.origin!==origin)return res.status(403).json({message:'This request origin is not allowed.'});const token=req.get('X-CSRF-Token')||'';const expected=req.session.csrfToken||'';if(!expected||!/^([a-f0-9]{64})$/.test(token)||!timingSafeEqual(Buffer.from(token),Buffer.from(expected)))return res.status(403).json({message:'Session expired. Refresh the page and try again.'});if(!req.is('application/json'))return res.status(415).json({message:'Send requests as application/json.'});next()}}
export function newSession(req,user){return new Promise((resolve,reject)=>req.session.regenerate(error=>{if(error)return reject(error);req.session.userId=user.id;csrfToken(req);req.session.save(error=>error?reject(error):resolve())}))}


