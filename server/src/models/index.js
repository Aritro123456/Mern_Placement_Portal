import mongoose from 'mongoose';
const {Schema,model}=mongoose;
export const statuses=['applied','shortlisted','interview','selected','rejected'];
const userSchema=new Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true,lowercase:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:['student','recruiter','placement_officer','admin'],required:true},isApproved:{type:Boolean,default:false},isActive:{type:Boolean,default:true}},{timestamps:true});
export const User=model('User',userSchema);
const profileSchema=new Schema({userId:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true},college:{type:String,required:true},branch:{type:String,required:true},graduationYear:{type:Number,required:true},cgpa:{type:Number,required:true,min:0,max:10},skills:[String],resumeUrl:{type:String,default:''}},{timestamps:true});
export const StudentProfile=model('StudentProfile',profileSchema);
const jobSchema=new Schema({recruiterId:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},company:{type:String,required:true},title:{type:String,required:true},description:{type:String,required:true},location:{type:String,required:true},salary:{type:String,required:true},allowedBranches:{type:[String],required:true},minimumCgpa:{type:Number,min:0,max:10,required:true},graduationYear:{type:Number,required:true},deadline:{type:Date,required:true},isActive:{type:Boolean,default:true}},{timestamps:true});
jobSchema.index({isActive:1,deadline:1,createdAt:-1});
export const Job=model('Job',jobSchema);
const historySchema=new Schema({status:{type:String,enum:statuses,required:true},changedAt:{type:Date,required:true},changedBy:{type:Schema.Types.ObjectId,ref:'User',required:true}},{_id:false});
const applicationSchema=new Schema({jobId:{type:Schema.Types.ObjectId,ref:'Job',required:true},studentId:{type:Schema.Types.ObjectId,ref:'User',required:true},status:{type:String,enum:statuses,default:'applied'},appliedAt:{type:Date,default:Date.now},statusHistory:[historySchema]});
applicationSchema.index({jobId:1,studentId:1},{unique:true});
applicationSchema.index({studentId:1,appliedAt:-1});
export const Application=model('Application',applicationSchema);
export async function initializeModels(){await Promise.all([User,StudentProfile,Job,Application].map(m=>m.init()))}

