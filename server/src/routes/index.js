import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {authenticate,authorize,approvedRecruiter,csrfToken} from '../middleware/auth.js';
import * as v from '../middleware/validation.js';
import * as auth from '../controllers/auth.js';
import * as placement from '../controllers/placement.js';
import * as admin from '../controllers/admin.js';
export const api=Router();
const authLimit=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-8',legacyHeaders:false,message:{message:'Too many sign-in attempts. Please try again in 15 minutes.'}});
api.get('/auth/csrf',(req,res)=>res.json({csrfToken:csrfToken(req)}));
api.post('/auth/register',authLimit,v.validate(v.registerSchema),auth.register);
api.post('/auth/login',authLimit,v.validate(v.loginSchema),auth.login);
api.get('/auth/me',authenticate,auth.me);
api.post('/auth/logout',auth.logout);
api.use(authenticate);
api.put('/students/me',authorize('student'),v.validate(v.profileSchema),placement.updateProfile);
api.get('/students/me/applications',authorize('student'),placement.myApplications);
api.get('/jobs',v.validate(v.jobsQuerySchema,'query'),placement.listJobs);
api.post('/jobs',authorize('recruiter','placement_officer'),approvedRecruiter,v.validate(v.jobSchema),placement.createJob);
api.get('/jobs/:id',v.objectId,placement.jobDetails);
api.put('/jobs/:id',authorize('recruiter','placement_officer'),approvedRecruiter,v.objectId,v.validate(v.jobSchema),placement.editJob);
api.post('/jobs/:id/applications',authorize('student'),v.objectId,placement.apply);
api.get('/jobs/:id/applications',authorize('recruiter','placement_officer'),approvedRecruiter,v.objectId,placement.applicants);
api.patch('/applications/:id/status',authorize('recruiter','placement_officer'),approvedRecruiter,v.objectId,v.validate(v.statusSchema),placement.updateStatus);
api.get('/admin/recruiters',authorize('admin'),admin.recruiters);
api.patch('/admin/recruiters/:id/approval',authorize('admin'),v.objectId,v.validate(v.approvalSchema),admin.approveRecruiter);
api.get('/admin/users',authorize('admin'),admin.users);
api.patch('/admin/users/:id/role',authorize('admin'),v.objectId,v.validate(v.staffRoleSchema),admin.updateStaffRole);
api.patch('/admin/users/:id',authorize('admin'),v.objectId,v.validate(v.activeSchema),admin.updateUser);
api.get('/admin/jobs',authorize('admin'),admin.jobs);
api.patch('/admin/jobs/:id',authorize('admin'),v.objectId,v.validate(v.activeSchema),admin.updateJob);




