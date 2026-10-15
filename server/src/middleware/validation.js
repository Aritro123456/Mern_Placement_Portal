import {z} from 'zod';
import {statuses} from '../models/index.js';
const text=(max=100)=>z.string().trim().min(1).max(max);
export const registerSchema=z.object({name:text(),email:z.email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(10).max(72).refine(value=>Buffer.byteLength(value,'utf8')<=72,'Password must be no more than 72 UTF-8 bytes'),role:z.enum(['student','recruiter'])}).strict();
export const loginSchema=z.object({email:z.email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(1).max(72)}).strict();
export const profileSchema=z.object({college:text(160),branch:text(60).transform(v=>v.toUpperCase()),graduationYear:z.number().int().min(2000).max(2100),cgpa:z.number().min(0).max(10),skills:z.array(text(50)).min(1).max(30),resumeUrl:z.union([z.literal(''),z.url().max(2048).refine(v=>new URL(v).protocol==='https:','Resume link must use HTTPS')]).default('')}).strict();
export const jobSchema=z.object({company:text(120),title:text(140),description:text(12000),location:text(120),salary:text(100),allowedBranches:z.array(text(60).transform(v=>v.toUpperCase())).min(1).max(30),minimumCgpa:z.number().min(0).max(10),graduationYear:z.number().int().min(2000).max(2100),deadline:z.iso.datetime({offset:true}).refine(v=>new Date(v)>new Date(),'Deadline must be in the future')}).strict();
export const statusSchema=z.object({status:z.enum(statuses)}).strict();
export const activeSchema=z.object({isActive:z.boolean()}).strict();
export const staffRoleSchema=z.object({role:z.enum(['recruiter','placement_officer'])}).strict();
export const approvalSchema=z.object({isApproved:z.boolean()}).strict();
export const jobsQuerySchema=z.object({page:z.coerce.number().int().min(1).max(10000).default(1),limit:z.coerce.number().int().min(1).max(50).default(9),search:z.string().trim().max(100).default(''),location:z.string().trim().max(100).default(''),branch:z.string().trim().max(60).default(''),eligible:z.enum(['true','false']).default('false'),mine:z.enum(['true','false']).default('false')}).strict();
export function validate(schema,target='body'){return(req,res,next)=>{const result=schema.safeParse(req[target]);if(!result.success)return res.status(400).json({message:result.error.issues[0].message,errors:result.error.issues.map(issue=>({field:issue.path.join('.'),message:issue.message}))});req.validated=result.data;next()}}
export function objectId(req,res,next){if(!/^[a-f\d]{24}$/i.test(req.params.id))return res.status(400).json({message:'Invalid resource ID.'});next()}

