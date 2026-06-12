import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        whatsapp_number: "", // Tambahan untuk fitur notifikasi Fonnte
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <Head title="Register" />

            <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                {/* Bagian Kiri: Visual & Branding */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-12 flex-col justify-between text-white relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="flex items-center gap-3 mb-12"
                        >
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-blue-600 font-black text-xl uppercase">
                                    P
                                </span>
                            </div>
                            <span className="text-xl font-black tracking-widest uppercase">
                                Priorify
                            </span>
                        </Link>

                        <h2 className="text-4xl font-extrabold leading-[1.2] mb-6">
                            Langkah Awal <br /> Menuju Produktivitas.
                        </h2>
                        <ul className="space-y-4 text-blue-100 font-medium">
                            <li className="flex items-center gap-3">
                                <span className="p-1 bg-blue-400/30 rounded-full">
                                    ✓
                                </span>
                                Matriks Eisenhower Otomatis
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="p-1 bg-blue-400/30 rounded-full">
                                    ✓
                                </span>
                                Pengingat WhatsApp Real-time
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="p-1 bg-blue-400/30 rounded-full">
                                    ✓
                                </span>
                                Breakdown Tugas Terperinci
                            </li>
                        </ul>
                    </div>

                    <div className="relative z-10 text-sm text-blue-200">
                        Bergabunglah dengan ratusan mahasiswa UMS lainnya.
                    </div>
                </div>

                {/* Bagian Kanan: Form Register */}
                <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Buat Akun Baru
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Daftarkan diri Anda untuk mulai mengelola tugas
                            dengan cerdas.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                        {/* Nama Lengkap */}
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="name"
                                value="Nama Lengkap"
                                className="text-slate-700"
                            />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1.5 block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 py-3"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                                placeholder="Masukkan nama lengkap"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Institusi"
                                className="text-slate-700"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1.5 block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 py-3 text-sm"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                                placeholder="nim@student.ums.ac.id"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* Nomor WhatsApp */}
                        <div>
                            <InputLabel
                                htmlFor="whatsapp_number"
                                value="Nomor WhatsApp"
                                className="text-slate-700"
                            />
                            <TextInput
                                id="whatsapp_number"
                                type="text"
                                name="whatsapp_number"
                                value={data.whatsapp_number}
                                className="mt-1.5 block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 py-3 text-sm"
                                onChange={(e) =>
                                    setData("whatsapp_number", e.target.value)
                                }
                                required
                                placeholder="0812XXXXXXXX"
                            />
                            <InputError
                                message={errors.whatsapp_number}
                                className="mt-2"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-slate-700"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1.5 block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 py-3 text-sm"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                                placeholder="Minimal 8 karakter"
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Konfirmasi Password"
                                className="text-slate-700"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1.5 block w-full border-slate-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-200 py-3 text-sm"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                required
                                placeholder="Ulangi password"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <PrimaryButton
                                className="w-full flex justify-center py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-base font-bold shadow-lg shadow-blue-100 transition-all duration-300 transform active:scale-[0.98]"
                                disabled={processing}
                            >
                                {processing
                                    ? "Mendaftarkan Akun..."
                                    : "Daftar Sekarang"}
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        Sudah punya akun?{" "}
                        <Link
                            href={route("login")}
                            className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Log in di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
