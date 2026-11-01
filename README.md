# NutriShare — Healthy Diet Food Sharing Community Platform
Full-stack starter project: React + Tailwind CSS frontend, Laravel 12 API backend, MySQL database.

## 1) Requirements
- PHP 8.2+
- Composer 2
- Node.js 18+
- XAMPP (Apache + MySQL)
- VS Code

## 2) Database setup
1. Start Apache and MySQL from XAMPP.
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create a database named `nutrishare`.
4. Copy `backend/.env.example` to `backend/.env`.
5. Check DB settings in `.env` (default XAMPP MySQL user is `root`, password is blank).

## 3) Start Laravel backend
Open terminal in `backend`:
```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
API runs at http://127.0.0.1:8000

## 4) Start React frontend
Open a second terminal in `frontend`:
```bash
npm install
npm run dev
```
Open the Vite URL, usually http://localhost:5173

## 5) Demo accounts
- Admin: `admin@nutrishare.com` / `Admin@123`
- Member: `member@nutrishare.com` / `Member@123`

Change these passwords before any real deployment. Demo accounts are for local coursework testing only.

## 6) Roles and features
### Member
Register/login, browse food posts, search/filter, create/edit/delete own posts, upload food image, recipe ingredients/instructions, nutrition values, like, comment, bookmark, rate, report.

### Admin
Admin dashboard, manage all posts, manage categories, view users, review/resolve reports.

## 7) Important notes
- This is a coursework starter implementation, not a production-hardened service.
- API authentication uses Laravel Sanctum personal access tokens.
- Admin access is checked on the server using role middleware; hiding admin links in React is not security.
- Uploaded images are stored in Laravel `storage/app/public`.
- Food nutrition values are user-provided estimates, not medically verified advice.
