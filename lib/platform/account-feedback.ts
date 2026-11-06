export type AccountUser = {id:string;email?:string};
export type AccountFields = {email?:string;password?:string;confirmPassword?:string};
export function validateAccount(mode:'login'|'signup',email:string,password:string,confirmPassword=''):AccountFields {
 const errors:AccountFields={};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())||email.trim().length>254)errors.email='Enter a valid email address.';
 if(password.length<8||password.length>128)errors.password='Use a password between 8 and 128 characters.';
 if(mode==='signup'&&password!==confirmPassword)errors.confirmPassword='Your passwords do not match.';
 return errors;
}
export function authenticatedUser(value:unknown):value is AccountUser {
 return !!value&&typeof value==='object'&&typeof (value as AccountUser).id==='string'&&!!(value as AccountUser).id;
}
export function accountDestination(result:{user?:unknown;confirmationRequired?:boolean;authenticated?:boolean}):'home'|'confirm' {
 return result.confirmationRequired!==true&&result.authenticated!==false&&authenticatedUser(result.user)?'home':'confirm';
}
