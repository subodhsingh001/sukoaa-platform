'use client';
import dynamic from 'next/dynamic';
import type { WorkbenchSlug } from '@/lib/workbench/catalog';
const loading = () => <p role="status">Opening file tools…</p>;
const Cleaner = dynamic(() => import('./CsvCleaner'), { loading }), Compare = dynamic(() => import('./SpreadsheetCompare'), { loading }), Images = dynamic(() => import('./BatchImages'), { loading }), Pdf = dynamic(() => import('./PdfOrganizer'), { loading }), Data = dynamic(() => import('./TestDataGenerator'), { loading });
export function WorkbenchClient({ slug }: {
    slug: WorkbenchSlug;
}) { return slug === 'csv-cleaner' ? <Cleaner /> : slug === 'spreadsheet-compare' ? <Compare /> : slug === 'batch-images' ? <Images /> : slug === 'pdf-organizer' ? <Pdf /> : <Data />; }
