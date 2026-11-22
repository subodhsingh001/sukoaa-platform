export type GenLesson={id:string;title:string;simple:string;analogy:string;engineering:string[];example:string;misconception:string;exercise:{prompt:string;solution:string};interview:{question:string;answer:string;followUp:string;followUpAnswer:string};stages:{title:string;detail:string}[];order:number;group:string;minutes:number;prerequisites:string;references:{title:string;url:string}[];lab:string};
export type GenSummary=Pick<GenLesson,'id'|'title'|'simple'|'order'|'group'|'minutes'>;
export type GenProgress={version:1;completed:string[];bookmarks:string[];notes:Record<string,string>};
