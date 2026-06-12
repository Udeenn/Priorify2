import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

interface HistoryTask {
    id: number;
    nama_tugas: string;
    mata_kuliah: string;
    deadline: string;
    status: string;
    quadrant: string;
    completed_at: string | null;
    created_at: string;
}

interface Stats {
    total_selesai: number;
    tepat_waktu: number;
    terlambat: number;
    tepat_persen: number;
}

interface Props {
    auth: any;
    history: HistoryTask[];
    stats: Stats;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function isLate(deadline: string, completedAt: string | null): boolean {
    if (!completedAt) return false;
    return new Date(completedAt) > new Date(deadline);
}

const quadrantLabel: Record<string, string> = {
    do_first: "Do First",
    schedule: "Schedule",
    delegate: "Delegate",
    delete: "Delete",
};

const quadrantColor: Record<string, string> = {
    do_first: "bg-red-50 text-red-500 border border-red-100",
    schedule: "bg-blue-50 text-blue-500 border border-blue-100",
    delegate: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    delete: "bg-slate-100 text-slate-500 border border-slate-200",
};

export default function History({ auth, history, stats }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Riwayat Tugas
                    </h2>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                    >
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Riwayat" />

            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Selesai */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 text-center relative overflow-hidden group hover:shadow-md transition">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg">✅</span>
                            </div>
                            <p className="text-4xl font-black text-green-500 leading-none">{stats.total_selesai}</p>
                            <p className="text-slate-500 text-xs font-semibold mt-2 uppercase tracking-wider">Selesai</p>
                        </div>
                    </div>

                    {/* Tepat Waktu - highlighted card like Dashboard */}
                    <div className="bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-100 p-6 text-center relative overflow-hidden group hover:bg-blue-700 transition">
                        <div className="absolute -right-3 -bottom-3 text-7xl font-black italic opacity-10 text-white">%</div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg">⏱️</span>
                            </div>
                            <p className="text-4xl font-black text-white leading-none">{stats.tepat_persen}%</p>
                            <p className="text-blue-100 text-xs font-semibold mt-2 uppercase tracking-wider">Tepat Waktu</p>
                        </div>
                    </div>

                    {/* Terlambat */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 text-center relative overflow-hidden group hover:shadow-md transition">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg">⚠️</span>
                            </div>
                            <p className="text-4xl font-black text-red-400 leading-none">{stats.terlambat}</p>
                            <p className="text-slate-500 text-xs font-semibold mt-2 uppercase tracking-wider">Terlambat</p>
                        </div>
                    </div>
                </div>

                {/* Progress bar summary */}
                {stats.total_selesai > 0 && (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-bold text-slate-700">Tingkat Ketepatan Waktu</p>
                            <span className="text-sm font-black text-blue-600">{stats.tepat_persen}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                                style={{ width: `${stats.tepat_persen}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-400">{stats.tepat_waktu} tepat waktu</span>
                            <span className="text-xs text-slate-400">{stats.terlambat} terlambat</span>
                        </div>
                    </div>
                )}

                {/* History List */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Semua Tugas Selesai</h3>
                            <p className="text-slate-400 text-sm mt-1">Rekap seluruh tugas yang telah diselesaikan</p>
                        </div>
                        {history.length > 0 && (
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">
                                {history.length} tugas
                            </span>
                        )}
                    </div>

                    {history.length === 0 ? (
                        <div className="py-20 text-center px-8">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📭</span>
                            </div>
                            <p className="text-slate-700 font-bold text-lg mb-2">Belum ada riwayat</p>
                            <p className="text-slate-400 text-sm mb-6">Selesaikan tugas pertamamu untuk melihat riwayat di sini.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {history.map((task) => {
                                const late = isLate(task.deadline, task.completed_at);
                                return (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-4 px-8 py-5 hover:bg-slate-50/60 transition group"
                                    >
                                        {/* Avatar / Initials */}
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                                            late ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
                                        }`}>
                                            {getInitials(task.mata_kuliah)}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">{task.nama_tugas}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                                                {task.mata_kuliah} · Selesai {task.completed_at ? formatDate(task.completed_at) : "-"}
                                            </p>
                                        </div>

                                        {/* Quadrant badge */}
                                        <span className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                                            quadrantColor[task.quadrant] ?? "bg-slate-100 text-slate-500"
                                        }`}>
                                            {quadrantLabel[task.quadrant] ?? task.quadrant}
                                        </span>

                                        {/* Status badge */}
                                        <span
                                            className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${
                                                late
                                                    ? "bg-red-50 text-red-500 border border-red-100"
                                                    : "bg-green-50 text-green-600 border border-green-100"
                                            }`}
                                        >
                                            {late ? "⚠ Terlambat" : "✓ Tepat"}
                                        </span>

                                        {/* Detail Link */}
                                        <Link
                                            href={`/tasks/${task.id}`}
                                            className="text-blue-600 font-bold text-sm hover:underline ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            Detail →
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}