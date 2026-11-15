export const fastapiAdapter=String.raw`
import json as _json
from urllib.parse import urlsplit as _urlsplit
async def _direct(func,*args,**kwargs):
    return func(*args,**kwargs)
import starlette.concurrency as _sc, starlette.routing as _sr, starlette.background as _sb
import fastapi.routing as _fr, fastapi.dependencies.utils as _fu
for _module in (_sc,_sr,_sb,_fr,_fu):
    if hasattr(_module,'run_in_threadpool'):
        _module.run_in_threadpool=_direct
async def _sukoaa_request(source,method,path,body):
    namespace={'__name__':'__main__','__file__':'main.py'}
    exec(compile(source,'main.py','exec'),namespace)
    app=namespace.get('app')
    if app is None: raise ValueError('Define app = FastAPI() in main.py.')
    parsed=_urlsplit(path)
    raw=body.encode()
    scope={'type':'http','asgi':{'version':'3.0','spec_version':'2.3'},'http_version':'1.1','method':method,'scheme':'http','path':parsed.path,'raw_path':parsed.path.encode(),'query_string':parsed.query.encode(),'root_path':'','headers':[(b'host',b'testserver'),(b'content-type',b'application/json'),(b'accept',b'application/json'),(b'content-length',str(len(raw)).encode())],'server':('testserver',80),'client':('127.0.0.1',1234)}
    messages=[]
    received=False
    async def receive():
        nonlocal received
        if not received:
            received=True
            return {'type':'http.request','body':raw,'more_body':False}
        return {'type':'http.disconnect'}
    async def send(message):
        messages.append(message)
        if sum(len(m.get('body',b'')) for m in messages)>100000: raise ValueError('Response exceeded 100 KB.')
    async with app.router.lifespan_context(app):
        await app(scope,receive,send)
    start=next((m for m in messages if m['type']=='http.response.start'),{})
    return _json.dumps({'status':start.get('status',500),'headers':[[k.decode('latin1'),v.decode('latin1')] for k,v in start.get('headers',[])],'body':b''.join(m.get('body',b'') for m in messages).decode('utf-8','replace')})
`;
