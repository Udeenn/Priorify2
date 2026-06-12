import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

interface Task {
    id: number;
    nama_tugas: string;
    mata_kuliah: string;
    deadline: string;
    quadrant: string;
    progress: number;
    status: string;
}

interface HistoryItem {
    id: number;
    nama_tugas: string;
    mata_kuliah: string;
    deadline: string;
    completed_at: string | null;
    status: string;
}

interface Stats {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    upcoming_deadline: string;
}

interface Matrix {
    do_first: number;
    schedule: number;
    delegate: number;
    delete: number;
}

interface Props {
    auth: any;
    stats: Stats;
    tasks: Task[];
    matrix: Matrix;
    recentHistory: HistoryItem[];
}

function deadlineLabel(deadline: string): string {
    const today = new Date();
    const due = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = Math.round(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return "Terlambat";
    if (diff === 0) return "Hari ini";
    if (diff === 1) return "Besok";
    return `${diff} hari lagi`;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

function isLate(deadline: string, completedAt: string | null): boolean {
    if (!completedAt) return false;
    return new Date(completedAt) > new Date(deadline);
}

export default function Dashboard({
    auth,
    stats,
    tasks,
    matrix,
    recentHistory,
}: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Halo, {auth.user.name.split(" ")[0]}! 👋
                    </h2>
                    <Link
                        href="/tasks/create"
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                    >
                        + Tugas Baru
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium mb-1">
                            Tugas Belum Selesai
                        </p>
                        <h3 className="text-4xl font-black text-blue-600">
                            {stats.pending_tasks}
                        </h3>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium mb-1">
                            Berhasil Diselesaikan
                        </p>
                        <h3 className="text-4xl font-black text-green-500">
                            {stats.completed_tasks}
                        </h3>
                    </div>
                    <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl shadow-blue-100 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-100 text-sm font-medium mb-1">
                                Deadline Terdekat
                            </p>
                            <h3 className="text-xl font-bold truncate">
                                {stats.upcoming_deadline}
                            </h3>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-20 text-7xl font-black italic">
                            !
                        </div>
                    </div>
                </div>

                {/* Main grid: 2 col left + 1 col right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Fokus Utama ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">
                                    Fokus Utama
                                </h3>
                                <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Terdekat
                                </span>
                            </div>

                            {tasks.length === 0 ? (
                                <div className="px-8 py-14 text-center">
                                    <div className="text-4xl mb-3">🎉</div>
                                    <p className="text-slate-700 font-bold mb-1">
                                        Semua tugas selesai!
                                    </p>
                                    <p className="text-slate-400 text-sm mb-5">
                                        Tidak ada tugas yang pending saat ini.
                                    </p>
                                    <Link
                                        href="/tasks/create"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                                    >
                                        + Tambah Tugas Baru
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
                                                <th className="px-8 py-4">
                                                    Tugas & Matkul
                                                </th>
                                                <th className="px-8 py-4 text-center">
                                                    Progres
                                                </th>
                                                <th className="px-8 py-4 text-right">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {tasks.map((task) => (
                                                <tr
                                                    key={task.id}
                                                    className={`hover:bg-slate-50/30 transition ${task.status === "selesai" ? "opacity-70" : ""}`}
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span
                                                                className={`font-bold ${task.status === "selesai" ? "line-through text-slate-400" : "text-slate-800"}`}
                                                            >
                                                                {
                                                                    task.nama_tugas
                                                                }
                                                            </span>
                                                            {task.status ===
                                                                "selesai" && (
                                                                <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                    ✓ Selesai
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
                                                            {task.mata_kuliah} •{" "}
                                                            <span
                                                                className={`font-medium ${
                                                                    task.status ===
                                                                    "selesai"
                                                                        ? "text-green-500"
                                                                        : deadlineLabel(
                                                                                task.deadline,
                                                                            ) ===
                                                                            "Terlambat"
                                                                          ? "text-red-400"
                                                                          : "text-orange-400"
                                                                }`}
                                                            >
                                                                {task.status ===
                                                                "selesai"
                                                                    ? "Selesai"
                                                                    : deadlineLabel(
                                                                          task.deadline,
                                                                      )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="w-32 mx-auto">
                                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                                                <span>
                                                                    {task.status ===
                                                                    "selesai"
                                                                        ? 100
                                                                        : task.progress}
                                                                    %
                                                                </span>
                                                                <span>
                                                                    100%
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${task.status === "selesai" ? "bg-green-500" : "bg-blue-500"}`}
                                                                    style={{
                                                                        width: `${task.status === "selesai" ? 100 : task.progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <Link
                                                            href={`/tasks/${task.id}`}
                                                            className="text-blue-600 font-bold text-sm hover:underline"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* ── Riwayat Terbaru ── */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">
                                    Riwayat Terbaru
                                </h3>
                                <Link
                                    href="/history"
                                    className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition"
                                >
                                    Lihat Semua
                                </Link>
                            </div>
                            {recentHistory.length === 0 ? (
                                <div className="px-8 py-10 text-center">
                                    <p className="text-slate-400 text-sm">
                                        Belum ada tugas yang diselesaikan.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {recentHistory.map((item) => {
                                        const late = isLate(
                                            item.deadline,
                                            item.completed_at,
                                        );
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 px-8 py-4 hover:bg-slate-50/40 transition"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 flex-shrink-0">
                                                    {getInitials(
                                                        item.mata_kuliah,
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-slate-800 truncate">
                                                        {item.nama_tugas}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Selesai ·{" "}
                                                        {item.completed_at
                                                            ? new Date(
                                                                  item.completed_at,
                                                              ).toLocaleDateString(
                                                                  "id-ID",
                                                                  {
                                                                      day: "numeric",
                                                                      month: "short",
                                                                      year: "numeric",
                                                                  },
                                                              )
                                                            : "-"}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
                                                        late
                                                            ? "bg-red-50 text-red-500"
                                                            : "bg-green-50 text-green-600"
                                                    }`}
                                                >
                                                    {late
                                                        ? "Terlambat"
                                                        : "Tepat"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right Sidebar ── */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="text-blue-400">✦</span> Quick
                                View Matrix
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="aspect-square bg-red-500/20 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
                                    <span className="text-[10px] font-bold text-red-400 uppercase">
                                        Urgent
                                    </span>
                                    <span className="text-xl font-black">
                                        {matrix.do_first}
                                    </span>
                                </div>
                                <div className="aspect-square bg-blue-500/20 border border-blue-500/30 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">
                                        Schedule
                                    </span>
                                    <span className="text-xl font-black">
                                        {matrix.schedule}
                                    </span>
                                </div>
                                <div className="aspect-square bg-yellow-500/20 border border-yellow-500/30 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
                                    <span className="text-[10px] font-bold text-yellow-400 uppercase">
                                        Delegate
                                    </span>
                                    <span className="text-xl font-black">
                                        {matrix.delegate}
                                    </span>
                                </div>
                                <div className="aspect-square bg-slate-700/50 border border-slate-600 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        Delete
                                    </span>
                                    <span className="text-xl font-black">
                                        {matrix.delete}
                                    </span>
                                </div>
                            </div>
                            {/* <Link
                                href="/matrix"
                                className="block text-center mt-8 text-xs font-bold text-slate-400 hover:text-white transition"
                            >
                                Lihat Matriks Selengkapnya →
                            </Link> */}
                        </div>

                        <div className="bg-green-50 rounded-[2rem] p-6 border border-green-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                                ✅
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-green-800">
                                    WhatsApp Aktif
                                </h4>
                                <p className="text-xs text-green-600">
                                    Sistem akan mengejar kamu.
                                </p>
                            </div>
                        </div>

                        {/* Profile quick link */}
                        <Link
                            href="/profile"
                            className="block bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:border-blue-200 transition group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-black text-blue-600">
                                    {auth.user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {auth.user.email}
                                    </p>
                                </div>
                                <span className="text-slate-300 group-hover:text-blue-400 transition text-lg">
                                    →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
