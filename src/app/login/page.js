import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-[#000000] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
            <span className="text-xl font-bold text-black">VB</span>
          </div>
          <h1 className="text-2xl font-bold text-white">VendorBridge</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procurement & Vendor Management ERP
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Login</h2>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
