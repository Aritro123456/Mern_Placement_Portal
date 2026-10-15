import {User,Job} from '../models/index.js';
import {publicUser} from '../middleware/auth.js';
export async function recruiters(req,res){const users=await User.find({role:'recruiter'}).sort({isApproved:1,createdAt:-1}).limit(200);res.json({recruiters:users.map(publicUser)})}
export async function approveRecruiter(req,res){const user=await User.findOneAndUpdate({_id:req.params.id,role:'recruiter'},{$set:req.validated},{new:true});if(!user)return res.status(404).json({message:'Recruiter not found.'});res.json({user:publicUser(user)})}
export async function users(req,res){const users=await User.find().sort({createdAt:-1}).limit(200);res.json({users:users.map(publicUser)})}
export async function updateStaffRole(req,res){
 const {role}=req.validated;
 const user=await User.findOneAndUpdate({_id:req.params.id,role:{$in:['recruiter','placement_officer']}},{$set:{role,isApproved:role==='placement_officer'}},{new:true,runValidators:true});
 if(!user)return res.status(404).json({message:'Staff account not found. Students and admins cannot be reassigned here.'});
 res.json({user:publicUser(user)});
}
export async function updateUser(req,res){if(req.params.id===req.user.id)return res.status(400).json({message:'You cannot deactivate your own admin account.'});const user=await User.findOneAndUpdate({_id:req.params.id,role:{$ne:'admin'}},{$set:req.validated},{new:true});if(!user)return res.status(404).json({message:'User not found. Admin accounts cannot be changed here.'});res.json({user:publicUser(user)})}
export async function jobs(req,res){res.json({jobs:await Job.find().populate('recruiterId','name email').sort({createdAt:-1}).limit(200)})}
export async function updateJob(req,res){const job=await Job.findByIdAndUpdate(req.params.id,{$set:req.validated},{new:true});if(!job)return res.status(404).json({message:'Job not found.'});res.json({job})}
