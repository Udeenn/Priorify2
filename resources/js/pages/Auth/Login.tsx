import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <Head title="Log in" />

            <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Bagian Kiri: Visual & Branding (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-12 flex-col justify-between text-white relative">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-blue-600 font-black text-2xl uppercase">
                                    P
                                </span>
                            </div>
                            <span className="text-2xl font-black tracking-widest uppercase">
                                Priorify
                            </span>
                        </div>

                        <h2 className="text-4xl font-extrabold leading-[1.2] mb-6">
                            Taklukan Tugas <br /> Dengan Cerdas.
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                            Gunakan metode Eisenhower Matrix untuk mengelola
                            prioritas akademikmu secara otomatis.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm font-medium text-blue-200">
                        &copy; 2026 Tim Informatika UMS
                    </div>
                </div>

                {/* Bagian Kanan: Form Login */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    {/* Header Form */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Selamat Datang
                        </h1>
                        <p className="text-slate-500">
                            Silakan login menggunakan akun mahasiswa Anda.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm font-medium">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Input Email */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Institusi"
                                className="text-slate-700 mb-1.5"
                            />
                            <div className="relative group">
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 transition-all duration-200 py-3"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="nama@student.ums.ac.id"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-2 text-sm"
                            />
                        </div>

                        {/* Input Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-slate-700"
                                />
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Lupa Password?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 transition-all duration-200 py-3"
                                autoComplete="current-password"
                                placeholder="Masukkan password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2 text-sm"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-slate-600">
                                Tetap masuk di perangkat ini
                            </span>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <PrimaryButton
                                className="w-full flex justify-center py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-base font-bold shadow-lg shadow-blue-100 transition-all duration-300 transform active:scale-[0.98]"
                                disabled={processing}
                            >
                                {processing
                                    ? "Memproses..."
                                    : "Masuk ke Dashboard"}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Footer Auth */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-500">
                            Belum terdaftar?{" "}
                            <Link
                                href={route("register")}
                                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Buat Akun Baru
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
