// Client-safe metadata. Runner URLs, keys and language IDs stay server-side.
export const remoteLanguages=['python','go','c','cpp','rust','csharp','java'] as const;
export type RemoteLanguage=typeof remoteLanguages[number];
export const isRemoteLanguage=(value:unknown):value is RemoteLanguage=>typeof value==='string'&&(remoteLanguages as readonly string[]).includes(value);
export const compiledLanguages=['c','cpp','rust','csharp','java'] as const;
export const remoteLanguageNames:Record<RemoteLanguage,string>={python:'Python',go:'Go',c:'C',cpp:'C++',rust:'Rust',csharp:'C#',java:'Java'};
export const runnerLanguageEnv:Record<RemoteLanguage,string>={python:'JUDGE0_PYTHON_ID',go:'JUDGE0_GO_ID',c:'JUDGE0_C_ID',cpp:'JUDGE0_CPP_ID',rust:'JUDGE0_RUST_ID',csharp:'JUDGE0_CSHARP_ID',java:'JUDGE0_JAVA_ID'};
