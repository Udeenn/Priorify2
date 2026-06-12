{{-- resources/views/tasks/create.blade.php --}}
@extends('layouts.app')

@section('title', 'Tambah Tugas Baru')

@section('content')
<div class="page-wrapper">

    {{-- Header --}}
    <div class="page-header">
        <div class="header-left">
            <a href="{{ route('dashboard') }}" class="back-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
                Kembali
            </a>
            <div>
                <h1 class="page-title">Tambah Tugas Baru</h1>
                <p class="page-subtitle">Isi detail tugas dan parameter prioritas</p>
            </div>
        </div>
    </div>

    {{-- Form --}}
    <form action="{{ route('tasks.store') }}" method="POST" id="taskForm">
        @csrf
        <div class="form-grid">

            {{-- LEFT COLUMN --}}
            <div class="form-col-left">

                {{-- Card: Info Dasar --}}
                <div class="form-card">
                    <div class="form-card-header">
                        <span class="form-card-icon">📋</span>
                        <h2 class="form-card-title">Informasi Tugas</h2>
                    </div>

                    <div class="field-group">
                        <label class="field-label" for="nama_tugas">Nama Tugas <span class="required">*</span></label>
                        <input
                            type="text"
                            id="nama_tugas"
                            name="nama_tugas"
                            class="field-input @error('nama_tugas') is-error @enderror"
                            placeholder="Contoh: Laporan Praktikum Jaringan"
                            value="{{ old('nama_tugas') }}"
                            required
                        >
                        @error('nama_tugas')
                            <span class="field-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="field-row">
                        <div class="field-group">
                            <label class="field-label" for="mata_kuliah">Mata Kuliah <span class="required">*</span></label>
                            <select id="mata_kuliah" name="mata_kuliah" class="field-input field-select @error('mata_kuliah') is-error @enderror" required>
                                <option value="" disabled {{ old('mata_kuliah') ? '' : 'selected' }}>Pilih Matkul</option>
                                @foreach($mataKuliah ?? [] as $mk)
                                    <option value="{{ $mk->id }}" {{ old('mata_kuliah') == $mk->id ? 'selected' : '' }}>
                                        {{ $mk->nama }}
                                    </option>
                                @endforeach
                                {{-- fallback untuk development --}}
                                <option value="teknik-informatika">Teknik Informatika</option>
                                <option value="matematika-diskrit">Matematika Diskrit</option>
                                <option value="basis-data">Basis Data</option>
                                <option value="pemrograman-web">Pemrograman Web</option>
                                <option value="capstone-project">Capstone Project</option>
                            </select>
                            @error('mata_kuliah')
                                <span class="field-error">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="field-group">
                            <label class="field-label" for="deadline">Deadline <span class="required">*</span></label>
                            <input
                                type="date"
                                id="deadline"
                                name="deadline"
                                class="field-input @error('deadline') is-error @enderror"
                                value="{{ old('deadline') }}"
                                min="{{ date('Y-m-d') }}"
                                required
                            >
                            @error('deadline')
                                <span class="field-error">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label" for="deskripsi">Deskripsi <span class="field-hint">(opsional)</span></label>
                        <textarea
                            id="deskripsi"
                            name="deskripsi"
                            class="field-input field-textarea"
                            placeholder="Tambahkan catatan atau detail tugas..."
                            rows="3"
                        >{{ old('deskripsi') }}</textarea>
                    </div>
                </div>

                {{-- Card: Sub-tugas --}}
                <div class="form-card">
                    <div class="form-card-header">
                        <span class="form-card-icon">✅</span>
                        <h2 class="form-card-title">Sub-tugas</h2>
                        <button type="button" class="add-subtask-btn" id="addSubtaskBtn">
                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
                            </svg>
                            Tambah
                        </button>
                    </div>

                    <div class="subtask-list" id="subtaskList">
                        {{-- Sub-tugas awal (contoh) --}}
                        <div class="subtask-item" data-index="0">
                            <div class="subtask-check-wrap">
                                <div class="subtask-dot"></div>
                            </div>
                            <input
                                type="text"
                                name="subtasks[0][nama]"
                                class="subtask-input"
                                placeholder="Nama sub-tugas..."
                            >
                            <button type="button" class="subtask-remove" onclick="removeSubtask(this)">
                                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <p class="subtask-empty" id="subtaskEmpty" style="display:none;">
                        Belum ada sub-tugas. Klik "+ Tambah" untuk menambahkan.
                    </p>
                </div>

            </div>

            {{-- RIGHT COLUMN --}}
            <div class="form-col-right">

                {{-- Card: Parameter Prioritas --}}
                <div class="form-card priority-card">
                    <div class="form-card-header">
                        <span class="form-card-icon">⚡</span>
                        <h2 class="form-card-title">Parameter Prioritas</h2>
                    </div>
                    <p class="priority-desc">
                        Atur tingkat urgensi, kepentingan, dan kerumitan untuk menentukan posisi tugas di Eisenhower Matrix.
                    </p>

                    {{-- Urgensi --}}
                    <div class="slider-group">
                        <div class="slider-label-row">
                            <label class="slider-label">Urgensi</label>
                            <span class="slider-value urgent-color" id="urgensiVal">3</span>
                        </div>
                        <div class="slider-track-wrap">
                            <input
                                type="range"
                                id="urgensi"
                                name="urgensi"
                                min="1" max="5"
                                value="{{ old('urgensi', 3) }}"
                                class="slider-input slider-urgent"
                                oninput="updateSlider('urgensi', this.value)"
                            >
                            <div class="slider-labels-below">
                                <span>Rendah</span><span>Tinggi</span>
                            </div>
                        </div>
                    </div>

                    {{-- Kepentingan --}}
                    <div class="slider-group">
                        <div class="slider-label-row">
                            <label class="slider-label">Kepentingan</label>
                            <span class="slider-value important-color" id="kepentinganVal">3</span>
                        </div>
                        <div class="slider-track-wrap">
                            <input
                                type="range"
                                id="kepentingan"
                                name="kepentingan"
                                min="1" max="5"
                                value="{{ old('kepentingan', 3) }}"
                                class="slider-input slider-important"
                                oninput="updateSlider('kepentingan', this.value)"
                            >
                            <div class="slider-labels-below">
                                <span>Rendah</span><span>Tinggi</span>
                            </div>
                        </div>
                    </div>

                    {{-- Kerumitan --}}
                    <div class="slider-group">
                        <div class="slider-label-row">
                            <label class="slider-label">Kerumitan</label>
                            <span class="slider-value complexity-color" id="kerumitanVal">3</span>
                        </div>
                        <div class="slider-track-wrap">
                            <input
                                type="range"
                                id="kerumitan"
                                name="kerumitan"
                                min="1" max="5"
                                value="{{ old('kerumitan', 3) }}"
                                class="slider-input slider-complex"
                                oninput="updateSlider('kerumitan', this.value)"
                            >
                            <div class="slider-labels-below">
                                <span>Rendah</span><span>Tinggi</span>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Card: Preview Matrix --}}
                <div class="form-card matrix-preview-card">
                    <div class="form-card-header">
                        <span class="form-card-icon">✦</span>
                        <h2 class="form-card-title">Preview Eisenhower Matrix</h2>
                    </div>

                    <div class="matrix-grid">
                        <div class="matrix-cell urgent-important" id="q1">
                            <span class="matrix-label">DO FIRST</span>
                            <span class="matrix-sub">Mendesak & Penting</span>
                            <div class="matrix-indicator" id="q1-dot"></div>
                        </div>
                        <div class="matrix-cell not-urgent-important" id="q2">
                            <span class="matrix-label">SCHEDULE</span>
                            <span class="matrix-sub">Penting, Tidak Mendesak</span>
                            <div class="matrix-indicator" id="q2-dot"></div>
                        </div>
                        <div class="matrix-cell urgent-not-important" id="q3">
                            <span class="matrix-label">DELEGATE</span>
                            <span class="matrix-sub">Mendesak, Tidak Penting</span>
                            <div class="matrix-indicator" id="q3-dot"></div>
                        </div>
                        <div class="matrix-cell not-urgent-not-important" id="q4">
                            <span class="matrix-label">DELETE</span>
                            <span class="matrix-sub">Tidak Mendesak & Tidak Penting</span>
                            <div class="matrix-indicator" id="q4-dot"></div>
                        </div>
                    </div>

                    <div class="matrix-result" id="matrixResult">
                        <span class="matrix-result-badge" id="matrixBadge">Schedule</span>
                        <span class="matrix-result-text" id="matrixText">Tugas ini penting tapi belum mendesak — jadwalkan dengan baik.</span>
                    </div>
                </div>

                {{-- Card: Reminder WA --}}
                <div class="form-card reminder-card">
                    <div class="form-card-header">
                        <span class="form-card-icon">💬</span>
                        <h2 class="form-card-title">Jadwal Reminder WhatsApp</h2>
                    </div>

                    <div class="reminder-options">
                        <label class="reminder-chip">
                            <input type="checkbox" name="reminders[]" value="3" {{ in_array('3', old('reminders', ['3', '1'])) ? 'checked' : '' }}>
                            <span>H-3</span>
                        </label>
                        <label class="reminder-chip">
                            <input type="checkbox" name="reminders[]" value="1" {{ in_array('1', old('reminders', ['3', '1'])) ? 'checked' : '' }}>
                            <span>H-1</span>
                        </label>
                        <label class="reminder-chip">
                            <input type="checkbox" name="reminders[]" value="0">
                            <span>H-0</span>
                        </label>
                        <button type="button" class="reminder-chip reminder-add" id="addReminderBtn">
                            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
                            </svg>
                            Tambah
                        </button>
                    </div>

                    <p class="reminder-note">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                        </svg>
                        Pastikan nomor WhatsApp sudah diverifikasi di <a href="{{ route('profile') }}">Profil</a>.
                    </p>
                </div>

                {{-- Actions --}}
                <div class="form-actions">
                    <a href="{{ route('dashboard') }}" class="btn-cancel">Batal</a>
                    <button type="submit" class="btn-save" id="submitBtn">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        Simpan Tugas
                    </button>
                </div>

            </div>
        </div>
    </form>
</div>
@endsection

@push('styles')
<style>
/* =============================================
   PRIORIFY — Tambah Tugas Page Styles
   Consistent with Dashboard theme
   ============================================= */

:root {
    --bg-main:       #f0f2f7;
    --bg-card:       #ffffff;
    --bg-sidebar:    #0d1b2a;
    --blue-primary:  #2563eb;
    --blue-light:    #eff6ff;
    --blue-hover:    #1d4ed8;
    --urgent-bg:     #4a1529;
    --urgent-color:  #f87171;
    --schedule-bg:   #0d2040;
    --schedule-color:#60a5fa;
    --delegate-bg:   #2d2000;
    --delegate-color:#fbbf24;
    --delete-bg:     #1c1c2e;
    --delete-color:  #a78bfa;
    --text-primary:  #111827;
    --text-secondary:#6b7280;
    --text-muted:    #9ca3af;
    --border:        #e5e7eb;
    --radius-sm:     8px;
    --radius-md:     14px;
    --radius-lg:     20px;
    --shadow-card:   0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
    --font-sans:     'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
}

/* Import font */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }

body {
    background: var(--bg-main);
    font-family: var(--font-sans);
    color: var(--text-primary);
}

/* ---- PAGE WRAPPER ---- */
.page-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px 64px;
}

/* ---- HEADER ---- */
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
}
.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}
.back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--bg-card);
    transition: all .15s ease;
}
.back-btn:hover {
    color: var(--blue-primary);
    border-color: var(--blue-primary);
    background: var(--blue-light);
}
.page-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 2px;
    letter-spacing: -.3px;
}
.page-subtitle {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
}

/* ---- GRID ---- */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 24px;
    align-items: start;
}
.form-col-left, .form-col-right {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* ---- FORM CARD ---- */
.form-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-card);
    border: 1px solid rgba(0,0,0,.04);
}
.form-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}
.form-card-icon {
    font-size: 18px;
    line-height: 1;
}
.form-card-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    flex: 1;
}

/* ---- FIELDS ---- */
.field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field-group:last-child { margin-bottom: 0; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.field-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 4px;
}
.required { color: #ef4444; }
.field-hint { font-weight: 400; color: var(--text-muted); font-size: 12px; }

.field-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--text-primary);
    background: #fafafa;
    transition: border-color .15s, box-shadow .15s, background .15s;
    outline: none;
    -webkit-appearance: none;
}
.field-input:focus {
    border-color: var(--blue-primary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37,99,235,.1);
}
.field-input.is-error { border-color: #ef4444; }
.field-error { font-size: 12px; color: #ef4444; }

.field-select { cursor: pointer; }
.field-textarea { resize: vertical; min-height: 80px; }

/* ---- SUBTASK ---- */
.add-subtask-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--blue-light);
    color: var(--blue-primary);
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: background .15s;
}
.add-subtask-btn:hover { background: #dbeafe; }

.subtask-list { display: flex; flex-direction: column; gap: 8px; }
.subtask-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    transition: border-color .15s;
}
.subtask-item:focus-within { border-color: var(--blue-primary); }
.subtask-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    flex-shrink: 0;
}
.subtask-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--text-primary);
    outline: none;
}
.subtask-input::placeholder { color: var(--text-muted); }
.subtask-remove {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); padding: 2px;
    border-radius: 4px; display: flex; align-items: center;
    transition: color .15s;
}
.subtask-remove:hover { color: #ef4444; }
.subtask-empty { font-size: 13px; color: var(--text-muted); text-align: center; padding: 12px 0; margin: 0; }

/* ---- PRIORITY SLIDERS ---- */
.priority-card { background: linear-gradient(135deg, #0d1b2a 0%, #1a2e46 100%); }
.priority-card .form-card-icon { filter: brightness(1.2); }
.priority-card .form-card-title { color: #fff; }
.priority-desc { font-size: 13px; color: #94a3b8; margin: -10px 0 20px; line-height: 1.6; }

.slider-group { margin-bottom: 22px; }
.slider-group:last-child { margin-bottom: 0; }
.slider-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.slider-label { font-size: 13px; font-weight: 600; color: #e2e8f0; }
.slider-value { font-size: 15px; font-weight: 800; min-width: 20px; text-align: right; }
.urgent-color { color: #f87171; }
.important-color { color: #60a5fa; }
.complexity-color { color: #fbbf24; }

.slider-input {
    -webkit-appearance: none;
    width: 100%;
    height: 5px;
    border-radius: 99px;
    outline: none;
    cursor: pointer;
    transition: opacity .15s;
}
.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.3);
    cursor: grab;
    transition: transform .1s;
}
.slider-input::-webkit-slider-thumb:active { transform: scale(1.2); cursor: grabbing; }

.slider-urgent  { background: linear-gradient(to right, #f87171 0%, #fca5a5 100%); }
.slider-important{ background: linear-gradient(to right, #60a5fa 0%, #93c5fd 100%); }
.slider-complex { background: linear-gradient(to right, #fbbf24 0%, #fde68a 100%); }

.slider-labels-below {
    display: flex; justify-content: space-between;
    margin-top: 4px;
    font-size: 11px; color: #475569;
}

/* ---- MATRIX PREVIEW ---- */
.matrix-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 14px;
}
.matrix-cell {
    border-radius: var(--radius-md);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    transition: transform .2s, box-shadow .2s;
    cursor: default;
    min-height: 85px;
}
.matrix-cell.active-cell { transform: scale(1.03); box-shadow: 0 4px 20px rgba(0,0,0,.18); }

.urgent-important     { background: var(--urgent-bg); }
.not-urgent-important { background: var(--schedule-bg); }
.urgent-not-important { background: var(--delegate-bg); }
.not-urgent-not-important { background: var(--delete-bg); }

.matrix-label {
    font-size: 11px; font-weight: 800;
    letter-spacing: .08em;
}
.urgent-important     .matrix-label { color: var(--urgent-color); }
.not-urgent-important .matrix-label { color: var(--schedule-color); }
.urgent-not-important .matrix-label { color: var(--delegate-color); }
.not-urgent-not-important .matrix-label { color: var(--delete-color); }

.matrix-sub {
    font-size: 10px; color: rgba(255,255,255,.4);
    line-height: 1.4;
}
.matrix-indicator {
    position: absolute; bottom: 10px; right: 10px;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,.15);
    transition: background .2s, transform .2s;
}
.active-cell .matrix-indicator { background: #fff; transform: scale(1.4); }

.matrix-result {
    background: #f8fafc;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.matrix-result-badge {
    font-size: 11px; font-weight: 800;
    padding: 4px 10px;
    border-radius: 99px;
    background: var(--schedule-bg);
    color: var(--schedule-color);
    letter-spacing: .05em;
    white-space: nowrap;
    transition: background .3s, color .3s;
}
.matrix-result-text { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

/* ---- REMINDER ---- */
.reminder-options { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.reminder-chip {
    display: flex; align-items: center; gap: 4px;
    padding: 6px 14px;
    border-radius: 99px;
    border: 1.5px solid var(--border);
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    background: #fafafa;
    color: var(--text-secondary);
    transition: all .15s;
    user-select: none;
}
.reminder-chip input[type="checkbox"] { display: none; }
.reminder-chip:has(input:checked),
.reminder-chip.active {
    background: var(--blue-light);
    border-color: var(--blue-primary);
    color: var(--blue-primary);
}
.reminder-add {
    background: none; border: 1.5px dashed var(--border);
    font-family: var(--font-sans); cursor: pointer;
    transition: all .15s;
}
.reminder-add:hover { border-color: var(--blue-primary); color: var(--blue-primary); }

.reminder-note {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--text-muted);
    margin: 0;
}
.reminder-note a { color: var(--blue-primary); text-decoration: none; }
.reminder-note a:hover { text-decoration: underline; }

/* ---- ACTIONS ---- */
.form-actions { display: flex; gap: 12px; }
.btn-cancel {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 12px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 14px; font-weight: 600;
    font-family: var(--font-sans);
    text-decoration: none;
    transition: all .15s;
    cursor: pointer;
}
.btn-cancel:hover { background: #f3f4f6; color: var(--text-primary); }

.btn-save {
    flex: 2;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--blue-primary);
    color: #fff;
    font-size: 14px; font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: background .15s, transform .1s, box-shadow .15s;
    box-shadow: 0 2px 10px rgba(37,99,235,.3);
}
.btn-save:hover { background: var(--blue-hover); box-shadow: 0 4px 16px rgba(37,99,235,.4); }
.btn-save:active { transform: scale(.98); }

/* ---- RESPONSIVE ---- */
@media (max-width: 900px) {
    .form-grid { grid-template-columns: 1fr; }
    .form-col-right { order: -1; }
}
@media (max-width: 640px) {
    .page-wrapper { padding: 20px 16px 48px; }
    .field-row { grid-template-columns: 1fr; }
    .page-title { font-size: 18px; }
}
</style>
@endpush

@push('scripts')
<script>
// =============================================
// PRIORIFY — Tambah Tugas Page JavaScript
// =============================================

// ----- Subtask Management -----
let subtaskCount = 1;

document.getElementById('addSubtaskBtn').addEventListener('click', function () {
    const list = document.getElementById('subtaskList');
    const empty = document.getElementById('subtaskEmpty');
    const idx = subtaskCount++;

    const item = document.createElement('div');
    item.className = 'subtask-item';
    item.dataset.index = idx;
    item.innerHTML = `
        <div class="subtask-check-wrap">
            <div class="subtask-dot"></div>
        </div>
        <input
            type="text"
            name="subtasks[${idx}][nama]"
            class="subtask-input"
            placeholder="Nama sub-tugas..."
            autofocus
        >
        <button type="button" class="subtask-remove" onclick="removeSubtask(this)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    `;

    list.appendChild(item);
    empty.style.display = 'none';
    item.querySelector('.subtask-input').focus();
});

function removeSubtask(btn) {
    const item = btn.closest('.subtask-item');
    const list = document.getElementById('subtaskList');
    item.remove();
    if (list.children.length === 0) {
        document.getElementById('subtaskEmpty').style.display = 'block';
    }
}

// ----- Slider Update -----
function updateSlider(name, value) {
    document.getElementById(name + 'Val').textContent = value;
    computeMatrix();
}

// ----- Eisenhower Matrix Computation -----
const matrixMessages = {
    q1: { badge: 'Do First', text: 'Tugas ini mendesak dan penting — kerjakan segera!', bg: 'var(--urgent-bg)', color: 'var(--urgent-color)' },
    q2: { badge: 'Schedule',  text: 'Tugas ini penting tapi belum mendesak — jadwalkan dengan baik.', bg: 'var(--schedule-bg)', color: 'var(--schedule-color)' },
    q3: { badge: 'Delegate',  text: 'Tugas ini mendesak tapi tidak terlalu penting — pertimbangkan untuk didelegasikan.', bg: 'var(--delegate-bg)', color: 'var(--delegate-color)' },
    q4: { badge: 'Delete',    text: 'Tugas ini tidak mendesak dan tidak penting — pertimbangkan untuk dihapus.', bg: 'var(--delete-bg)', color: 'var(--delete-color)' },
};

function computeMatrix() {
    const urgensi     = parseInt(document.getElementById('urgensi').value);
    const kepentingan = parseInt(document.getElementById('kepentingan').value);

    // threshold di tengah (3)
    const isUrgent    = urgensi >= 3;
    const isImportant = kepentingan >= 3;

    let quadrant;
    if (isUrgent && isImportant)       quadrant = 'q1';
    else if (!isUrgent && isImportant) quadrant = 'q2';
    else if (isUrgent && !isImportant) quadrant = 'q3';
    else                               quadrant = 'q4';

    // highlight active cell
    ['q1','q2','q3','q4'].forEach(q => {
        document.getElementById(q).classList.toggle('active-cell', q === quadrant);
    });

    // update badge
    const info = matrixMessages[quadrant];
    const badge = document.getElementById('matrixBadge');
    badge.textContent = info.badge;
    badge.style.background = info.bg;
    badge.style.color = info.color;
    document.getElementById('matrixText').textContent = info.text;
}

// Run on load
computeMatrix();

// ----- Deadline → auto-update reminder labels -----
document.getElementById('deadline').addEventListener('change', function () {
    // Could implement: show exact reminder dates based on deadline
    // e.g., "H-3: 30 Maret 2026"
});

// ----- Form submit feedback -----
document.getElementById('taskForm').addEventListener('submit', function () {
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="spin" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Menyimpan...
    `;
});

// Spin animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; }
`;
document.head.appendChild(style);
</script>
@endpush