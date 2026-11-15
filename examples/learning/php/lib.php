<?php
declare(strict_types=1);
function demo_handle(string $method, string $path, array $query, string $raw = ''): array {
    $products = [['id'=>1,'title'=>'Notebook','stock'=>5],['id'=>2,'title'=>'Lamp','stock'=>2],['id'=>3,'title'=>'Bag','stock'=>0]];
    if ($method === 'GET' && $path === '/health') return [200, ['ok'=>true]];
    if ($method === 'GET' && $path === '/products') {
        if (isset($query['in_stock']) && !in_array($query['in_stock'], ['true','false'], true)) return [400,['error'=>'Use in_stock=true or false']];
        $rows = isset($query['in_stock']) ? array_filter($products, fn($p) => ($p['stock'] > 0) === ($query['in_stock'] === 'true')) : $products;
        return [200,['data'=>array_values($rows)]];
    }
    if ($method === 'POST' && $path === '/echo') {
        if (strlen($raw) > 8000) return [413,['error'=>'Body too large']];
        try { $data = json_decode($raw, false, 32, JSON_THROW_ON_ERROR); }
        catch (JsonException $e) { return [400,['error'=>'Invalid JSON']]; }
        if (!is_object($data)) return [422,['error'=>'Send a JSON object']];
        return [200,['data'=>$data,'persisted'=>false]];
    }
    return [404,['error'=>'Not found']];
}
