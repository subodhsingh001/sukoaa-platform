"use client";
import {ArrowLeft} from 'lucide-react';
import {useState} from 'react';
import {StudioWorkspace} from '@/components/studio/StudioWorkspace';
import ExpoWorkspace from './ExpoWorkspace';
export default function NativeWorkspace(){const [expo,setExpo]=useState(false);return expo?<><button className="native-expo-back" onClick={()=>setExpo(false)}><ArrowLeft size={16} aria-hidden="true"/> Back to Sukoaa React Native Web Studio</button><ExpoWorkspace/></>:<StudioWorkspace nativeMode onExpo={()=>setExpo(true)}/>}
