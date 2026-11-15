import {starterFiles} from './starters';
export type BackendTechnology='fastapi'|'php'|'laravel';
export const backendSamples={fastapi:{filename:'main.py',path:'/products/2',source:starterFiles.fastapi['main.py']},laravel:{filename:'routes/api.php',path:'/api/products',source:starterFiles.laravel['routes/api.php']},php:{filename:'main.php',path:'/products',source:`<?php
$phones = [
    ['id'=>1,'name'=>'Phone A','inStock'=>true],
    ['id'=>2,'name'=>'Phone B','inStock'=>false],
    ['id'=>3,'name'=>'Phone C','inStock'=>true],
];
$available = array_values(array_filter($phones, fn($p) => $p['inStock']));
header('Content-Type: application/json');
echo json_encode(['data'=>$available,'method'=>$_SERVER['REQUEST_METHOD']], JSON_PRETTY_PRINT);
`}} satisfies Record<BackendTechnology,{filename:string;path:string;source:string}>;
