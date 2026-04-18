import Link from "next/link"
import { BookOpen, FileText, Users, CheckCircle, Sparkles, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* ─── Navigation ────────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduTask</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 to-transparent opacity-50" />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">Meet the Future of Education</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8 text-white text-balance">
            Modern Assignment
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
              Management
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12">
            A complete platform for creating courses, posting assignments, and managing submissions.
            Built for precision and performance in education.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors h-12"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl border border-slate-700 transition-colors h-12"
            >
              Watch Demo
            </Link>
          </div>

          {/* Hero visual - Dashboard preview mockup */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-2xl blur-3xl" />
            <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-transparent" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-700 rounded w-48" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-slate-700 rounded w-8" />
                    <div className="h-3 bg-slate-700 rounded w-8" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-slate-700/50" />
                  <div className="h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-slate-700/50" />
                </div>
                <div className="h-20 bg-slate-800/50 rounded-lg border border-slate-700/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ───────────────────────────────────────────────── */}
      <section className="py-20 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "99.9%", label: "Uptime Reliability" },
              { value: "1.2M", label: "Active Learners" },
              { value: "250+", label: "Institutions" },
              { value: "12ms", label: "Avg. Response" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Precision Engineering for Education
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Designed for instructors and students who demand performance and simplicity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="group rounded-xl border border-slate-700 bg-slate-900/50 p-8 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Create Courses</h3>
              <p className="text-slate-400">
                Set up courses with unique codes and detailed descriptions. Manage everything from one intuitive dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-xl border border-slate-700 bg-slate-900/50 p-8 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Post Assignments</h3>
              <p className="text-slate-400">
                Create assignments with due dates and point values. Track submissions and provide feedback instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-xl border border-slate-700 bg-slate-900/50 p-8 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Grade Work</h3>
              <p className="text-slate-400">
                Intelligent grading system that provides detailed feedback. Reduce grading time by up to 80%.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-xl border border-slate-700 bg-slate-900/50 p-8 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Instant Submissions</h3>
              <p className="text-slate-400">
                Secure submission system with version history. Students always know their status in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to transform your classroom?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join thousands of institutions modernizing their assignment management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Deploy Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl border border-slate-700 transition-colors"
            >
              Request Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
                <span className="font-bold text-white">EduTask</span>
              </div>
              <p className="text-sm text-slate-400">Modern assignment management platform for education.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex items-center justify-between">
            <p className="text-sm text-slate-400">© 2026 EduTask. House of Edtech Assignment.</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-300">Parth Patak</span>
              <a
                href="https://github.com/parthpathakpp29"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/parth-pathak-69626b249/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
