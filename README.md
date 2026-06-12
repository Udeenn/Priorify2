## SETUP PROJECT LOKAL

### 1. Clone Repository

- Buka command promt atau git bash
- Pindah ke folder yang akan dijadikan tempat membuat project
  -- XAMPP (Folder htdoc)
  -- LARAGON (Folder www)
- Jalankan perintah dibawah ini

```bash
git clone https://github.com/Udeenn/Priorify.git
cd Priorify
git checkout development

composer install
npm install

cp .env.example .env
php artisan key:generate
```

### 2. Ubah file .env

- Buka file .env dan ubah kode baris 23 menjadi seperti dibawah ini

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=priorify
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Jalankan migrasi untuk membuat database dan tabel

```bash
php artisan migrate
```

### 4. Menjalankan project

- Jalankan project laravel

```bash
php artisan serve
```

- Jalankan npm untuk render typescript

```bash
npm run dev
```

- Buka http://127.0.0.1:8000
