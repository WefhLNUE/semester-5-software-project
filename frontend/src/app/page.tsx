import Link from "next/link";
export default function Home() {
  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -10,
          background:
            "radial-gradient(1000px 600px at 15% 10%, rgba(59,130,246,0.20), transparent 60%), radial-gradient(800px 500px at 85% 20%, rgba(34,197,94,0.18), transparent 55%), radial-gradient(700px 600px at 50% 100%, rgba(99,102,241,0.14), transparent 60%)",
        }}
      />

      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            padding: "3.5rem 1.5rem",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                borderWidth: "1px",
                borderStyle: "solid",
                padding: "0.25rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "9999px",
                  backgroundColor: "var(--primary-600)",
                }}
              />
              All-in-one HR System
            </div>

            <h1 style={{ fontSize: "2.5rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Run HR operations with clarity, speed, and confidence.
            </h1>

            <p
              style={{
                maxWidth: "36rem",
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
              }}
            >
              Manage employee profiles, recruitment, leaves, payroll, performance, and time tracking in one
              consistent experience.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
              <Link href="/employee-profile" className="btn-primary">
                Get started
              </Link>
              <Link href="/recruitment" className="btn-secondary">
                Explore recruitment
              </Link>
              <Link href="/performance" className="btn-secondary">
                Performance Management
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem",
                paddingTop: "1rem",
              }}
            >
              <div className="card" style={{ padding: "1rem" }}>
                <div style={{ color: "var(--text-tertiary)", fontSize: "0.75rem", fontWeight: 600 }}>
                  Secure & structured
                </div>
                <div style={{ marginTop: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
                  Role-based modules
                </div>
              </div>
              <div className="card" style={{ padding: "1rem" }}>
                <div style={{ color: "var(--text-tertiary)", fontSize: "0.75rem", fontWeight: 600 }}>
                  Clear workflows
                </div>
                <div style={{ marginTop: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
                  Approvals and tracking
                </div>
              </div>
              <div className="card" style={{ padding: "1rem" }}>
                <div style={{ color: "var(--text-tertiary)", fontSize: "0.75rem", fontWeight: 600 }}>
                  Modern UI
                </div>
                <div style={{ marginTop: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
                  Fast, responsive pages
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            <div className="stat-card">
              <div style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.9 }}>Employee profiles</div>
              <div style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 600 }}>Centralized data</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", opacity: 0.9 }}>
                Keep everything from contact info to history in one place.
              </div>
            </div>

            <div className="stat-card stat-card-success">
              <div style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.9 }}>Leave management</div>
              <div style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 600 }}>Fewer errors</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", opacity: 0.9 }}>
                Track balances and requests with clear statuses.
              </div>
            </div>

            <div className="stat-card stat-card-warning" style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.9 }}>Recruitment pipeline</div>
              <div style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 600 }}>From opening to hire</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", opacity: 0.9 }}>
                Keep candidates organized, move faster, and maintain visibility across stages.
              </div>
            </div>

            <div className="stat-card" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", borderColor: "rgba(99, 102, 241, 0.2)", gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.9 }}>Performance Management</div>
              <div style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 600 }}>Fair evaluations</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", opacity: 0.9 }}>
                Structured appraisals, manager reviews, and transparent feedback cycles.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem 2.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            borderRadius: "1rem",
            borderWidth: "1px",
            borderStyle: "solid",
            padding: "1.5rem",
            borderColor: "var(--border-light)",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(10px)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ color: "var(--employee-profile)", fontSize: "0.875rem", fontWeight: 600 }}>
              Employee Profile
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Manage employee records with clean, consistent data.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ color: "var(--leaves)", fontSize: "0.875rem", fontWeight: 600 }}>
              Leaves
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Requests, approvals, balances, and statuses in one flow.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ color: "var(--recruitment)", fontSize: "0.875rem", fontWeight: 600 }}>
              Recruitment
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Create openings, track candidates, and move efficiently.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ color: "var(--performance)", fontSize: "0.875rem", fontWeight: 600 }}>
              Performance
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Templates, cycles, evaluations, and dispute resolution.
            </div>
          </div>
        </div>
      </section>
      <footer
        style={{
          borderTop: "1px solid var(--border-light)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            padding: "2rem 1.5rem",
          }}
        >
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            © {new Date().getFullYear()} HR System
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.875rem",
            }}
          >
            <Link href="/" style={{ color: "var(--text-link)" }}>
              Home
            </Link>
            <Link href="/employee-profile" style={{ color: "var(--text-link)" }}>
              Employee Profile
            </Link>
            <Link href="/recruitment" style={{ color: "var(--text-link)" }}>
              Recruitment
            </Link>
            <Link href="/performance" style={{ color: "var(--text-link)" }}>
              Performance
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
