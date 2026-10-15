export function eligibilityReason(profile,job,now=new Date()){
 if(!job.isActive)return 'This job is no longer accepting applications.';
 if(new Date(job.deadline)<=now)return 'The application deadline has passed.';
 if(!profile)return 'Complete your student profile before applying.';
 if(profile.cgpa<job.minimumCgpa)return `This job requires a CGPA of ${job.minimumCgpa.toFixed(1)} or higher.`;
 if(!job.allowedBranches.includes(profile.branch))return `This job is open to ${job.allowedBranches.join(', ')} branches.`;
 if(profile.graduationYear!==job.graduationYear)return `This job is for the graduating class of ${job.graduationYear}.`;
 return null;
}
