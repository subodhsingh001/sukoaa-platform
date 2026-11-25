'use client';
import {useState} from 'react';
import styles from './product.module.css';
export function CopyCommand({command}:{command:string}){const [status,setStatus]=useState('');return <div className={styles.command}><code>{command}</code><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(command);setStatus('Copied')}catch{setStatus('Select and copy the command manually')}}}>Copy</button><span role="status">{status}</span></div>}
