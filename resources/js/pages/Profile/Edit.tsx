import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Transition } from "@headlessui/react";

interface Props {
    auth: any;
    mustVerifyEmail: boolean;
    status?: string;
    stats: {
        total_selesai: number;
        tepat_waktu: number;
        terlambat: number;
        tepat_persen: number;
    };
    whatsapp_verified: boolean;
}

export default function Edit({ mustVerifyEmail, status, stats, whatsapp_verified }: Props) {
    const user = usePage().props.auth.user as any;
    const [activeTab, setActiveTab] = useState<"profil" | "keamanan">("profil");

    const profileForm = useForm({
        name: user.name ?? "",
        email: user.email ?? "",
        whatsapp_number: user.whatsapp_number ?? "",
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        profileForm.patch(route("profile.update"));
    };

    const pwForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitPw: FormEventHandler = (e) => {
        e.preventDefault();
        pwForm.put(route("password.update"), {
            onSuccess: () => pwForm.reset(),
        });
    };

    const [showDelete, setShowDelete] = useState(false);
    const deleteForm = useForm({ password: "" });
    const submitDelete: FormEventHandler = (e) => {
        e.preventDefault();
        deleteForm.delete(route("profile.destroy"), {
            onError: () => deleteForm.reset("password"),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Profil Saya</h2>
                        <p className="text-slate-400 text-sm mt-0.5">Kelola informasi akun dan lihat riwayat tugasmu</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Profil" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">

                {/* ── TOP: Avatar + Stats side by side ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Avatar Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Blue banner */}
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600" />
                        <div className="px-6 pb-6">
                            {/* Avatar overlapping banner */}
                            <div className="flex items-end gap-4 -mt-10 mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-blue-600 flex-shrink-0">
                                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                                </div>
                                {user.role && (
                                    <span className="mb-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full capitalize">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{user.name}</h4>
                            <p className="text-slate-400 text-sm mt-0.5 truncate">{user.email}</p>

                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <span className="text-green-500">💬</span> WhatsApp
                                    </span>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        whatsapp_verified
                                            ? "bg-green-50 text-green-600 border border-green-100"
                                            : "bg-slate-100 text-slate-400"
                                    }`}>
                                        {whatsapp_verified ? "✓ Aktif" : "Belum diisi"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <span>📧</span> Email
                                    </span>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        user.email_verified_at
                                            ? "bg-green-50 text-green-600 border border-green-100"
                                            : "bg-amber-50 text-amber-500 border border-amber-100"
                                    }`}>
                                        {user.email_verified_at ? "✓ Terverifikasi" : "Belum verifikasi"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Ringkasan Riwayat</h3>
                                <p className="text-slate-400 text-xs mt-0.5">Total progres penyelesaian tugas kamu</p>
                            </div>
                            <Link
                                href="/history"
                                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                            >
                                Lihat semua →
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* Selesai */}
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                <p className="text-3xl font-black text-green-600">{stats.total_selesai}</p>
                                <p className="text-green-700 text-xs font-semibold mt-1">Selesai</p>
                            </div>
                            {/* Tepat Waktu */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                <p className="text-3xl font-black text-blue-600">{stats.tepat_persen}%</p>
                                <p className="text-blue-700 text-xs font-semibold mt-1">Tepat Waktu</p>
                            </div>
                            {/* Terlambat */}
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                                <p className="text-3xl font-black text-red-500">{stats.terlambat}</p>
                                <p className="text-red-700 text-xs font-semibold mt-1">Terlambat</p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                                <span>Tingkat ketepatan waktu</span>
                                <span>{stats.tepat_persen}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                                    style={{ width: `${stats.tepat_persen}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-300 mt-1">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM: Form + Danger Zone ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Form Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-100 bg-slate-50/50">
                            <button
                                onClick={() => setActiveTab("profil")}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${
                                    activeTab === "profil"
                                        ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                ✏️ Edit Profil
                            </button>
                            <button
                                onClick={() => setActiveTab("keamanan")}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${
                                    activeTab === "keamanan"
                                        ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                🔒 Keamanan
                            </button>
                        </div>

                        {/* Profil Tab */}
                        {activeTab === "profil" && (
                            <form onSubmit={submitProfile} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData("name", e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                    {profileForm.errors.name && (
                                        <p className="text-red-500 text-xs mt-1.5">⚠ {profileForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Alamat Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData("email", e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                    {profileForm.errors.email && (
                                        <p className="text-red-500 text-xs mt-1.5">⚠ {profileForm.errors.email}</p>
                                    )}
                                    {mustVerifyEmail && !user.email_verified_at && (
                                        <p className="text-xs text-amber-500 mt-1.5 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                                            ⚠ Email belum diverifikasi.{" "}
                                            <Link href={route("verification.send")} method="post" as="button" className="underline font-bold">
                                                Kirim ulang verifikasi
                                            </Link>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Nomor WhatsApp
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileForm.data.whatsapp_number}
                                            onChange={(e) => profileForm.setData("whatsapp_number", e.target.value)}
                                            placeholder="+62 812-3456-7890"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-32"
                                        />
                                        {whatsapp_verified && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                                                ✓ Aktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">Digunakan untuk notifikasi pengingat deadline via WhatsApp</p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <Transition
                                        show={profileForm.recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 translate-y-1"
                                        leave="transition ease-in-out duration-200"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-green-600 text-sm font-semibold flex items-center gap-1.5">
                                            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                                            Profil berhasil disimpan!
                                        </p>
                                    </Transition>
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {profileForm.processing ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : null}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Keamanan Tab */}
                        {activeTab === "keamanan" && (
                            <form onSubmit={submitPw} className="p-8 space-y-5">
                                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-medium">
                                    💡 Gunakan password minimal 8 karakter dengan kombinasi huruf dan angka.
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Password Saat Ini
                                    </label>
                                    <input
                                        type="password"
                                        value={pwForm.data.current_password}
                                        onChange={(e) => pwForm.setData("current_password", e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                    {pwForm.errors.current_password && (
                                        <p className="text-red-500 text-xs mt-1.5">⚠ {pwForm.errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={pwForm.data.password}
                                        onChange={(e) => pwForm.setData("password", e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                    {pwForm.errors.password && (
                                        <p className="text-red-500 text-xs mt-1.5">⚠ {pwForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                        Konfirmasi Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={pwForm.data.password_confirmation}
                                        onChange={(e) => pwForm.setData("password_confirmation", e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <Transition
                                        show={pwForm.recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out duration-200"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-green-600 text-sm font-semibold flex items-center gap-1.5">
                                            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                                            Password berhasil diubah!
                                        </p>
                                    </Transition>
                                    <button
                                        type="submit"
                                        disabled={pwForm.processing}
                                        className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
                                    >
                                        {pwForm.processing ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : null}
                                        Perbarui Password
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-4">
                        {/* Quick info */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Info Akun</p>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-400">Bergabung sejak</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Total tugas dibuat</p>
                                    <p className="text-sm font-semibold text-slate-700">{stats.total_selesai} tugas selesai</p>
                                </div>
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
                            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Zona Bahaya</p>
                            <p className="text-xs text-slate-400 mb-4">Aksi ini tidak dapat dibatalkan. Semua data akan dihapus permanen.</p>

                            {!showDelete ? (
                                <button
                                    onClick={() => setShowDelete(true)}
                                    className="w-full py-2.5 text-sm font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 active:scale-95 transition-all"
                                >
                                    🗑 Hapus Akun
                                </button>
                            ) : (
                                <form onSubmit={submitDelete} className="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Masukkan password kamu"
                                        value={deleteForm.data.password}
                                        onChange={(e) => deleteForm.setData("password", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-50"
                                    />
                                    {deleteForm.errors.password && (
                                        <p className="text-red-500 text-xs">⚠ {deleteForm.errors.password}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowDelete(false)}
                                            className="flex-1 py-2.5 text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={deleteForm.processing}
                                            className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-60"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}