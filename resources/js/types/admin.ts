// resources/js/types/admin.ts

export interface DashboardStats {
    totalUsers: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
    totalNotifs: number;
    fonnteToken: string | null;
}

export interface QuadrantData {
    [key: string]: number;
}

export interface StatusData {
    [key: string]: number;
}

export interface MatkulData {
    name: string;
    value: number;
}

export interface TrendData {
    labels: string[];
    values: number[];
}

export interface AvgProgressMatkul {
    mata_kuliah: string;
    avg_progress: number;
    total: number;
}

export interface RecentUser {
    id: number;
    name: string;
    email: string;
    whatsapp_number: string | null;
    created_at: string;
    tasks_count: number;
}

export interface UpcomingDeadline {
    id: number;
    user_id: number;
    nama_tugas: string;
    mata_kuliah: string;
    deadline: string;
    progress: number;
    quadrant: string | null;
    user: {
        id: number;
        name: string;
    };
}

export interface TopUser {
    id: number;
    name: string;
    email: string;
    tasks_count: number;
    completed_tasks_count: number;
}

export interface DashboardProps {
    stats: DashboardStats;
    quadrantData: QuadrantData;
    statusData: StatusData;
    taskPerMatkul: MatkulData[];
    trend: TrendData;
    avgProgressMatkul: AvgProgressMatkul[];
    notifStats: { [key: string]: number };
    recentUsers: RecentUser[];
    upcomingDeadlines: UpcomingDeadline[];
    topUsers: TopUser[];
}
