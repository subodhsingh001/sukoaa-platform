"use client";
import {useState} from 'react';
import {StudioWorkspace} from '@/components/studio/StudioWorkspace';
import ExpoWorkspace from './ExpoWorkspace';
export default function NativeWorkspace(){const [expo,setExpo]=useState(false);return expo?<><button className="native-expo-back" onClick={()=>setExpo(false)}>← Back to Sukoaa React Native Web Studio</button><ExpoWorkspace/></>:<StudioWorkspace nativeMode onExpo={()=>setExpo(true)}/>}
