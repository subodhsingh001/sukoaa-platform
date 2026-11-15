<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::get('/products', function () { return ['data'=>[['id'=>1,'title'=>'Notebook','price'=>12],['id'=>2,'title'=>'Lamp','price'=>35]]]; });
Route::get('/products/{id}', function (string $id) { abort_unless(in_array($id,['1','2'],true),404); return ['id'=>(int)$id,'title'=>$id==='1'?'Notebook':'Lamp']; })->whereNumber('id');
Route::post('/products', function (Request $request) { $data=$request->validate(['title'=>['required','string','max:120'],'price'=>['required','numeric','gt:0']]); return response()->json(['data'=>['id'=>3,...$data],'persisted'=>false],201); });
