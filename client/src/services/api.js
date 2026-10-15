let csrfToken='';
const apiBase=(import.meta.env.VITE_API_URL||'/api').replace(/\/$/,'');
export async function api(path,{method='GET',body,signal}={}){
 if(import.meta.env.VITE_REQUIRE_API==='true'&&!import.meta.env.VITE_API_URL)throw new Error('The frontend is online. The backend has not been connected yet.');
 if(method!=='GET'&&!csrfToken){const response=await fetch(`${apiBase}/auth/csrf`,{credentials:'include',signal});if(!response.ok)throw new Error('Cannot connect to the server. Make sure the API and MongoDB are running.');csrfToken=(await response.json()).csrfToken}
 let response;try{response=await fetch(`${apiBase}${path}`,{method,credentials:'include',headers:{'Content-Type':'application/json',...(method==='GET'?{}:{'X-CSRF-Token':csrfToken})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal})}catch(error){if(error.name==='AbortError')throw error;throw new Error('Cannot connect to the server. Make sure the API and MongoDB are running.')}
 const data=await response.json().catch(()=>({message:'The server is unavailable. Please try again.'}));
 if(!response.ok){const error=new Error(data.message||'Request failed.');error.status=response.status;error.fields=data.errors;if(response.status===403)csrfToken='';throw error}
 if(data.csrfToken)csrfToken=data.csrfToken;
 if(path==='/auth/logout')csrfToken='';
 return data;
}
