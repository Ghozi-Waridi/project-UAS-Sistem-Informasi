import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { isAuthenticated, getCurrentUser } from "../../services/authService";
import {
  FaRocket, FaGlobe, FaShieldAlt, FaClock, FaCheckCircle,
  FaPlay, FaArrowRight, FaStar, FaUsers, FaServer, FaHeadset
} from "react-icons/fa";

// Helper component for scroll animations
const RevealOnScroll = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } ${className}`}
    >
      {children}
    </div>
  );
};

export default function Beranda() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else if (user?.role === 'dm') {
        navigate('/dm/dashboard');
      }
    }

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
      
      {/* TopNav for Landing Page */}
      <TopNav />

      {/* Dynamic Background Gradient Follower */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 80%)`
        }}
      />



      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-[100px] animate-pulse -z-10" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/40 rounded-full blur-[100px] animate-pulse -z-10" style={{ animationDuration: '6s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left z-10">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8 hover:bg-blue-100 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Platform Travel #1 di Indonesia
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="delay-100">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900">
                Revolusi Bisnis <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient-x">
                  Travel Modern
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll className="delay-200">
              <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Tingkatkan efisiensi operasional dengan sistem distribusi global yang terintegrasi. Akses real-time ke inventori hotel, penerbangan, dan layanan travel lainnya dalam satu platform cerdas.
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="delay-300">
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/login")}
                  className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    Mulai Sekarang <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="px-8 py-4 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <FaPlay className="text-xs ml-0.5" />
                  </div>
                  Lihat Demo
                </button>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="delay-400">
              <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-cyan-500" /> 14 Hari Trial Gratis
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-cyan-500" /> Tanpa Kartu Kredit
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-cyan-500" /> Setup Instan
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            <RevealOnScroll className="w-full flex justify-center">
              <div className="relative w-full max-w-lg aspect-square group">
                {/* Abstract Tech Visual */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200 to-purple-200 rounded-full blur-3xl animate-pulse-slow opacity-60" />

                {/* Main Dashboard Card */}
                <div className="relative z-10 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-2xl shadow-slate-200/50 transform transition-all duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6 group-hover:scale-105">
                  {/* Fake UI Header */}
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] text-slate-500 font-mono">dashboard.gdsspro.com</div>
                  </div>

                  {/* Fake UI Content */}
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
                        <div className="text-xs text-cyan-600 mb-1">Total Revenue</div>
                        <div className="text-2xl font-bold text-slate-800">$124,500</div>
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <span className="bg-green-100 px-1 rounded">▲ 12%</span> vs last month
                        </div>
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs text-slate-500 mb-1">Active Bookings</div>
                        <div className="text-2xl font-bold text-slate-800">1,420</div>
                      </div>
                    </div>

                    <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyan-100/50 to-transparent" />
                      <div className="flex items-end justify-between h-full gap-2 px-2 pb-2">
                        {[40, 70, 45, 90, 65, 85, 50, 75, 60].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="w-full bg-cyan-400 rounded-t-sm hover:bg-cyan-500 transition-colors" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                            <div>
                              <div className="text-sm font-medium text-slate-800">New Booking #{2040 + i}</div>
                              <div className="text-xs text-slate-500">2 mins ago</div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-green-600">+$350</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -right-8 top-20 bg-white border border-slate-100 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-float" style={{ animationDelay: '0s' }}>
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                      <FaGlobe />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Global Reach</div>
                      <div className="font-bold text-slate-800">150+ Countries</div>
                    </div>
                  </div>

                  <div className="absolute -left-6 bottom-32 bg-white border border-slate-100 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                      <FaRocket />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Performance</div>
                      <div className="font-bold text-slate-800">Fast & Secure</div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FaUsers, val: "500+", label: "Travel Agent" },
              { icon: FaRocket, val: "1M+", label: "Transaksi Harian" },
              { icon: FaServer, val: "99.9%", label: "Uptime Server" },
              { icon: FaHeadset, val: "24/7", label: "Customer Support" },
            ].map((stat, idx) => (
              <RevealOnScroll key={idx} className={`delay-${idx * 100}`}>
                <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-white text-cyan-500 shadow-sm group-hover:bg-cyan-500 group-hover:text-white transition-colors border border-slate-100">
                    <stat.icon className="text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{stat.val}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="fitur" className="py-24 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
                Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Komprehensif</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Satu platform untuk semua kebutuhan bisnis travel Anda. Terintegrasi, cepat, dan aman.
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Flight Booking System", icon: <FaRocket />, desc: "Akses inventori penerbangan global dengan harga kompetitif dan real-time availability." },
              { title: "Hotel Reservation", icon: <FaGlobe />, desc: "Jaringan hotel luas di seluruh dunia dengan konfirmasi instan dan harga terbaik." },
              { title: "Secure Payment", icon: <FaShieldAlt />, desc: "Sistem pembayaran aman dengan enkripsi tingkat tinggi dan berbagai metode transaksi." },
              { title: "Real-time Analytics", icon: <FaClock />, desc: "Pantau performa bisnis Anda dengan dashboard analitik data real-time yang komprehensif." },
              { title: "24/7 Support", icon: <FaCheckCircle />, desc: "Tim support profesional kami siap membantu kendala teknis Anda kapan saja." },
              { title: "API Integration", icon: <FaServer />, desc: "Dokumentasi API lengkap dan mudah diintegrasikan dengan sistem yang sudah ada." },
            ].map((item, idx) => (
              <RevealOnScroll key={idx} className={`delay-${idx * 100}`}>
                <div className="group relative p-8 bg-white border border-slate-100 rounded-3xl hover:border-cyan-100 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <div className="text-9xl text-cyan-500 rotate-12">{item.icon}</div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl flex items-center justify-center text-2xl text-cyan-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-cyan-100">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-cyan-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {item.desc}
                    </p>
                    <a href="#" className="inline-flex items-center text-cyan-600 text-sm font-bold hover:text-cyan-500 transition-colors group/link">
                      Pelajari lebih lanjut
                      <FaArrowRight className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section id="keunggulan" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          <RevealOnScroll>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
                  alt="Team working"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs text-slate-600 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">
                        +2k
                      </div>
                    </div>
                    <div className="text-white font-medium">
                      <div className="text-sm opacity-90">Dipercaya oleh</div>
                      <div className="text-lg font-bold">2,000+ Partner</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <div>
            <RevealOnScroll>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-slate-900">
                Mengapa Memilih <br /> <span className="text-cyan-600">GDSS Pro?</span>
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                Kami menggabungkan teknologi terkini dengan pemahaman mendalam tentang industri travel untuk memberikan solusi yang benar-benar bekerja untuk pertumbuhan bisnis Anda.
              </p>
            </RevealOnScroll>

            <div className="space-y-8">
              {[
                { title: "Teknologi Cloud Native", desc: "Infrastruktur yang scalable dan reliable, menjamin uptime 99.9% untuk bisnis Anda." },
                { title: "Keamanan Enterprise", desc: "Standar keamanan ISO 27001 dengan enkripsi end-to-end untuk melindungi data sensitif." },
                { title: "Ekosistem Terbuka", desc: "API yang fleksibel memungkinkan koneksi tanpa batas dengan ratusan supplier global." }
              ].map((item, idx) => (
                <RevealOnScroll key={idx} className={`delay-${idx * 100}`}>
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-blue-100 group-hover:scale-110 shadow-sm">
                      <span className="font-bold text-xl">{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimoni" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Kata Mereka Tentang <span className="text-cyan-600">Kami</span></h2>
              <p className="text-slate-600">Bergabung dengan ribuan partner yang puas</p>
            </RevealOnScroll>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Budi Santoso", role: "CEO, Nusantara Travel", text: "Sistem yang luar biasa! Revenue kami meningkat 200% sejak menggunakan GDSS Pro. Sangat direkomendasikan." },
              { name: "Sarah Wijaya", role: "Ops Manager, FlyHigh", text: "Support timnya sangat responsif. Fitur-fiturnya sangat lengkap dan mudah digunakan oleh staff kami." },
              { name: "Michael Chen", role: "Director, Global Tour", text: "Integrasi API-nya sangat mulus. Kami bisa menghubungkan sistem internal kami dalam waktu kurang dari seminggu." }
            ].map((testi, idx) => (
              <RevealOnScroll key={idx} className={`delay-${idx * 150}`}>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative hover:bg-white hover:shadow-xl transition-all duration-300">
                  <FaStar className="text-yellow-400 text-xl mb-6" />
                  <p className="text-slate-600 mb-8 leading-relaxed italic">"{testi.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{testi.name}</div>
                      <div className="text-xs text-slate-500">{testi.role}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <RevealOnScroll>
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-20 text-center shadow-2xl shadow-blue-200">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Siap Transformasi Bisnis Anda?</h2>
              <p className="text-blue-50 text-lg mb-10 max-w-2xl mx-auto">
                Dapatkan akses penuh ke semua fitur premium selama 14 hari. Tanpa komitmen, batalkan kapan saja.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button
                  onClick={() => navigate("/login")}
                  className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold shadow-xl hover:bg-blue-50 transition transform hover:scale-105 text-lg"
                >
                  Mulai Trial Gratis
                </button>
                <button className="px-10 py-4 bg-blue-700/30 border border-white/30 text-white rounded-full font-semibold hover:bg-blue-700/50 transition backdrop-blur-sm text-lg">
                  Hubungi Sales
                </button>
              </div>

              <p className="mt-8 text-sm text-blue-100/80">
                *Tidak memerlukan kartu kredit untuk pendaftaran trial
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">G</div>
              <span className="text-2xl font-bold text-white">GDSS <span className="text-cyan-400">Pro</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              Platform distribusi travel global terdepan yang menghubungkan Anda dengan dunia. Inovasi tanpa henti untuk kemajuan bisnis Anda.
            </p>
            <div className="flex gap-4">
              {[FaGlobe, FaRocket, FaShieldAlt].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Produk</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {['Flight API', 'Hotel API', 'White Label', 'Mobile App', 'Corporate Travel'].map(item => (
                <li key={item}><a href="#" className="hover:text-cyan-400 transition flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 hover:opacity-100 transition-opacity" /> {item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Perusahaan</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {['Tentang Kami', 'Karir', 'Blog', 'Kontak', 'Kebijakan Privasi'].map(item => (
                <li key={item}><a href="#" className="hover:text-cyan-400 transition flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 hover:opacity-100 transition-opacity" /> {item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 GDSS Pro. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition">Terms</a>
            <a href="#" className="hover:text-slate-300 transition">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-6 {
          transform: rotateY(10deg);
        }
      `}</style>
    </div>
  );
}
