import {createContext,useContext,useEffect,useState} from 'react';
import {api} from '../services/api';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true),[connectionError,setConnectionError]=useState('');
 async function refresh(){try{const data=await api('/auth/me');setUser(data.user);setProfile(data.profile);setConnectionError('')}catch(error){if(error.status===401){setUser(null);setProfile(null)}else setConnectionError(error.message)}finally{setLoading(false)}}
 useEffect(()=>{refresh()},[]);
 async function signIn(path,body){const data=await api(path,{method:'POST',body});setUser(data.user);await refresh();return data.user}
 async function signOut(){await api('/auth/logout',{method:'POST',body:{}});setUser(null);setProfile(null)}
 return <AuthContext.Provider value={{user,profile,loading,connectionError,refresh,signIn,signOut}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
