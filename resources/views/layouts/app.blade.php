{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Priorify — @yield('title', 'Task Manager')</title>

    {{-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
    /* =============================================
       PRIORIFY — Global App Shell
       ============================================= */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
        --sidebar-w: 240px;
        --topbar-h:  0px; /* no separate topbar — embedded in sidebar header */
        --bg-main:   #f0f2f7;
        --bg-card:   #ffffff;
        --bg-sidebar: #0d1b2a;
        --bg-sidebar-hover: rgba(255,255,255,.07);
        --bg-sidebar-active: rgba(37,99,235,.25);
        --blue-primary: #2563eb;
        --blue-light:   #eff6ff;
        --text-primary:  #111827;
        --text-secondary:#6b7280;
        --text-muted:    #9ca3af;
        --border:        #e5e7eb;
        --font-sans:     'Plus Jakarta Sans', system-ui, sans-serif;
        --shadow-card:   0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
    }

    html, body { height: 100%; }
    body {
        font-family: var(--font-sans);
        background: var(--bg-main);
        color: var(--text-primary);
        display: flex;
    }

    /* =====================
       SIDEBAR
    ===================== */
    .sidebar {
        width: var(--sidebar-w);
        background: var(--bg-sidebar);
        height: 100vh;
        position: fixed;
        left: 0; top: 0;
        display: flex;
        flex-direction: column;
        z-index: 100;
        flex-shrink: 0;
    }

    .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 24px 20px 20px;
        border-bottom: 1px solid rgba(255,255,255,.08);
        text-decoration: none;
    }
    .sidebar-logo-icon {
        width: 34px; height: 34px;
        background: var(--blue-primary);
        border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; font-weight: 800; color: #fff;
        letter-spacing: -.5px;
    }
    .sidebar-logo-text {
        font-size: 16px; font-weight: 800;
        color: #fff; letter-spacing: -.3px;
    }

    .sidebar-nav {
        flex: 1;
        padding: 16px 12px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .nav-section-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .1em;
        color: rgba(255,255,255,.3);
        padding: 12px 8px 6px;
        text-transform: uppercase;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border-radius: 9px;
        color: rgba(255,255,255,.6);
        font-size: 13.5px;
        font-weight: 500;
        text-decoration: none;
        transition: background .15s, color .15s;
        cursor: pointer;
        border: none;
        background: transparent;
        width: 100%;
        font-family: var(--font-sans);
    }
    .nav-item svg { flex-shrink: 0; opacity: .7; }
    .nav-item:hover {
        background: var(--bg-sidebar-hover);
        color: #fff;
    }
    .nav-item:hover svg { opacity: 1; }
    .nav-item.active {
        background: var(--bg-sidebar-active);
        color: #fff;
        font-weight: 600;
    }
    .nav-item.active svg { opacity: 1; }

    .nav-item-badge {
        margin-left: auto;
        background: var(--blue-primary);
        color: #fff;
        font-size: 10px; font-weight: 700;
        padding: 2px 7px;
        border-radius: 99px;
    }

    .sidebar-footer {
        padding: 16px 12px;
        border-top: 1px solid rgba(255,255,255,.08);
    }
    .sidebar-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 9px;
        background: rgba(255,255,255,.05);
    }
    .sidebar-user-avatar {
        width: 32px; height: 32px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 700; color: #fff;
        flex-shrink: 0;
    }
    .sidebar-user-info { flex: 1; min-width: 0; }
    .sidebar-user-name {
        font-size: 13px; font-weight: 600; color: #fff;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .sidebar-user-role {
        font-size: 11px; color: rgba(255,255,255,.4);
    }

    /* =====================
       MAIN CONTENT
    ===================== */
    .main-content {
        margin-left: var(--sidebar-w);
        flex: 1;
        min-height: 100vh;
        overflow-y: auto;
    }

    /* =====================
       TOP BAR (within main)
    ===================== */
    .topbar {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(240,242,247,.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0,0,0,.05);
        padding: 12px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .topbar-breadcrumb {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--text-secondary);
    }
    .topbar-breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .topbar-breadcrumb a:hover { color: var(--blue-primary); }
    .topbar-breadcrumb .sep { opacity: .4; }
    .topbar-breadcrumb .current { color: var(--text-primary); font-weight: 600; }

    .topbar-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .topbar-btn-new {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--blue-primary);
        color: #fff;
        border: none;
        border-radius: 9px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        font-family: var(--font-sans);
        cursor: pointer;
        text-decoration: none;
        transition: background .15s;
    }
    .topbar-btn-new:hover { background: #1d4ed8; }

    /* =====================
       MOBILE SIDEBAR TOGGLE
    ===================== */
    .sidebar-toggle {
        display: none;
        position: fixed;
        top: 14px; left: 14px;
        z-index: 200;
        background: var(--bg-sidebar);
        border: none;
        border-radius: 9px;
        padding: 8px;
        cursor: pointer;
        color: #fff;
    }

    /* =====================
       FLASH MESSAGES
    ===================== */
    .flash-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #15803d;
        padding: 12px 16px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        margin: 0 24px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* =====================
       RESPONSIVE
    ===================== */
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform .25s ease;
        }
        .sidebar.open { transform: translateX(0); }
        .main-content { margin-left: 0; }
        .sidebar-toggle { display: flex; }
        .topbar { padding: 12px 16px 12px 52px; }
    }
    </style>

    @stack('styles')
</head>
<body>

    {{-- Mobile Sidebar Toggle --}}
    <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle menu">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
    </button>

    {{-- SIDEBAR --}}
    <aside class="sidebar" id="sidebar">
        <a href="{{ route('dashboard') }}" class="sidebar-logo">
            <div class="sidebar-logo-icon">P</div>
            <span class="sidebar-logo-text">Priorify</span>
        </a>

        <nav class="sidebar-nav">
            <span class="nav-section-label">Menu Utama</span>

            <a href="{{ route('dashboard') }}" class="nav-item {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Dashboard
            </a>

            <a href="{{ route('tasks.index') }}" class="nav-item {{ request()->routeIs('tasks.*') ? 'active' : '' }}">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Semua Tugas
                @if(($pendingCount ?? 0) > 0)
                    <span class="nav-item-badge">{{ $pendingCount }}</span>
                @endif
            </a>

            <a href="{{ route('matrix') }}" class="nav-item {{ request()->routeIs('matrix') ? 'active' : '' }}">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
                </svg>
                Eisenhower Matrix
            </a>

            <span class="nav-section-label" style="margin-top:8px;">Lainnya</span>

            <a href="{{ route('history') }}" class="nav-item {{ request()->routeIs('history') ? 'active' : '' }}">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Riwayat
            </a>

            <a href="{{ route('profile') }}" class="nav-item {{ request()->routeIs('profile') ? 'active' : '' }}">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Profil
            </a>
        </nav>

        <div class="sidebar-footer">
            <div class="sidebar-user">
                <div class="sidebar-user-avatar">
                    {{ strtoupper(substr(auth()->user()->name ?? 'P', 0, 1)) }}
                </div>
                <div class="sidebar-user-info">
                    <div class="sidebar-user-name">{{ auth()->user()->name ?? 'Puri Chandra' }}</div>
                    <div class="sidebar-user-role">Mahasiswa</div>
                </div>
            </div>
        </div>
    </aside>

    {{-- MAIN CONTENT --}}
    <main class="main-content">
        {{-- Top Bar --}}
        <div class="topbar">
            <div class="topbar-breadcrumb">
                <a href="{{ route('dashboard') }}">Dashboard</a>
                @hasSection('breadcrumb')
                    <span class="sep">/</span>
                    @yield('breadcrumb')
                @endif
            </div>
            <div class="topbar-actions">
                @unless(request()->routeIs('tasks.create'))
                <a href="{{ route('tasks.create') }}" class="topbar-btn-new">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
                    </svg>
                    Tugas Baru
                </a>
                @endunless
            </div>
        </div>

        {{-- Flash Messages --}}
        @if(session('success'))
            <div class="flash-success" style="margin-top:16px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ session('success') }}
            </div>
        @endif

        @yield('content')
    </main>

    <script>
    // Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggle  = document.getElementById('sidebarToggle');
    if (toggle) {
        toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
    </script>

    @stack('scripts')
</body>
</html>