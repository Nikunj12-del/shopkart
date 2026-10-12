import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="relative overflow-hidden">

        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="absolute top-96 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10">

          <section className="mb-10">

            <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-7 sm:p-10 shadow-2xl">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

                <div>

                  <p className="text-blue-100 font-medium mb-2">
                    Welcome back 👋
                  </p>

                  <h1 className="text-3xl sm:text-4xl font-bold">
                    Hey, {user?.fullName}!
                  </h1>

                  <p className="text-blue-100 mt-3 max-w-xl">
                    Your ShopKart dashboard is ready.
                    Manage your account and enjoy your shopping experience.
                  </p>

                </div>

                <div className="shrink-0">

                  <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-lg border border-white/20 flex items-center justify-center text-4xl font-bold shadow-xl">

                    {user?.fullName
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </div>

                </div>

              </div>

            </div>

          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-400 text-sm">
                    Account Status
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    Active
                  </h3>

                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                  ✓
                </div>

              </div>

              <p className="text-emerald-400 text-sm mt-4">
                Your account is secure
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-400 text-sm">
                    Security
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    Protected
                  </h3>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                  🔐
                </div>

              </div>

              <p className="text-blue-400 text-sm mt-4">
                Authentication enabled
              </p>

            </div>

            {/* SHOPPING CARD */}

            <div
              onClick={() => navigate("/products")}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 hover:border-violet-500/40 hover:-translate-y-1 transition duration-300 cursor-pointer"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-400 text-sm">
                    Shopping
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    Ready
                  </h3>

                </div>

                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-2xl">
                  🛍️
                </div>

              </div>

              <p className="text-violet-400 text-sm mt-4">
                Start exploring products →
              </p>

            </div>

          </section>

          <section className="grid lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl">

              <div className="flex items-center gap-4 mb-7">

                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold">

                  {user?.fullName
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Profile Information
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Your registered account details
                  </p>

                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-5">

                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    Full Name
                  </p>

                  <p className="font-semibold mt-2 text-lg">
                    {user?.fullName}
                  </p>

                </div>

                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-5">

                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    Email Address
                  </p>

                  <p className="font-semibold mt-2 break-all">
                    {user?.email}
                  </p>

                </div>

                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-5">

                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    Phone Number
                  </p>

                  <p className="font-semibold mt-2 text-lg">
                    {user?.phone}
                  </p>

                </div>

                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-5">

                  <p className="text-slate-500 text-xs uppercase tracking-wider">
                    Authentication
                  </p>

                  <div className="flex items-center gap-2 mt-3">

                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>

                    <p className="font-semibold text-emerald-400">
                      Authenticated
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl">

              <h2 className="text-xl font-bold">
                Quick Actions
              </h2>

              <p className="text-slate-400 text-sm mt-1 mb-6">
                Manage your ShopKart experience
              </p>

              <div className="space-y-3">

                <button
                  onClick={() => navigate("/products")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition text-left"
                >

                  <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                    🛍️
                  </span>

                  <div>

                    <p className="font-semibold">
                      Browse Shop
                    </p>

                    <p className="text-xs text-blue-100">
                      Explore products
                    </p>

                  </div>

                </button>

                <button
                  onClick={() => setShowProfile(true)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left"
                >

                  <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                    👤
                  </span>

                  <div>

                    <p className="font-semibold">
                      My Profile
                    </p>

                    <p className="text-xs text-slate-400">
                      View your information
                    </p>

                  </div>

                </button>

                <button
                  onClick={() =>
                    alert(
                      "Your account is protected with secure authentication 🔐"
                    )
                  }
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left"
                >

                  <span className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">
                    🔒
                  </span>

                  <div>

                    <p className="font-semibold">
                      Security
                    </p>

                    <p className="text-xs text-slate-400">
                      Account protection
                    </p>

                  </div>

                </button>

              </div>

            </div>

          </section>

          <footer className="text-center mt-12 pb-4">

            <p className="text-slate-500 text-sm">
              🛍️ ShopKart • Shop smarter. Live better.
            </p>

          </footer>

        </div>

      </main>

      {showProfile && (

        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowProfile(false)}
        >

          <div
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between mb-7">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold">

                  {user?.fullName
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    My Profile
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Account information
                  </p>

                </div>

              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <div className="bg-slate-800/70 rounded-2xl p-4">

                <p className="text-slate-500 text-xs uppercase tracking-wider">
                  Full Name
                </p>

                <p className="font-semibold mt-1">
                  {user?.fullName}
                </p>

              </div>

              <div className="bg-slate-800/70 rounded-2xl p-4">

                <p className="text-slate-500 text-xs uppercase tracking-wider">
                  Email Address
                </p>

                <p className="font-semibold mt-1 break-all">
                  {user?.email}
                </p>

              </div>

              <div className="bg-slate-800/70 rounded-2xl p-4">

                <p className="text-slate-500 text-xs uppercase tracking-wider">
                  Phone Number
                </p>

                <p className="font-semibold mt-1">
                  {user?.phone}
                </p>

              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>

                  <p className="font-semibold text-emerald-400">
                    Account Authenticated
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;