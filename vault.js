/* All user records stay local and are encrypted with the user's vault password.
   Nothing is transmitted to Vercel, the source repository, or a remote server. */
const NAME='propertyos-encrypted-vault-v1';
const STORE='storage';
const ITERATIONS=310000;
let activeKey=null;
let activeSalt=null;
const enc=new TextEncoder(), dec=new TextDecoder();

function database(){return new Promise((resolve,reject)=>{
 const request=indexedDB.open(NAME,1);
 request.onupgradeneeded=()=>request.result.createObjectStore(STORE);
 request.onsuccess=()=>resolve(request.result);
 request.onerror=()=>reject(request.error);
});}
async function get(key){const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{db.close();}}
async function put(key,value){const db=await database();try{await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
function toB64(buffer){const arr=new Uint8Array(buffer);let str='';for(let i=0;i<arr.length;i+=8192)str+=String.fromCharCode(...arr.subarray(i,i+8192));return btoa(str);}
function fromB64(value){const binary=atob(value),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes;}
function randomBytes(n){return crypto.getRandomValues(new Uint8Array(n));}
async function keyFor(password,salt){const material=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function wrap(data,key,salt){const iv=randomBytes(12),clear=enc.encode(JSON.stringify(data));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,clear);return {format:'propertyos-vault',version:1,iterations:ITERATIONS,salt:toB64(salt),iv:toB64(iv),ciphertext:toB64(encrypted),updatedAt:new Date().toISOString()};}
async function unwrap(record,key){const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(record.iv)},key,fromB64(record.ciphertext));return JSON.parse(dec.decode(clear));}
export async function vaultExists(){return !!(await get('vault'));}
export async function initializeVault(password,initial){if(await vaultExists())throw new Error('A vault already exists on this device');const salt=randomBytes(16),key=await keyFor(password,salt);const record=await wrap(initial,key,salt);await put('vault',record);activeKey=key;activeSalt=salt;}
export async function unlockVault(password){const record=await get('vault');if(!record)throw new Error('No vault was found');const key=await keyFor(password,fromB64(record.salt));let data;try{data=await unwrap(record,key);}catch{throw new Error('Incorrect password or damaged vault');}activeKey=key;activeSalt=fromB64(record.salt);return data;}
export async function persistVault(data){if(!activeKey||!activeSalt)throw new Error('Vault is locked');await put('vault',await wrap(data,activeKey,activeSalt));}
export function lockVault(){activeKey=null;activeSalt=null;}
export async function changeVaultPassword(current,newPassword,data){const record=await get('vault');if(!record)throw new Error('Vault not found');try{await unwrap(record,await keyFor(current,fromB64(record.salt)));}catch{throw new Error('Current password is incorrect');}const salt=randomBytes(16),key=await keyFor(newPassword,salt);await put('vault',await wrap(data,key,salt));activeKey=key;activeSalt=salt;}
export async function exportEncryptedVault(){const record=await get('vault');if(!record)throw new Error('Nothing to export');return record;}
export async function importEncryptedVault(record,password){if(record?.format!=='propertyos-vault'||record.version!==1||!record.salt||!record.iv||!record.ciphertext||record.iterations!==ITERATIONS)throw new Error('Not a compatible PropertyOS backup');const key=await keyFor(password,fromB64(record.salt));let data;try{data=await unwrap(record,key);}catch{throw new Error('Wrong backup password or corrupted backup');}if(!data||!Array.isArray(data.properties)||!Array.isArray(data.invoices))throw new Error('Invalid data structure');await put('vault',record);activeKey=key;activeSalt=fromB64(record.salt);return data;}
