<?php

namespace App\Services;

use App\Models\FonnteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected string $url = 'https://api.fonnte.com/send';

    protected function getToken(): string
    {
        // Prioritas: database dulu, fallback ke .env
        return FonnteSetting::getValue('fonnte_token')
            ?? config('services.fonnte.token', '');
    }

    public function send(string $phone, string $message): bool
    {
        $token = $this->getToken();

        if (empty($token)) {
            Log::error('Fonnte: token belum dikonfigurasi');
            return false;
        }

        $phone = $this->normalizePhone($phone);

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post($this->url, [
                'target'  => $phone,
                'message' => $message,
            ]);

            $body = $response->json();

            if ($response->successful() && ($body['status'] ?? false)) {
                Log::info("Fonnte: pesan terkirim ke {$phone}");
                return true;
            }

            Log::warning("Fonnte: gagal kirim ke {$phone}", $body ?? []);
            return false;
        } catch (\Exception $e) {
            Log::error("Fonnte: exception - " . $e->getMessage());
            return false;
        }
    }

    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        if (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        return $phone;
    }
}
