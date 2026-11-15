<?php
namespace Tests\Feature;
class ProductsTest extends \Tests\TestCase {
 public function test_index(): void { $this->getJson('/api/products')->assertOk()->assertJsonCount(2,'data'); }
 public function test_missing(): void { $this->getJson('/api/products/99')->assertNotFound(); }
 public function test_validation(): void { $this->postJson('/api/products',['title'=>'Pen','price'=>-1])->assertUnprocessable(); }
 public function test_creation_is_simulated(): void { $this->postJson('/api/products',['title'=>'Pen','price'=>3])->assertCreated()->assertJsonPath('persisted',false); }
}
