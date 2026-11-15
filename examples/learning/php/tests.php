<?php
require __DIR__.'/lib.php';
function check(bool $ok, string $message): void { if (!$ok) throw new RuntimeException($message); }
check(demo_handle('GET','/health',[])[1]['ok'] === true, 'health');
check(count(demo_handle('GET','/products',['in_stock'=>'true'])[1]['data']) === 2, 'filter');
check(demo_handle('POST','/echo',[], '{broken')[0] === 400, 'invalid JSON');
check(demo_handle('POST','/echo',[], '[]')[0] === 422, 'object shape');
check(demo_handle('GET','/missing',[])[0] === 404, 'not found');
echo "5 PHP checks passed\n";
