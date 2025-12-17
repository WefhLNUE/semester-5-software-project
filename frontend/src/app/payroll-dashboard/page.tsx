"use client";

import Link from "next/link";
import { Settings, Play, History, ChevronRight, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function PayrollDashboard() {
    const cards = [
        {
            title: "Configuration",
            description: "Setup and manage taxes, insurance brackets, benefits, and global payroll rules.",
            icon: <Settings size={32} />,
            href: "/payroll-configuration",
            colorVar: "var(--primary-600)",
            bgVar: "var(--primary-100)",
            action: "Configure Rules"
        },
        {
            title: "Execution",
            description: "Initiate payroll runs, manage approvals, generate payslips, and finalize payments.",
            icon: <Play size={32} fill="currentColor" />,
            href: "/payroll-execution",
            colorVar: "var(--primary-600)",
            bgVar: "var(--primary-100)",
            action: "Run Payroll"
        },
        {
            title: "Tracking",
            description: "Monitor payment history, manage refunds, and view detailed analytical reports.",
            icon: <History size={32} />,
            href: "/payroll-tracking",
            colorVar: "var(--primary-600)",
            bgVar: "var(--primary-100)",
            action: "Track Payments"
        }
    ];

    return (
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <div className="animate-fade-in" style={{ marginBottom: "4rem", textAlign: "center" }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "4rem", height: "4rem", borderRadius: "1rem",
                    background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
                    color: "white", marginBottom: "1.5rem", boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.4)"
                }}>
                    <LayoutDashboard size={32} />
                </div>
                <h1 style={{
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: "1rem"
                }}>
                    Payroll Management
                </h1>
                <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
                    Centralized hub for managing your organization's financial operations, from configuration to final execution.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
                {cards.map((card, index) => (
                    <Link key={card.title} href={card.href} style={{ textDecoration: "none" }}>
                        <div className="card hover-lift animate-slide-up" style={{
                            height: "100%",
                            padding: "2.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                            cursor: "pointer",
                            background: "white",
                            border: "1px solid var(--border-light)",
                            borderRadius: "1.5rem",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            position: "relative",
                            overflow: "hidden",
                            animationDelay: `${index * 0.1}s`
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                                e.currentTarget.style.borderColor = "var(--primary-200)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                                e.currentTarget.style.borderColor = "var(--border-light)";
                            }}
                        >

                            <div style={{
                                width: "4rem", height: "4rem",
                                borderRadius: "1rem",
                                background: card.bgVar,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: card.colorVar,
                                fontSize: "1.5rem"
                            }}>
                                {card.icon}
                            </div>

                            <div>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                                    {card.title}
                                </h2>
                                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "1rem" }}>
                                    {card.description}
                                </p>
                            </div>

                            <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
                                <span className="btn-click-effect" style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    color: card.colorVar,
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    padding: "0.5rem 1rem",
                                    background: "var(--bg-secondary)",
                                    borderRadius: "0.5rem",
                                    transition: "background 0.2s"
                                }}>
                                    {card.action} <ChevronRight size={16} strokeWidth={3} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
