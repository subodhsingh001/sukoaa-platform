'use client';
import {Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import {StudioWorkspace} from '@/components/studio/StudioWorkspace';
function CurrentStudio(){const query=useSearchParams();return <StudioWorkspace key={query.toString()}/>}
export default function Studio(){return <Suspense fallback={<p>Opening Project Studio…</p>}><CurrentStudio/></Suspense>}
