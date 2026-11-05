import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/platform/auth';
import SetupGuide from '@/components/admin/SetupGuide';
export const dynamic='force-dynamic';
export default async function AdminSetup(){
 let allowed=false;
 try{await requireAdmin();allowed=true}catch{}
 if(!allowed)notFound();
 return <SetupGuide/>;
}
