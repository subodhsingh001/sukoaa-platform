Sukoaa Laravel 13 API learning starter — local setup required.
Requirements: PHP 8.3+ with Laravel-required extensions, Composer 2.
1. composer install
2. Copy .env.example to .env (PowerShell: Copy-Item .env.example .env).
3. php artisan key:generate
4. composer test
5. php artisan serve --host=127.0.0.1 --port=8003
Try GET /api/products, GET /api/products/1 and POST /api/products.
Send Accept: application/json and Content-Type: application/json.
POST validates title and a positive price, returns 201 and persisted:false.
This minimal teaching app uses fictional data and no database or auth.
The browser route compiler is available separately at /labs/laravel.
This download is a local teaching starter, not a production application.
