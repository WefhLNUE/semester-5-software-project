import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 600px at 15% 10%, rgba(59,130,246,0.20), transparent 60%), radial-gradient(800px 500px at 85% 20%, rgba(34,197,94,0.18), transparent 55%), radial-gradient(700px 600px at 50% 100%, rgba(99,102,241,0.14), transparent 60%)",
        }}
      />

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--primary-600)" }} />
              All-in-one HR System
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Run HR operations with clarity, speed, and confidence.
            </h1>

            <p
              className="max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Manage employee profiles, recruitment, leaves, payroll, performance, and time tracking in one
              consistent experience.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/employee-profile" className="btn-primary">
                Get started
              </Link>
              <Link href="/recruitment" className="btn-secondary">
                Explore recruitment
              </Link>
            </div>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              <div className="card p-4">
                <div className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  Secure & structured
                </div>
                <div className="mt-1 text-sm font-semibold">Role-based modules</div>
              </div>
              <div className="card p-4">
                <div className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  Clear workflows
                </div>
                <div className="mt-1 text-sm font-semibold">Approvals and tracking</div>
              </div>
              <div className="card p-4">
                <div className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  Modern UI
                </div>
                <div className="mt-1 text-sm font-semibold">Fast, responsive pages</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="stat-card">
              <div className="text-xs font-semibold opacity-90">Employee profiles</div>
              <div className="mt-2 text-2xl font-semibold">Centralized data</div>
              <div className="mt-2 text-sm opacity-90">Keep everything from contact info to history in one place.</div>
            </div>

            <div className="stat-card stat-card-success">
              <div className="text-xs font-semibold opacity-90">Leave management</div>
              <div className="mt-2 text-2xl font-semibold">Fewer errors</div>
              <div className="mt-2 text-sm opacity-90">Track balances and requests with clear statuses.</div>
            </div>

            <div className="stat-card stat-card-warning sm:col-span-2">
              <div className="text-xs font-semibold opacity-90">Recruitment pipeline</div>
              <div className="mt-2 text-2xl font-semibold">From opening to hire</div>
              <div className="mt-2 text-sm opacity-90">
                Keep candidates organized, move faster, and maintain visibility across stages.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div
          className="grid gap-4 rounded-2xl border p-6 sm:grid-cols-3"
          style={{
            borderColor: "var(--border-light)",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(10px)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="space-y-2">
            <div className="text-sm font-semibold" style={{ color: "var(--employee-profile)" }}>
              Employee Profile
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Manage employee records with clean, consistent data.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold" style={{ color: "var(--leaves)" }}>
              Leaves
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Requests, approvals, balances, and statuses in one flow.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold" style={{ color: "var(--recruitment)" }}>
              Recruitment
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Create openings, track candidates, and move efficiently.
            </div>
          </div>
        </div>
      </section>

      <footer
        className="border-t"
        style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-primary)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} HR System
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/" style={{ color: "var(--text-link)" }}>
              Home
            </Link>
            <Link href="/employee-profile" style={{ color: "var(--text-link)" }}>
              Employee Profile
            </Link>
            <Link href="/recruitment" style={{ color: "var(--text-link)" }}>
              Recruitment
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
