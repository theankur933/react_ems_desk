import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ArrowRight,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const result = login(email.trim(), password);
    if (result.ok) navigate("/dashboard");
    else setError(result.message);
  };
  return (
    <main className="login-page">
      <section className="login-aside">
        <div className="login-brand">
          <span className="brand-mark">
            <BriefcaseBusiness size={20} />
          </span>
          EMS Desk
        </div>
        <div className="login-promo">
          <span className="eyebrow">PEOPLE FIRST. ALWAYS.</span>
          <h1>A better way to manage your people.</h1>
          <p>
            Bring your team, tasks and everyday work together in one thoughtful
            workspace.
          </p>
          <div className="promo-points">
            <span>
              <Users size={17} /> One clear view of your team
            </span>
            <span>
              <ShieldCheck size={17} /> Simple, organized workflows
            </span>
          </div>
        </div>
        <div className="login-aside-foot">
          © 2026 EMS Desk. Built for better work.
        </div>
      </section>
      <section className="login-main">
        <div className="login-form-wrap">
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="muted">Enter your details to access your workspace.</p>
          <form onSubmit={submit} className="form-stack">
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="button button-primary button-full" type="submit">
              Sign in <ArrowRight size={17} />
            </button>
          </form>
          <div className="demo-box">
            <strong>Demo access</strong>
            <p>
              <b>Admin:</b> admin@peopledesk.com / admin123
            </p>
            <p>
              <b>Employee:</b> olivia@company.com / 123456
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
