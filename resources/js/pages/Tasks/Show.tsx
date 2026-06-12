import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface SubTaskItem {
    id: number;
    task_id: number;
    nama: string;
    selesai: boolean;
}

interface TaskProps {
    auth: { user: any };
    task: {
        id: number;
        nama_tugas: string;
        mata_kuliah: string;
        deadline: string;
        deskripsi?: string | null;
        kerumitan: number;
        urgensi: number;
        kepentingan: number;
        quadrant: string;
        status: string;
        progress: number;
        reminders?: string;
        subtasks?: SubTaskItem[];
    };
}

const MATA_KULIAH_DEFAULT = [
    "Teknik Informatika",
    "Matematika Diskrit",
    "Basis Data",
    "Pemrograman Web",
    "Capstone Project",
    "Jaringan Komputer",
    "Sistem Operasi",
];

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

type Quadrant = "do_first" | "schedule" | "delegate" | "delete";

const quadrantInfo = {
    do_first: {
        label: "Do First",
        badgeBg: "bg-red-500/10",
        badgeText: "text-red-400",
        borderColor: "border-red-500/30",
    },
    schedule: {
        label: "Schedule",
        badgeBg: "bg-blue-500/10",
        badgeText: "text-blue-400",
        borderColor: "border-blue-500/30",
    },
    delegate: {
        label: "Delegate",
        badgeBg: "bg-yellow-500/10",
        badgeText: "text-yellow-400",
        borderColor: "border-yellow-500/30",
    },
    delete: {
        label: "Delete",
        badgeBg: "bg-slate-700/20",
        badgeText: "text-slate-400",
        borderColor: "border-slate-600/30",
    },
};

function getInitials(name: string): string {
    if (!name) return "TG";
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function calculateReminderDate(
    deadlineStr: string,
    daysBefore: string,
): string {
    if (!deadlineStr) return "-";
    const d = new Date(deadlineStr);
    d.setDate(d.getDate() - (parseInt(daysBefore, 10) || 0));
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getReminderStatus(deadlineStr: string, daysBefore: string) {
    if (!deadlineStr)
        return {
            label: "Terjadwal",
            style: "bg-slate-100 border border-slate-200",
            textStyle: "text-slate-500",
            dotColor: "bg-slate-400",
        };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const rem = new Date(deadlineStr);
    rem.setDate(rem.getDate() - (parseInt(daysBefore, 10) || 0));
    rem.setHours(0, 0, 0, 0);
    if (now > rem)
        return {
            label: "Sent",
            style: "bg-green-50 border border-green-100",
            textStyle: "text-green-600 font-extrabold",
            dotColor: "bg-green-500",
        };
    if (now.getTime() === rem.getTime())
        return {
            label: "Pending (Hari ini)",
            style: "bg-amber-50 border border-amber-200 animate-pulse",
            textStyle: "text-amber-700 font-extrabold",
            dotColor: "bg-amber-500",
        };
    return {
        label: "Terjadwal",
        style: "bg-blue-50 border border-blue-100",
        textStyle: "text-blue-500 font-bold",
        dotColor: "bg-blue-400",
    };
}

function computeQuadrant(urgensi: number, kepentingan: number): Quadrant {
    const u = urgensi >= 3,
        i = kepentingan >= 3;
    if (u && i) return "do_first";
    if (!u && i) return "schedule";
    if (u && !i) return "delegate";
    return "delete";
}

const sliderLabel = (v: number) =>
    ["", "Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"][v];

// ── Edit Modal ────────────────────────────────────────────────────────────────
function toDateInput(dateStr: string): string {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
}
function EditModal({
    task,
    onClose,
}: {
    task: TaskProps["task"];
    onClose: () => void;
}) {
    const rawReminders = task.reminders ? JSON.parse(task.reminders) : [];

    const [form, setForm] = useState({
        nama_tugas: task.nama_tugas,
        mata_kuliah: task.mata_kuliah,
        deadline: toDateInput(task.deadline),
        deskripsi: task.deskripsi ?? "",
        urgensi: task.urgensi,
        kepentingan: task.kepentingan,
        kerumitan: task.kerumitan,
        reminders: rawReminders as string[],
    });

    const [subtasks, setSubtasks] = useState(
        (task.subtasks ?? []).map((s) => ({
            id: s.id,
            nama: s.nama,
            selesai: s.selesai,
        })),
    );
    const [nextId, setNextId] = useState(9000);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const quadrant = computeQuadrant(form.urgensi, form.kepentingan);
    const qInfo = quadrantInfo[quadrant];

    const set = (key: string, value: any) =>
        setForm((p) => ({ ...p, [key]: value }));

    const toggleReminder = (val: string) =>
        set(
            "reminders",
            form.reminders.includes(val)
                ? form.reminders.filter((r) => r !== val)
                : [...form.reminders, val],
        );

    const addSubtask = () => {
        setSubtasks((p) => [...p, { id: nextId, nama: "", selesai: false }]);
        setNextId((n) => n + 1);
    };
    const removeSubtask = (id: number) =>
        setSubtasks((p) => p.filter((s) => s.id !== id));
    const updateSubtask = (id: number, val: string) =>
        setSubtasks((p) =>
            p.map((s) => (s.id === id ? { ...s, nama: val } : s)),
        );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.patch(
            `/tasks/${task.id}`,
            {
                ...form,
                subtasks: subtasks
                    .filter((s) => s.nama.trim() !== "")
                    .map((s, i) => ({ nama: s.nama, urutan: i })),
            },
            {
                onError: (errs) => {
                    setErrors(errs);
                    setProcessing(false);
                },
                onSuccess: () => onClose(),
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
                    <div>
                        <h3 className="font-black text-slate-800 text-lg">
                            Edit Tugas
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Perbarui detail tugas
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition text-lg"
                    >
                        x
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* LEFT */}
                        <div className="lg:col-span-3 flex flex-col gap-5">
                            {/* Info Tugas */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="text-lg">📋</span>
                                    <h4 className="text-sm font-bold text-slate-700">
                                        Informasi Tugas
                                    </h4>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                                        Nama Tugas{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.nama_tugas}
                                        onChange={(e) =>
                                            set("nama_tugas", e.target.value)
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.nama_tugas ? "border-red-400" : "border-slate-200"}`}
                                        required
                                    />
                                    {errors.nama_tugas && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.nama_tugas}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                                            Mata Kuliah{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={form.mata_kuliah}
                                            onChange={(e) =>
                                                set(
                                                    "mata_kuliah",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled>
                                                Pilih Matkul
                                            </option>
                                            {MATA_KULIAH_DEFAULT.map((mk) => (
                                                <option key={mk} value={mk}>
                                                    {mk}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                                            Deadline{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            value={form.deadline}
                                            onChange={(e) =>
                                                set("deadline", e.target.value)
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                                        Deskripsi{" "}
                                        <span className="text-slate-300 font-normal normal-case">
                                            (opsional)
                                        </span>
                                    </label>
                                    <textarea
                                        value={form.deskripsi}
                                        onChange={(e) =>
                                            set("deskripsi", e.target.value)
                                        }
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800 placeholder-slate-300 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                        placeholder="Tambahkan catatan atau detail tugas..."
                                    />
                                </div>
                            </div>

                            {/* Sub-tugas */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg">✅</span>
                                    <h4 className="text-sm font-bold text-slate-700 flex-1">
                                        Sub-tugas
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={addSubtask}
                                        className="flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                    >
                                        + Tambah
                                    </button>
                                </div>

                                {subtasks.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">
                                        Belum ada sub-tugas.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {subtasks.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 group focus-within:border-blue-400 transition"
                                            >
                                                {/* Checkbox status selesai — read only, hanya tampilan */}
                                                <div
                                                    className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${sub.selesai ? "bg-green-500 border-green-500" : "border-slate-300"}`}
                                                >
                                                    {sub.selesai && (
                                                        <svg
                                                            className="w-2.5 h-2.5 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="3.5"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={sub.nama}
                                                    onChange={(e) =>
                                                        updateSubtask(
                                                            sub.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Nama sub-tugas..."
                                                    className={`flex-1 bg-transparent text-sm font-medium outline-none placeholder-slate-300 ${sub.selesai ? "text-slate-400 line-through" : "text-slate-700"}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSubtask(sub.id)
                                                    }
                                                    className="text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="lg:col-span-2 flex flex-col gap-5">
                            {/* Parameter Prioritas */}
                            <div className="bg-slate-900 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">⚡</span>
                                    <h4 className="text-sm font-bold">
                                        Parameter Prioritas
                                    </h4>
                                </div>
                                <p className="text-xs text-slate-400 mb-5">
                                    Atur urgensi, kepentingan, dan kerumitan.
                                </p>
                                {[
                                    {
                                        key: "urgensi",
                                        label: "Urgensi",
                                        color: "#f87171",
                                        accent: "accent-red-400",
                                    },
                                    {
                                        key: "kepentingan",
                                        label: "Kepentingan",
                                        color: "#60a5fa",
                                        accent: "accent-blue-400",
                                    },
                                    {
                                        key: "kerumitan",
                                        label: "Kerumitan",
                                        color: "#fbbf24",
                                        accent: "accent-yellow-400",
                                    },
                                ].map((item) => {
                                    const val = form[
                                        item.key as keyof typeof form
                                    ] as number;
                                    return (
                                        <div
                                            key={item.key}
                                            className="mb-4 last:mb-0"
                                        >
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                                                    {item.label}
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">
                                                        {sliderLabel(val)}
                                                    </span>
                                                    <span
                                                        className="text-sm font-black w-4 text-right"
                                                        style={{
                                                            color: item.color,
                                                        }}
                                                    >
                                                        {val}
                                                    </span>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                value={val}
                                                onChange={(e) =>
                                                    set(
                                                        item.key,
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${item.accent}`}
                                                style={{
                                                    background: `linear-gradient(to right, ${item.color} ${(val - 1) * 25}%, #374151 ${(val - 1) * 25}%)`,
                                                }}
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                                <span>Rendah</span>
                                                <span>Tinggi</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Preview Matrix */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-blue-500 font-black text-sm">
                                        ✦
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-700">
                                        Preview Matrix
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {(
                                        [
                                            "do_first",
                                            "schedule",
                                            "delegate",
                                            "delete",
                                        ] as const
                                    ).map((q) => {
                                        const info = quadrantInfo[q];
                                        const isActive = quadrant === q;
                                        return (
                                            <div
                                                key={q}
                                                className={`rounded-xl p-3 border transition-all duration-200 ${info.borderColor} ${isActive ? `${info.badgeBg} scale-105 shadow-md` : "bg-slate-100/50 opacity-50"}`}
                                            >
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-wider block ${isActive ? info.badgeText : "text-slate-400"}`}
                                                >
                                                    {info.label}
                                                </span>
                                                <div
                                                    className={`w-2 h-2 rounded-full mt-1.5 ${isActive ? "opacity-60 bg-current" : "bg-slate-300"}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div
                                    className={`flex items-center gap-2 rounded-xl p-3 border ${qInfo.borderColor} ${qInfo.badgeBg}`}
                                >
                                    <span
                                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${qInfo.badgeText} border ${qInfo.borderColor} whitespace-nowrap`}
                                    >
                                        {qInfo.label}
                                    </span>
                                </div>
                            </div>

                            {/* Reminder */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg">💬</span>
                                    <h4 className="text-sm font-bold text-slate-700">
                                        Reminder WhatsApp
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {["3", "1", "0"].map((val) => {
                                        const active =
                                            form.reminders.includes(val);
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() =>
                                                    toggleReminder(val)
                                                }
                                                className={`px-4 py-2 rounded-full text-xs font-bold border transition ${active ? "bg-blue-50 border-blue-400 text-blue-600" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
                                            >
                                                H-{val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="15"
                                        height="15"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Show({ auth, task }: TaskProps) {
    const [showEditModal, setShowEditModal] = useState(false);

    const completeTask = () => {
        router.patch(route("tasks.complete", task.id));
    };

    const reminderList = task?.reminders
        ? JSON.parse(task.reminders)
        : ["3", "1", "0"];
    const totalSubtasks = task?.subtasks?.length || 0;
    const completedSubtasks =
        task?.subtasks?.filter((s) => s.selesai).length || 0;

    const handleToggleSubtask = (subtask: SubTaskItem) => {
        router.patch(
            `/tasks/${task?.id}/subtasks/${subtask.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleMarkAsDone = () => {
        if (confirm("Tandai tugas ini sebagai selesai keseluruhan?")) {
            router.patch(`/tasks/${task?.id}`, {
                status: "selesai",
                progress: 100,
            });
        }
    };

    const handleDeleteTask = () => {
        if (confirm("Apakah kamu yakin ingin menghapus tugas ini?")) {
            router.delete(`/tasks/${task?.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Detail Tugas
                    </h2>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title={`Priorify - ${task?.nama_tugas || "Detail Tugas"}`} />

            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
                {/* Banner */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 ${task?.quadrant === "do_first" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}
                        >
                            {getInitials(task?.mata_kuliah)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                                {task?.nama_tugas}
                            </h1>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-xs font-bold text-slate-400">
                                    {task?.mata_kuliah}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <span
                            className={`text-xs font-black px-3 py-1.5 rounded-full ${quadrantColor[task?.quadrant || "do_first"]}`}
                        >
                            📌 {quadrantLabel[task?.quadrant || "do_first"]}
                        </span>
                        <span
                            className={`text-xs font-black px-3 py-1.5 rounded-full ${task?.status === "selesai" ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                        >
                            {task?.status === "selesai"
                                ? "✓ Selesai"
                                : "⏱️ Pending"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100/80">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                    Matkul
                                </p>
                                <p className="text-sm font-black text-slate-700 truncate">
                                    {task?.mata_kuliah}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100/80">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                    Deadline
                                </p>
                                <p className="text-sm font-black text-red-500">
                                    {formatDate(task?.deadline)}
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/60">
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-1">
                                    Kerumitan
                                </p>
                                <p className="text-sm font-black text-amber-700">
                                    {task?.kerumitan || 3}/5
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Progress sub-tugas
                                        </h3>
                                        <p className="text-slate-400 text-xs mt-0.5">
                                            Centang untuk mengubah progres
                                            pemenuhan tugas
                                        </p>
                                    </div>
                                    <span className="text-sm font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                                        {completedSubtasks}/{totalSubtasks}
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                                        style={{
                                            width: `${task?.progress || 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {task?.subtasks && task.subtasks.length > 0 ? (
                                    task.subtasks.map((sub) => (
                                        <div
                                            key={sub.id}
                                            onClick={() =>
                                                handleToggleSubtask(sub)
                                            }
                                            className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/60 transition cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${sub.selesai ? "bg-green-500 border-green-500 text-white" : "border-slate-300 bg-white group-hover:border-slate-400"}`}
                                                >
                                                    {sub.selesai && (
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="3.5"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-sm font-bold tracking-tight transition-colors ${sub.selesai ? "text-slate-400 line-through font-normal" : "text-slate-700"}`}
                                                >
                                                    {sub.nama}
                                                </span>
                                            </div>
                                            <span
                                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider border ${sub.selesai ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}
                                            >
                                                {sub.selesai
                                                    ? "Selesai"
                                                    : "Belum"}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-16 text-center text-slate-400 text-sm font-bold">
                                        📭 Tidak ada item sub-tugas pendukung.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* Reminder */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                                💬 Jadwal Reminder WA
                            </h3>
                            <div className="space-y-3">
                                {reminderList.map(
                                    (rem: string, idx: number) => {
                                        const remDay = rem.trim();
                                        const status = getReminderStatus(
                                            task?.deadline,
                                            remDay,
                                        );
                                        const calDate = calculateReminderDate(
                                            task?.deadline,
                                            remDay,
                                        );
                                        return (
                                            <div
                                                key={idx}
                                                className="flex flex-col gap-1 p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl"
                                            >
                                                <div className="flex justify-between items-center text-xs">
                                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${status.dotColor}`}
                                                        />
                                                        <span>
                                                            {remDay === "0"
                                                                ? "H-0 (Hari Batas)"
                                                                : `H-${remDay} Sebelum Batas`}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] px-2 py-0.5 rounded font-black tracking-wide ${status.style} ${status.textStyle}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-400 pl-4">
                                                    {calDate}
                                                </p>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>

                        {/* Panel Aksi */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-5 space-y-3">
                            {/* Edit */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit Tugas
                            </button>

                            {/* Selesai */}
                            <button
                                // onClick={handleMarkAsDone}
                                // disabled={task?.status === "selesai"}
                                onClick={completeTask}
                                className={`w-full py-3.5 font-bold rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 ${task?.status === "selesai" ? "bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-green-100"}`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {task?.status === "selesai"
                                    ? "Sudah Diselesaikan"
                                    : "Tandai Selesai"}
                            </button>

                            {/* Hapus */}
                            <button
                                onClick={handleDeleteTask}
                                className="w-full py-3.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Hapus Tugas Permanen
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditModal
                    task={task}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
