import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Navigate,Outlet,Link} from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import {Loading,Empty} from './components/UI';
import Layout from './components/Layout';
import AuthPage,{homeFor} from './pages/AuthPage';
import Jobs from './pages/Jobs';
import Landing from './pages/Landing';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import Recruiter from './pages/Recruiter';
import JobForm from './pages/JobForm';
import Applicants from './pages/Applicants';
import Admin from './pages/Admin';
import './styles.css';
function Protected({roles}){const {user,loading}=useAuth();if(loading)return <Loading/>;if(!user)return <Navigate to="/login" replace/>;if(roles&&!roles.includes(user.role))return <Navigate to={homeFor(user)} replace/>;return <Outlet/>}
function PublicAuth({register}){const {user,loading}=useAuth();if(loading)return <Loading/>;return user?<Navigate to={homeFor(user)} replace/>:<AuthPage register={register}/>}
function Home(){const {user}=useAuth();return <Navigate to={homeFor(user)} replace/>}
function App(){return <BrowserRouter basename={import.meta.env.BASE_URL}><AuthProvider><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<PublicAuth/>}/><Route path="/register" element={<PublicAuth register/>}/><Route element={<Protected/>}><Route element={<Layout/>}><Route path="jobs/:id" element={<JobDetails/>}/><Route element={<Protected roles={['student']}/>}><Route path="jobs" element={<Jobs/>}/><Route path="profile" element={<Profile/>}/><Route path="applications" element={<Applications/>}/></Route><Route element={<Protected roles={['recruiter','placement_officer']}/>}><Route path="recruiter" element={<Recruiter/>}/><Route path="recruiter/jobs/new" element={<JobForm/>}/><Route path="recruiter/jobs/:id/edit" element={<JobForm/>}/><Route path="recruiter/jobs/:id/applicants" element={<Applicants/>}/></Route><Route element={<Protected roles={['admin']}/>}><Route path="admin" element={<Admin/>}/><Route path="admin/users" element={<Admin mode="users"/>}/><Route path="admin/jobs" element={<Admin mode="jobs"/>}/></Route><Route path="*" element={<Empty title="This page took a different path"><Link to="/">Return to your workspace</Link></Empty>}/></Route></Route></Routes></AuthProvider></BrowserRouter>}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);


