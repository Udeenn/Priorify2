import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

interface SubTask {
    id: number;
    nama: string;
    selesai: boolean;
    urutan: number;
}

interface Task {
    id: number;
    nama_tugas: string;
    mata_kuliah: string;
    deadline: string;
    deskripsi: string | null;
    urgensi: number;
    kepentingan: number;
    kerumitan: number;
    quadrant: string;
    reminders: string[];
    status: string;
    progress: number;
    subtasks: SubTask[];
}

interface Props {
    auth: any;
    task: Task;
    mataKuliah?: { id: number; nama: string }[];
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

type Quadrant = "do_first" | "schedule" | "delegate" | "delete";

const quadrantInfo = {
    do_first: { label: "Do First", desc: "Mendesak & penting — kerjakan segera!", badgeBg: "bg-red-500/20", badgeText: "text-red-400", borderColor: "border-red-500/40", cellBg: "bg-red-950/60" },
    schedule:  { label: "Schedule",  desc: "Penting tapi belum mendesak — jadwalkan.", badgeBg: "bg-blue-500/20", badgeText: "text-blue-400", borderColor: "border-blue-500/40", cellBg: "bg-blue-950/60" },
    delegate:  { label: "Delegate",  desc: "Mendesak tapi tidak terlalu penting.", badgeBg: "bg-yellow-500/20", badgeText: "text-yellow-400", borderColor: "border-yellow-500/40", cellBg: "bg-yellow-950/60" },
    delete:    { label: "Delete",    desc: "Tidak mendesak & tidak penting.", badgeBg: "bg-slate-700/40", badgeText: "text-slate-400", borderColor: "border-slate-600/40", cellBg: "bg-slate-800/60" },
};

function computeQuadrant(urgensi: number, kepentingan: number): Quadrant {
    const urgent    = urgensi >= 3;
    const important = kepentingan >= 3;
    if (urgent && important)   return "do_first";
    if (!urgent && important)  return "schedule";
    if (urgent && !important)  return "delegate";
    return "delete";
}

const sliderLabel = (val: number) =>
    ["", "Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"][val];

export default function Edit({ auth, task, mataKuliah }: Props) {
    const [form, setForm] = useState({
        nama_tugas:  task.nama_tugas,
        mata_kuliah: task.mata_kuliah,
        deadline:    task.deadline,
        deskripsi:   task.deskripsi ?? "",
        urgensi:     task.urgensi,
        kepentingan: task.kepentingan,
        kerumitan:   task.kerumitan,
        reminders:   task.reminders ?? [],
    });
    const [subtasks, setSubtasks] = useState(
        task.subtasks.map((s) => ({ id: s.id, nama: s.nama }))
    );
    const [nextId, setNextId] = useState(9000);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const quadrant = computeQuadrant(form.urgensi, form.kepentingan);
    const qInfo    = quadrantInfo[quadrant];
    const mkList   = mataKuliah?.length ? mataKuliah.map((m) => m.nama) : MATA_KULIAH_DEFAULT;
    const today    = new Date().toISOString().split("T")[0];

    const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

    const toggleReminder = (val: string) => {
        set("reminders",
            form.reminders.includes(val)
                ? form.reminders.filter((r) => r !== val)
                : [...form.reminders, val]
        );
    };

    const addSubtask = () => {
        setSubtasks((prev) => [...prev, { id: nextId, nama: "" }]);
        setNextId((n) => n + 1);
    };

    const removeSubtask = (id: number) =>
        setSubtasks((prev) => prev.filter((s) => s.id !== id));

    const updateSubtask = (id: number, value: string) =>
        setSubtasks((prev) => prev.map((s) => s.id === id ? { ...s, nama: value } : s));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.patch(`/tasks/${task.id}`, {
            ...form,
            subtasks: subtasks
                .filter((s) => s.nama.trim() !== "")
                .map((s, i) => ({ nama: s.nama, urutan: i })),
        }, {
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => router.visit(`/tasks/${task.id}`),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={`/tasks/${task.id}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Kembali
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 leading-tight">Edit Tugas</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Perbarui detail tugas</p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit — ${task.nama_tugas}`} />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                        {/* LEFT */}
                        <div className="lg:col-span-3 flex flex-col gap-5">

                            {/* Info Tugas */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <span className="text-xl">📋</span>
                                    <h3 className="text-base font-bold text-slate-800">Informasi Tugas</h3>
                                </div>

                                <div className="mb-5">
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                        Nama Tugas <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.nama_tugas}
                                        onChange={(e) => set("nama_tugas", e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 text-slate-800 placeholder-slate-300 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors.nama_tugas ? "border-red-400" : "border-slate-200"}`}
                                        required
                                    />
                                    {errors.nama_tugas && <p className="text-xs text-red-500 mt-1">{errors.nama_tugas}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                            Mata Kuliah <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.mata_kuliah}
                                            onChange={(e) => set("mata_kuliah", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled>Pilih Matkul</option>
                                            {mkList.map((mk) => (
                                                <option key={mk} value={mk}>{mk}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                            Deadline <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={form.deadline}
                                            onChange={(e) => set("deadline", e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                                        Deskripsi <span className="text-slate-300 font-normal normal-case">(opsional)</span>
                                    </label>
                                    <textarea
                                        value={form.deskripsi}
                                        onChange={(e) => set("deskripsi", e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50 text-slate-800 placeholder-slate-300 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                        placeholder="Tambahkan catatan atau detail tugas..."
                                    />
                                </div>
                            </div>

                            {/* Sub-tugas */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <span className="text-xl">✅</span>
                                    <h3 className="text-base font-bold text-slate-800 flex-1">Sub-tugas</h3>
                                    <button
                                        type="button"
                                        onClick={addSubtask}
                                        className="flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                    >
                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/>
                                        </svg>
                                        Tambah
                                    </button>
                                </div>

                                {subtasks.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">
                                        Belum ada sub-tugas.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        {subtasks.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 group focus-within:border-blue-400 focus-within:bg-white transition"
                                            >
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                                                <input
                                                    type="text"
                                                    value={sub.nama}
                                                    onChange={(e) => updateSubtask(sub.id, e.target.value)}
                                                    placeholder="Nama sub-tugas..."
                                                    className="flex-1 bg-transparent text-sm text-slate-700 font-medium outline-none placeholder-slate-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSubtask(sub.id)}
                                                    className="text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
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
                            <div className="bg-slate-900 rounded-3xl p-7 text-white">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="text-xl">⚡</span>
                                    <h3 className="text-base font-bold">Parameter Prioritas</h3>
                                </div>
                                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                    Atur urgensi, kepentingan, dan kerumitan.
                                </p>

                                {[
                                    { key: "urgensi", label: "Urgensi", color: "#f87171", accentClass: "accent-red-400" },
                                    { key: "kepentingan", label: "Kepentingan", color: "#60a5fa", accentClass: "accent-blue-400" },
                                    { key: "kerumitan", label: "Kerumitan", color: "#fbbf24", accentClass: "accent-yellow-400" },
                                ].map((item) => {
                                    const val = form[item.key as keyof typeof form] as number;
                                    return (
                                        <div key={item.key} className="mb-5 last:mb-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">{item.label}</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">{sliderLabel(val)}</span>
                                                    <span className="text-base font-black w-4 text-right" style={{ color: item.color }}>{val}</span>
                                                </div>
                                            </div>
                                            <input
                                                type="range" min="1" max="5"
                                                value={val}
                                                onChange={(e) => set(item.key, Number(e.target.value))}
                                                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${item.accentClass}`}
                                                style={{ background: `linear-gradient(to right, ${item.color} ${(val - 1) * 25}%, #374151 ${(val - 1) * 25}%)` }}
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                                <span>Rendah</span><span>Tinggi</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Preview Matrix */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <span className="text-blue-500 font-black">✦</span>
                                    <h3 className="text-base font-bold text-slate-800">Preview Matrix</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 mb-4">
                                    {(["do_first", "schedule", "delegate", "delete"] as const).map((q) => {
                                        const info = quadrantInfo[q];
                                        const isActive = quadrant === q;
                                        return (
                                            <div
                                                key={q}
                                                className={`rounded-2xl p-4 border transition-all duration-200 ${info.cellBg} ${info.borderColor} ${isActive ? "scale-105 shadow-lg" : "opacity-60"}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${info.badgeText}`}>
                                                    {info.label}
                                                </span>
                                                <div className={`w-2 h-2 rounded-full mt-1 ${isActive ? "bg-white" : "bg-slate-600"}`} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={`flex items-center gap-3 rounded-xl p-3 border ${qInfo.borderColor} ${qInfo.badgeBg}`}>
                                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${qInfo.badgeBg} ${qInfo.badgeText} border ${qInfo.borderColor} whitespace-nowrap`}>
                                        {qInfo.label}
                                    </span>
                                    <p className="text-xs text-slate-500 leading-relaxed">{qInfo.desc}</p>
                                </div>
                            </div>

                            {/* Reminder */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <span className="text-xl">💬</span>
                                    <h3 className="text-base font-bold text-slate-800">Reminder WhatsApp</h3>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {["3", "1", "0"].map((val) => {
                                        const active = form.reminders.includes(val);
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => toggleReminder(val)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                                                    active
                                                        ? "bg-blue-50 border-blue-400 text-blue-600"
                                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                                                }`}
                                            >
                                                H-{val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Link
                                    href={`/tasks/${task.id}`}
                                    className="flex-1 flex items-center justify-center py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                            </svg>
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}