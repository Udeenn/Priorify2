import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { DashboardProps } from "@/types/admin";
import { useState } from "react";
import { useForm } from "@inertiajs/react";

// ── Constants ─────────────────────────────────────────────────────────────
const QUADRANT_MAP: Record<string, { label: string; color: string }> = {
    do_first: { label: "Lakukan Sekarang", color: "#ef4444" },
    schedule: { label: "Jadwalkan", color: "#3b82f6" },
    delegate: { label: "Delegasikan", color: "#f59e0b" },
    delete: { label: "Eliminasi", color: "#6b7280" },
    q1: { label: "Lakukan Sekarang", color: "#ef4444" },
    q2: { label: "Jadwalkan", color: "#3b82f6" },
    q3: { label: "Delegasikan", color: "#f59e0b" },
    q4: { label: "Eliminasi", color: "#6b7280" },
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    selesai: { label: "Selesai", color: "#10b981" },
    completed: { label: "Selesai", color: "#10b981" },
    pending: { label: "Menunggu", color: "#f59e0b" },
    "in-progress": { label: "Dikerjakan", color: "#3b82f6" },
    cancelled: { label: "Dibatalkan", color: "#ef4444" },
};

// ── Helpers ───────────────────────────────────────────────────────────────
function daysUntil(d: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(d);
    deadline.setHours(0, 0, 0, 0);

    return Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
}

function timeAgo(d: string) {
    const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (m < 60) return `${m}m lalu`;
    if (m < 1440) return `${Math.floor(m / 60)}j lalu`;
    return `${Math.floor(m / 1440)}h lalu`;
}
function initials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

// ── Sub-components ────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
    icon,
    accent,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon: string;
    accent: string;
}) {
    return (
        <div
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:-translate-y-0.5 transition-transform duration-150 relative overflow-hidden"
            style={{ borderTop: `3px solid ${accent}` }}
        >
            <span className="text-2xl block mb-3">{icon}</span>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                {label}
            </p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">
                {value}
            </p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}

function Card({
    title,
    badge,
    children,
}: {
    title: string;
    badge?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                {badge && (
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Dashboard({
    stats,
    quadrantData,
    statusData,
    taskPerMatkul,
    trend,
    avgProgressMatkul,
    recentUsers,
    upcomingDeadlines,
    topUsers,
    fonnteToken,
}: DashboardProps & { fonnteToken: string | null }) {
    const trendData = trend.labels.map((label, i) => ({
        date: label,
        tugas: trend.values[i],
    }));

    const [showModal, setShowModal] = useState(false);
    const [showToken, setShowToken] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        fonnte_token: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route("admin.fonnte.update"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    }

    const quadrantChartData = Object.entries(quadrantData)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
            name: QUADRANT_MAP[k]?.label ?? k,
            value: v,
            color: QUADRANT_MAP[k]?.color ?? "#94a3b8",
        }));

    const statusChartData = Object.entries(statusData)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
            name: STATUS_MAP[k]?.label ?? k,
            value: v,
            color: STATUS_MAP[k]?.color ?? "#94a3b8",
        }));

    const tooltipStyle = {
        contentStyle: {
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 12,
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Admin Dashboard
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Monitoring sistem manajemen tugas mahasiswa
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Monitoring
                    </span>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                        label="Mahasiswa"
                        value={stats.totalUsers}
                        icon="👥"
                        accent="#6366f1"
                        sub="Terdaftar"
                    />
                    <StatCard
                        label="Total Tugas"
                        value={stats.totalTasks}
                        icon="📋"
                        accent="#06b6d4"
                        sub="Semua tugas"
                    />
                    <StatCard
                        label="Selesai"
                        value={stats.completedTasks}
                        icon="✅"
                        accent="#10b981"
                        sub={`${stats.completionRate}%`}
                    />
                    <StatCard
                        label="Overdue"
                        value={stats.overdueTasks}
                        icon="⚠️"
                        accent="#ef4444"
                        sub="Lewat deadline"
                    />
                    <StatCard
                        label="Completion"
                        value={`${stats.completionRate}%`}
                        icon="📈"
                        accent="#f59e0b"
                        sub="Tingkat selesai"
                    />
                    <StatCard
                        label="Notifikasi"
                        value={stats.totalNotifs}
                        icon="🔔"
                        accent="#8b5cf6"
                        sub="7 hari terakhir"
                    />
                </div>

                {/* Tren + Quadrant */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card title="Tren Tugas Baru" badge="7 Hari Terakhir">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient
                                            id="aGrad"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#6366f1"
                                                stopOpacity={0.15}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#6366f1"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip {...tooltipStyle} />
                                    <Area
                                        type="monotone"
                                        dataKey="tugas"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fill="url(#aGrad)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    <Card title="Eisenhower Matrix">
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie
                                    data={quadrantChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={38}
                                    outerRadius={62}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {quadrantChartData.map((e, i) => (
                                        <Cell key={i} fill={e.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-3">
                            {quadrantChartData.map((d) => (
                                <div
                                    key={d.name}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: d.color }}
                                    />
                                    <span className="text-slate-500 flex-1 truncate">
                                        {d.name}
                                    </span>
                                    <span className="font-bold text-slate-700">
                                        {d.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Matkul + Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Tugas per Mata Kuliah" badge="Top 8">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={taskPerMatkul} layout="vertical">
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f1f5f9"
                                    horizontal={false}
                                />
                                <XAxis
                                    type="number"
                                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fill: "#64748b", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={110}
                                />
                                <Tooltip {...tooltipStyle} />
                                <Bar
                                    dataKey="value"
                                    fill="#06b6d4"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Distribusi Status Tugas">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={65}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {statusChartData.map((e, i) => (
                                        <Cell key={i} fill={e.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {statusChartData.map((d) => (
                                <div
                                    key={d.name}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: d.color }}
                                    />
                                    <span className="text-slate-500 flex-1">
                                        {d.name}
                                    </span>
                                    <span className="font-bold text-slate-700">
                                        {d.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Progress per Matkul */}
                <Card title="Rata-rata Progress per Mata Kuliah">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {avgProgressMatkul.map((m) => (
                            <div key={m.mata_kuliah}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-medium text-slate-700 truncate max-w-[180px]">
                                        {m.mata_kuliah}
                                    </span>
                                    <span className="text-slate-400 ml-2 flex-shrink-0">
                                        {m.avg_progress}% · {m.total} tugas
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${m.avg_progress}%`,
                                            background:
                                                m.avg_progress >= 75
                                                    ? "#10b981"
                                                    : m.avg_progress >= 40
                                                      ? "#6366f1"
                                                      : "#f59e0b",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Deadlines + Recent Users */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="⚡ Deadline Mendekat" badge="3 Hari ke Depan">
                        {upcomingDeadlines.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-6">
                                Tidak ada deadline mendekat
                            </p>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {upcomingDeadlines.map((task) => {
                                    const days = daysUntil(task.deadline);
                                    const urgent = days <= 1;
                                    return (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${urgent ? "bg-red-50" : "bg-amber-50"}`}
                                            >
                                                {urgent ? "🔥" : "📅"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">
                                                    {task.nama_tugas}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {task.mata_kuliah} ·{" "}
                                                    {task.user?.name ?? "–"}
                                                </p>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{
                                                            width: `${task.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <span
                                                className={`text-xs font-black flex-shrink-0 ${urgent ? "text-red-500" : "text-amber-500"}`}
                                            >
                                                {days === 0
                                                    ? "Hari ini"
                                                    : `${days}h`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    <Card title="👥 Mahasiswa Terbaru" badge="5 Terakhir">
                        <div className="divide-y divide-slate-50">
                            {recentUsers.map((u) => (
                                <div
                                    key={u.id}
                                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 flex-shrink-0">
                                        {initials(u.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">
                                            {u.name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {u.email}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="text-xs font-bold bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">
                                            {u.tasks_count} tugas
                                        </span>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {timeAgo(u.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Top Users */}
                <Card
                    title="🏆 Top Mahasiswa Aktif"
                    badge="Berdasarkan Jumlah Tugas"
                >
                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <th className="pb-3 pr-4 w-8">#</th>
                                    <th className="pb-3 pr-6">Mahasiswa</th>
                                    <th className="pb-3 pr-4 text-center">
                                        Total
                                    </th>
                                    <th className="pb-3 pr-4 text-center">
                                        Selesai
                                    </th>
                                    <th className="pb-3 min-w-[140px]">
                                        Completion
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {topUsers.map((u, i) => {
                                    const rate =
                                        u.tasks_count > 0
                                            ? Math.round(
                                                  (u.completed_tasks_count /
                                                      u.tasks_count) *
                                                      100,
                                              )
                                            : 0;
                                    return (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-slate-50/60 transition"
                                        >
                                            <td className="py-3 pr-4 text-base font-bold">
                                                {["🥇", "🥈", "🥉"][i] ?? (
                                                    <span className="text-slate-400 text-sm">
                                                        #{i + 1}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 pr-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 flex-shrink-0">
                                                        {initials(u.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-800 truncate">
                                                            {u.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400 truncate">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-center">
                                                <span className="text-xs font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">
                                                    {u.tasks_count}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4 text-center">
                                                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                                                    {u.completed_tasks_count}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${rate}%`,
                                                                background:
                                                                    rate >= 75
                                                                        ? "#10b981"
                                                                        : rate >=
                                                                            40
                                                                          ? "#6366f1"
                                                                          : "#f59e0b",
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-400 w-8 text-right flex-shrink-0">
                                                        {rate}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* token fonnte */}
                <Card title="🔑 Konfigurasi Fonnte">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-widest">
                                Token Aktif
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="text-sm font-mono bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex-1 truncate text-slate-700">
                                    {fonnteToken
                                        ? showToken
                                            ? fonnteToken
                                            : "•".repeat(24)
                                        : "Belum dikonfigurasi"}
                                </code>
                                {fonnteToken && (
                                    <button
                                        onClick={() => setShowToken(!showToken)}
                                        className="text-xs text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex-shrink-0"
                                    >
                                        {showToken
                                            ? "🙈 Sembunyikan"
                                            : "👁️ Tampilkan"}
                                    </button>
                                )}
                            </div>
                            {fonnteToken && (
                                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                    Token terkonfigurasi
                                </p>
                            )}
                            {!fonnteToken && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                                    Token belum diset, notifikasi WA tidak akan
                                    terkirim
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
                        >
                            {fonnteToken ? "✏️ Ubah Token" : "➕ Set Token"}
                        </button>
                    </div>
                </Card>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    {/* Modal Box */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-slate-800 text-lg">
                                🔑 Update Token Fonnte
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                                    Token Baru
                                </label>
                                <input
                                    type="text"
                                    value={data.fonnte_token}
                                    onChange={(e) =>
                                        setData("fonnte_token", e.target.value)
                                    }
                                    placeholder="Masukkan token Fonnte..."
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.fonnte_token && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.fonnte_token}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                                Token bisa didapatkan di dashboard{" "}
                                <a
                                    href="https://app.fonnte.com"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    app.fonnte.com
                                </a>{" "}
                                → Device → Token
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.fonnte_token}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Token"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
