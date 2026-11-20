export const workbenchTools = [
    { slug: 'csv-cleaner', name: 'CSV cleaner', description: 'Clean CSV, Excel and JSON locally. Preview transformations, undo changes and reuse cleaning recipes.', lead: 'Preserve identifiers, inspect each change and export a clean table.', group: 'Data' },
    { slug: 'spreadsheet-compare', name: 'Spreadsheet comparison', description: 'Compare CSV and Excel records by a unique ID. Find added, removed and changed records and download a difference report.', lead: 'Compare records by ID even when rows move. Duplicate and empty keys are flagged.', group: 'Data' },
    { slug: 'batch-images', name: 'Batch image tools', description: 'Resize, compress and convert JPG, PNG and WebP batches. Add watermarks and download images with a size report.', lead: 'Prepare consistent image sizes, compare the output and download the batch.', group: 'Images' },
    { slug: 'pdf-organizer', name: 'PDF page organizer', description: 'Merge, split, rotate and reorder PDF pages locally. Preview thumbnails, undo actions and export selected pages.', lead: 'Assemble a separate document from your PDFs without overwriting the originals.', group: 'Documents' },
    { slug: 'test-data-generator', name: 'Test-data generator', description: 'Generate repeatable synthetic customers, products and orders with valid references. Export JSON, CSV, SQL, seed and schema.', lead: 'Use the same seed to reproduce fixtures. Define fields and link child records to their parents.', group: 'Code' }
] as const;
export type WorkbenchSlug = typeof workbenchTools[number]['slug'];
export const workbenchPaths = ['/tools/data-workbench', ...workbenchTools.map(t => '/tools/' + t.slug)];
