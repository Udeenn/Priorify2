import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";

// ── Mini components ─────────────────────────────────────────────────────────

function MatrixPreview() {
    const tasks = [
        // Q1 – Penting & Mendesak (merah)
        { q: 1, label: "Skripsi Bab 3", due: "Besok" },
        { q: 1, label: "UTS Algoritma", due: "2 hari" },
        // Q2 – Penting, Tidak Mendesak (biru)
        { q: 2, label: "Baca referensi", due: "1 minggu" },
        { q: 2, label: "Revisi proposal", due: "5 hari" },
        // Q3 – Tidak Penting, Mendesak (kuning)
        { q: 3, label: "Absensi online", due: "Hari ini" },
        // Q4 – Tidak Penting, Tidak Mendesak (abu)
        { q: 4, label: "Tugas opsional", due: "2 minggu" },
    ];

    const quadrants = [
        {
            q: 1,
            label: "Kerjakan Sekarang",
            color: "#ef4444",
            bg: "#fef2f2",
            border: "#fecaca",
            dot: "#ef4444",
        },
        {
            q: 2,
            label: "Jadwalkan",
            color: "#3b82f6",
            bg: "#eff6ff",
            border: "#bfdbfe",
            dot: "#3b82f6",
        },
        {
            q: 3,
            label: "Delegasikan",
            color: "#f59e0b",
            bg: "#fffbeb",
            border: "#fde68a",
            dot: "#f59e0b",
        },
        {
            q: 4,
            label: "Hapus / Tunda",
            color: "#94a3b8",
            bg: "#f8fafc",
            border: "#e2e8f0",
            dot: "#94a3b8",
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-inner p-4 w-full h-full">
            {/* Header bar tiruan */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-semibold text-slate-400 tracking-wide">
                    Eisenhower Matrix · 6 Tugas Aktif
                </span>
            </div>

            {/* Axis labels */}
            <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 mb-1">
                <span>← Tidak Mendesak</span>
                <span>Mendesak →</span>
            </div>

            <div className="grid grid-cols-2 gap-2 h-[calc(100%-56px)]">
                {quadrants.map(({ q, label, color, bg, border, dot }) => {
                    const items = tasks.filter((t) => t.q === q);
                    return (
                        <div
                            key={q}
                            style={{
                                background: bg,
                                border: `1.5px solid ${border}`,
                            }}
                            className="rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden"
                        >
                            <div
                                className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                                style={{ color }}
                            >
                                {label}
                            </div>
                            {items.map((t, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 bg-white/80 rounded-lg px-2 py-1 shadow-sm"
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ background: dot }}
                                    />
                                    <span className="text-[10px] font-semibold text-slate-700 truncate flex-1">
                                        {t.label}
                                    </span>
                                    <span className="text-[9px] text-slate-400 whitespace-nowrap">
                                        {t.due}
                                    </span>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="text-[10px] text-slate-300 italic">
                                    Kosong
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function StatBadge({
    value,
    label,
    color,
}: {
    value: string;
    label: string;
    color: string;
}) {
    return (
        <div className="flex flex-col items-center bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100">
            <span className={`text-3xl font-black ${color}`}>{value}</span>
            <span className="text-sm text-slate-400 mt-1 font-medium">
                {label}
            </span>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Welcome({ auth }: PageProps) {
    const testimonials = [
        {
            name: "Ammar Miftahudin",
            prodi: "Informatika UMS · 2022",
            avatar: "AM",
            color: "bg-blue-500",
            text: "Sebelumnya saya selalu panik karena nggak tahu tugas mana yang harus dikerjain duluan. Sekarang buka Priorify, langsung tahu harus ngapain.",
        },
        {
            name: "Salma Khoirunnisa",
            prodi: "Psikologi UMS · 2023",
            avatar: "SK",
            color: "bg-violet-500",
            text: "Pengingat WhatsApp-nya beneran membantu banget. Pernah hampir lupa deadline, eh tiba-tiba dapat notif dari Priorify.",
        },
        {
            name: "Rizky Ferdiansyah",
            prodi: "Teknik Sipil UMS · 2021",
            avatar: "RF",
            color: "bg-emerald-500",
            text: "Fitur matriksnya keren. Saya bisa lihat sekaligus semua tugas kuliah dan tahu persis mana yang butuh perhatian lebih.",
        },
    ];

    return (
        <div className="bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
            <Head title="Priorify — Kelola Tugas Lebih Cerdas" />

            {/* ── 1. Navbar ─────────────────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <span className="text-white font-black text-xl">
                                P
                            </span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-blue-600 uppercase">
                            Priorify
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                                >
                                    Daftar Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── 2. Hero ───────────────────────────────────────────────── */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase mb-6 inline-block">
                            🚀 Solusi Manajemen Tugas Mahasiswa
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 text-slate-900">
                            Berhenti{" "}
                            <span className="text-blue-600 underline decoration-blue-200">
                                Bingung
                            </span>{" "}
                            Pilih Tugas.
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
                            Priorify menggunakan algoritma Eisenhower Matrix
                            untuk menentukan tugas mana yang harus dikerjakan
                            sekarang, dan mengingatkanmu lewat WhatsApp secara
                            otomatis.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={route("register")}
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition text-center shadow-xl shadow-blue-200"
                            >
                                Mulai Sekarang — Gratis
                            </Link>
                            <a
                                href="#cara-kerja"
                                className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition text-center"
                            >
                                Lihat Cara Kerja
                            </a>
                        </div>

                        {/* Social proof mini */}
                        <div className="mt-10 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[
                                    "bg-blue-500",
                                    "bg-violet-500",
                                    "bg-emerald-500",
                                    "bg-orange-400",
                                ].map((c, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-full ${c} border-2 border-white`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                Dipakai oleh{" "}
                                <span className="font-bold text-slate-800">
                                    200+ mahasiswa UMS
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-blue-50 rounded-[3rem] -z-10" />
                        <div className="bg-slate-100 rounded-[2rem] p-3 shadow-2xl border border-white">
                            <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-inner aspect-[4/3] p-4">
                                <MatrixPreview />
                            </div>
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
                            <span className="text-2xl">📲</span>
                            <div>
                                <div className="text-xs font-bold text-slate-800">
                                    Pengingat WhatsApp
                                </div>
                                <div className="text-xs text-slate-400">
                                    "UTS Algoritma besok jam 08.00!"
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl shadow-xl px-4 py-3">
                            <div className="text-xs font-bold">
                                Prioritas #1
                            </div>
                            <div className="text-lg font-black">
                                Skripsi Bab 3
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. Stats ──────────────────────────────────────────────── */}
            <section className="py-16 px-6 border-y border-slate-100">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBadge
                        value="200+"
                        label="Mahasiswa Aktif"
                        color="text-blue-600"
                    />
                    <StatBadge
                        value="1.200+"
                        label="Tugas Dikelola"
                        color="text-emerald-600"
                    />
                    <StatBadge
                        value="98%"
                        label="Deadline Tepat Waktu"
                        color="text-violet-600"
                    />
                    <StatBadge
                        value="4 Kuadran"
                        label="Eisenhower Matrix"
                        color="text-orange-500"
                    />
                </div>
            </section>

            {/* ── 4. Manfaat ────────────────────────────────────────────── */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black mb-6">
                            Kenapa Harus Priorify?
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Mahasiswa sering terjebak menumpuk tugas bukan
                            karena malas, tapi karena tidak tahu harus mulai
                            dari mana. Priorify menyelesaikan itu.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            {
                                title: "Bebas Decision Paralysis",
                                desc: "Tidak perlu lagi berdebat dengan diri sendiri soal tugas mana yang harus dikerjakan. Sistem yang memutuskan, kamu tinggal eksekusi.",
                                icon: "🎯",
                            },
                            {
                                title: "Pengingat WhatsApp Otomatis",
                                desc: "Notifikasi deadline langsung ke WhatsApp-mu. Tanpa install aplikasi baru, tanpa setup rumit.",
                                icon: "📱",
                            },
                            {
                                title: "Standar Eisenhower Matrix",
                                desc: "Metode yang sama dipakai oleh manajer dan eksekutif kelas dunia — kini tersedia otomatis untuk mahasiswa.",
                                icon: "📊",
                            },
                            {
                                title: "Prioritas Real-time",
                                desc: "Setiap kali kamu menambah tugas baru, urutan prioritas langsung diperbarui secara otomatis.",
                                icon: "⚡",
                            },
                            {
                                title: "Visualisasi 4 Kuadran",
                                desc: "Lihat semua tugasmu sekaligus dalam satu tampilan matrix yang jelas dan mudah dipahami.",
                                icon: "🗂️",
                            },
                            {
                                title: "Gratis untuk Mahasiswa",
                                desc: "Tidak ada biaya, tidak ada iklan. Cukup daftar dengan email kampus dan langsung pakai.",
                                icon: "🎓",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="text-5xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. Cara Kerja ─────────────────────────────────────────── */}
            <section id="cara-kerja" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-black mb-12">
                                Hanya 3 Langkah Mudah
                            </h2>
                            <div className="space-y-12">
                                {[
                                    {
                                        step: "01",
                                        title: "Input Tugas & Kerumitan",
                                        desc: "Masukkan nama tugas, mata kuliah, deadline, dan seberapa sulit tugas tersebut bagimu. Tidak perlu lebih dari 30 detik.",
                                    },
                                    {
                                        step: "02",
                                        title: "Lihat Matriks Prioritas",
                                        desc: "Sistem langsung menempatkan tugasmu ke salah satu dari 4 kuadran: Kerjakan, Jadwalkan, Delegasikan, atau Tunda.",
                                    },
                                    {
                                        step: "03",
                                        title: "Terima Pengingat WhatsApp",
                                        desc: "Priorify mengirim notifikasi ke WhatsApp-mu sebelum deadline tiba, berdasarkan urutan prioritas yang sudah dihitung.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="text-4xl font-black text-blue-100 italic min-w-[3rem]">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-slate-500 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ilustrasi alur WhatsApp */}
                        <div className="lg:w-1/2">
                            <div className="bg-blue-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
                                {/* Dekorasi lingkaran */}
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500 rounded-full opacity-40" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-700 rounded-full opacity-40" />

                                <div className="relative z-10">
                                    {/* Mock WA notif */}
                                    <div className="bg-white text-slate-800 rounded-2xl p-4 mb-6 shadow-xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-black">
                                                    P
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-800">
                                                    Priorify
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                    WhatsApp · Baru saja
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            📌{" "}
                                            <strong>
                                                Pengingat Prioritas #1
                                            </strong>
                                            <br />
                                            Tugas <strong>
                                                Skripsi Bab 3
                                            </strong>{" "}
                                            jatuh tempo besok pukul 23:59.
                                            Segera selesaikan!
                                        </p>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 italic">
                                        "Nggak ada lagi drama begadang H-1
                                        karena sistemnya bikin aku cicil dari
                                        jauh-jauh hari."
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center font-black text-lg">
                                            AM
                                        </div>
                                        <div>
                                            <div className="font-bold">
                                                Ammar Miftahudin
                                            </div>
                                            <div className="text-blue-200 text-sm italic">
                                                Informatika UMS · 2022
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. Eisenhower Matrix Explained ───────────────────────── */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-black mb-6">
                            Apa itu Eisenhower Matrix?
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Metode klasifikasi tugas berdasarkan dua sumbu —
                            <strong className="text-slate-700">
                                {" "}
                                tingkat urgensi
                            </strong>{" "}
                            dan{" "}
                            <strong className="text-slate-700">
                                tingkat kepentingan
                            </strong>{" "}
                            — yang pertama kali dipopulerkan oleh Presiden AS
                            Dwight D. Eisenhower.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                q: "Kuadran 1",
                                title: "Kerjakan Sekarang",
                                desc: "Tugas penting dan mendesak. Deadline dekat, dampaknya besar. Ini prioritas utamamu.",
                                color: "bg-red-500",
                                badge: "Penting & Mendesak",
                                badgeColor: "bg-red-100 text-red-600",
                                example: "UTS besok, skripsi deadline",
                            },
                            {
                                q: "Kuadran 2",
                                title: "Jadwalkan",
                                desc: "Penting tapi tidak mendesak. Rencanakan kapan kamu akan mengerjakannya.",
                                color: "bg-blue-500",
                                badge: "Penting, Tidak Mendesak",
                                badgeColor: "bg-blue-100 text-blue-600",
                                example: "Baca materi, revisi draft",
                            },
                            {
                                q: "Kuadran 3",
                                title: "Delegasikan",
                                desc: "Mendesak tapi tidak terlalu penting. Selesaikan cepat atau minta bantuan orang lain.",
                                color: "bg-yellow-500",
                                badge: "Mendesak, Tidak Penting",
                                badgeColor: "bg-yellow-100 text-yellow-700",
                                example: "Isi absensi, balas pesan grup",
                            },
                            {
                                q: "Kuadran 4",
                                title: "Tunda / Hapus",
                                desc: "Tidak penting dan tidak mendesak. Pertimbangkan untuk dihapus dari daftar.",
                                color: "bg-slate-400",
                                badge: "Tidak Penting & Tidak Mendesak",
                                badgeColor: "bg-slate-100 text-slate-500",
                                example: "Tugas opsional, riset iseng",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`${item.color} h-2 w-full`} />
                                <div className="p-7">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                        {item.q}
                                    </span>
                                    <h3 className="text-xl font-black mt-1 mb-3">
                                        {item.title}
                                    </h3>
                                    <span
                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor} mb-4 inline-block`}
                                    >
                                        {item.badge}
                                    </span>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        {item.desc}
                                    </p>
                                    <div className="text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2">
                                        Contoh: {item.example}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. Testimoni ──────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <h2 className="text-4xl font-black mb-6">
                            Kata Mereka yang Sudah Pakai
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Mahasiswa dari berbagai jurusan di UMS berbagi
                            pengalaman mereka.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-3xl text-blue-200 font-black mb-4">
                                    "
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 italic">
                                    {t.text}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-black text-sm`}
                                    >
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-800">
                                            {t.name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {t.prodi}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. CTA ────────────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto bg-blue-600 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500 rounded-full opacity-30" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-700 rounded-full opacity-30" />
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                            Mulai Kelola Tugas <br />
                            Lebih Cerdas Sekarang
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                            Gratis untuk mahasiswa. Tidak perlu kartu kredit.
                            Langsung aktif dalam hitungan menit.
                        </p>
                        <Link
                            href={route("register")}
                            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg hover:bg-blue-50 transition shadow-2xl"
                        >
                            Daftar Sekarang — Gratis
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 9. Footer ─────────────────────────────────────────────── */}
            <footer className="py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm">
                    <div className="font-black text-blue-600 text-lg">
                        PRIORIFY.
                    </div>
                    <p>
                        &copy; 2026 Tim Capstone Informatika — Universitas
                        Muhammadiyah Surakarta
                    </p>
                    <div className="flex gap-6 font-medium">
                        <a href="#" className="hover:text-blue-600 transition">
                            Tentang Kami
                        </a>
                        <a href="#" className="hover:text-blue-600 transition">
                            Hubungi Kami
                        </a>
                        <a href="#" className="hover:text-blue-600 transition">
                            Kebijakan Privasi
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
