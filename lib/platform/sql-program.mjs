// Shared between the actual sandbox worker and its SQLite integration tests.
// Each run creates and closes a fresh in-memory database.
export const sqlProgram=String.raw`
const SQL=await initSqlJs();const db=new SQL.Database();let iterator;
let statements=0,rows=0;
try{
 iterator=db.iterateStatements(source);
 while(true){
  const remaining=iterator.getRemainingSQL();
  const leading=remaining.match(/^(?:\s|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*/)[0].length;
  statementLine=source.slice(0,source.length-remaining.length+leading).split('\n').length;
  const next=iterator.next();if(next.done)break;
  if(++statements>100)throw new Error('Keep each run to 100 SQL statements.');
  const statement=next.value,columns=statement.getColumnNames();
  if(columns.length)emit(columns.join(' | '));
  while(statement.step()){
   if(++rows>100)throw new Error('Result limit reached (100 rows). Add a LIMIT clause.');
   emit(JSON.stringify(statement.getAsObject()));
  }
 }
 emit('Completed '+statements+' statement(s), '+rows+' result row(s). Fresh database for each Run.');
}finally{if(iterator)iterator.return();db.close()}
`;
