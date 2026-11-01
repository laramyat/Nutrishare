# Laravel API Backend
This folder contains the Laravel 12 API application source.

Configure `.env`, create the MySQL database `nutrishare`, then run:
```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
API base URL: `http://127.0.0.1:8000/api`

Demo login:
- admin@nutrishare.com / Admin@123
- member@nutrishare.com / Member@123
