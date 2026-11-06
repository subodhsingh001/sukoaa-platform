// The real Requests package uses a browser transport adapter. No socket proxy,
// cookies, arbitrary package installation, or application credentials are exposed.
export const pythonHttpWrapper=String.raw`
import requests as _requests, json as _http_json, base64 as _http_base64, io as _http_io
from pyodide.ffi import run_sync as _http_run_sync
from js import sukoaaHttpRequest as _http_request

class _SukoaaHTTPAdapter(_requests.adapters.BaseAdapter):
    def send(self, request, stream=False, timeout=None, verify=True, cert=None, proxies=None):
        if stream or cert or proxies or verify is not True or request.body is not None:
            raise _requests.exceptions.RequestException("Streaming, proxies, custom certificates, and request bodies are not available in demo API mode.", request=request)
        if isinstance(timeout, tuple):
            timeout = next((v for v in reversed(timeout) if v is not None), 10)
        milliseconds = min(10000, max(1, float(timeout if timeout is not None else 10) * 1000))
        result = _http_json.loads(_http_run_sync(_http_request(request.url, request.method, _http_json.dumps(dict(request.headers)), milliseconds)))
        if not result["ok"]:
            error = _requests.exceptions.Timeout if result.get("kind") == "timeout" else _requests.exceptions.ConnectionError
            raise error(result.get("error", "API request failed."), request=request)
        response = _requests.Response()
        response.status_code = result["status"]
        response.url = result["url"]
        response.headers = _requests.structures.CaseInsensitiveDict(result.get("headers", {}))
        response._content = _http_base64.b64decode(result.get("body", ""))
        response._content_consumed = True
        response.raw = _http_io.BytesIO(response._content)
        response.encoding = _requests.utils.get_encoding_from_headers(response.headers)
        response.request = request
        return response
    def close(self):
        pass

_original_session_init = _requests.sessions.Session.__init__
def _sukoaa_session_init(self, *args, **kwargs):
    _original_session_init(self, *args, **kwargs)
    self.trust_env = False
    self.mount("https://", _SukoaaHTTPAdapter())
    self.mount("http://", _SukoaaHTTPAdapter())
_requests.sessions.Session.__init__ = _sukoaa_session_init
`;
