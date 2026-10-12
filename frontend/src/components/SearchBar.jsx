const SearchBar = ({
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort
}) => {

    return (
        <div className="relative">

            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>

            <div className="relative bg-slate-950/80 border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl">

                <div className="flex flex-col lg:flex-row gap-3">

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                            🔍
                        </div>

                        <input
                            type="text"
                            placeholder="Search products, categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-14 bg-white/[0.04] border border-white/10 rounded-2xl pl-14 pr-5 text-white placeholder-slate-500 outline-none focus:border-blue-500/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                        />

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 border border-white/10 rounded-md px-2 py-1">
                                SEARCH
                            </span>
                        </div>

                    </div>

                    {/* CATEGORY */}

                    <div className="relative lg:w-56">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-lg pointer-events-none">
                            ◈
                        </span>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="appearance-none w-full h-14 bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-10 text-white outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 cursor-pointer"
                        >
                            <option value="" className="bg-slate-950">
                                All Categories
                            </option>

                            <option value="Electronics" className="bg-slate-950">
                                Electronics
                            </option>

                            <option value="Clothing" className="bg-slate-950">
                                Clothing
                            </option>

                            <option value="Books" className="bg-slate-950">
                                Books
                            </option>

                            <option value="Home" className="bg-slate-950">
                                Home
                            </option>

                            <option value="Other" className="bg-slate-950">
                                Other
                            </option>

                        </select>

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            ↓
                        </span>

                    </div>

                    {/* SORT */}

                    <div className="relative lg:w-56">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-lg pointer-events-none">
                            ◉
                        </span>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none w-full h-14 bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-10 text-white outline-none focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300 cursor-pointer"
                        >

                            <option value="featured" className="bg-slate-950">
                                ⭐ Featured
                            </option>

                            <option value="low" className="bg-slate-950">
                                💰 Price: Low to High
                            </option>

                            <option value="high" className="bg-slate-950">
                                💎 Price: High to Low
                            </option>

                            <option value="newest" className="bg-slate-950">
                                🆕 Newest
                            </option>

                        </select>

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            ↓
                        </span>

                    </div>

                </div>

                {/* QUICK CATEGORIES */}

                <div className="flex flex-wrap items-center gap-2 mt-4">

                    <span className="text-xs uppercase tracking-wider text-slate-600 mr-1">
                        Quick:
                    </span>

                    <button
                        onClick={() => setCategory("")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                            category === ""
                                ? "bg-white text-slate-900 border-white"
                                : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setCategory("Electronics")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                            category === "Electronics"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-blue-500/10 hover:text-blue-300"
                        }`}
                    >
                        ⚡ Electronics
                    </button>

                    <button
                        onClick={() => setCategory("Clothing")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                            category === "Clothing"
                                ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                                : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-pink-500/10 hover:text-pink-300"
                        }`}
                    >
                        👕 Clothing
                    </button>

                    <button
                        onClick={() => setCategory("Books")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                            category === "Books"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-amber-500/10 hover:text-amber-300"
                        }`}
                    >
                        📚 Books
                    </button>

                    <button
                        onClick={() => setCategory("Home")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                            category === "Home"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-emerald-500/10 hover:text-emerald-300"
                        }`}
                    >
                        🏠 Home
                    </button>

                    <button
                        onClick={() => setCategory("Other")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                            category === "Other"
                                ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                                : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-violet-500/10 hover:text-violet-300"
                        }`}
                    >
                        ✦ Other
                    </button>

                </div>

            </div>

        </div>
    );
};

export default SearchBar;