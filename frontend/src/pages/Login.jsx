import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/customers/login", {
        email: form.email,
        password: form.password,
      });

      const user = await refreshUser();
      if (!user) {
        setApiError(
          "Login succeeded, but ShopKart could not verify your session. Please check your connection and try again."
        );
        return;
      }

      navigate("/home");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Unable to connect to ShopKart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-4 py-10">

      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />

      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />

      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Main Card */}
      <div className="relative w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">

          <div>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">

              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl">
                🛍️
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  ShopKart
                </h1>

                <p className="text-blue-100 text-xs">
                  SHOP • DISCOVER • ENJOY
                </p>
              </div>

            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Welcome
              <br />
              back.
            </h2>

            <p className="mt-6 text-blue-100 leading-relaxed max-w-sm">
              Your favorite products are waiting for you.
              Login and continue your shopping journey.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  🔐
                </div>

                <div>
                  <p className="font-semibold">
                    Secure Login
                  </p>

                  <p className="text-sm text-blue-100">
                    Your account is protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  ⚡
                </div>

                <div>
                  <p className="font-semibold">
                    Quick Access
                  </p>

                  <p className="text-sm text-blue-100">
                    Get back to shopping instantly
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  ❤️
                </div>

                <div>
                  <p className="font-semibold">
                    Everything You Love
                  </p>

                  <p className="text-sm text-blue-100">
                    Your shopping world in one place
                  </p>
                </div>
              </div>

            </div>

          </div>

          <p className="text-sm text-blue-200">
            © 2026 ShopKart. All rights reserved.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-8 sm:p-10 md:p-12">

          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">

            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              🛍️
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              ShopKart
            </h1>

          </div>

          {/* Heading */}
          <div className="mb-8">

            <p className="text-blue-600 font-semibold text-sm mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Login to your account
            </h2>

            <p className="text-slate-500 mt-2">
              Enter your details to continue.
            </p>

          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all text-slate-800 placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />

              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all text-slate-800 placeholder:text-slate-400 ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password}
                </p>
              )}

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span>
                  Logging in...
                </span>
              ) : (
                "Login →"
              )}
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-7">

            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-bold text-blue-600 hover:text-indigo-600 transition"
              >
                Create Account
              </Link>
            </p>

          </div>

          {/* Security */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            🔒 Secure authentication powered by ShopKart
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;