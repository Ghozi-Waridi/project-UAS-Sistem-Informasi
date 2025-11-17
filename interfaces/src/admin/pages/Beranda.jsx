import React from "react";
import { useNavigate } from "react-router-dom";


export default function Beranda() {
  
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden bg-white">

      {/* HERO SECTION */}
      <section
        className="h-[90vh] bg-cover bg-center flex flex-col justify-center text-center px-6 text-white relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[#0b1f4a]/70" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Solusi GDSS Terdepan <br />
            untuk <span className="text-blue-300">Bisnis Travel</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Tingkatkan efisiensi operasional travel Anda dengan sistem distribusi global
            yang terintegrasi. Akses real-time ke inventori hotel, penerbangan,
            dan layanan travel lainnya.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow-lg hover:bg-gray-100"
            >
              🌟 Mulai Gratis
            </button>
            <button
              className="px-6 py-3 rounded-full bg-transparent border border-white text-white font-semibold backdrop-blur hover:bg-white/20 transition"
            >
              🎬 Lihat Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-16 flex justify-center gap-10 text-center text-blue-100">
          <div className="backdrop-blur-xl bg-white/10 px-6 py-4 rounded-2xl shadow-lg border border-white/20">
            <p className="text-3xl font-bold">500+</p>
            <p className="text-sm">Klien Aktif</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 px-6 py-4 rounded-2xl shadow-lg border border-white/20">
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-sm">Uptime Sistem</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 px-6 py-4 rounded-2xl shadow-lg border border-white/20">
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm">Support</p>
          </div>
        </div>
      </section>

      {/* MENGAPA MEMILIH */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Mengapa Memilih <span className="text-blue-600">GDSS Pro?</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Kami membantu ratusan perusahaan travel meningkatkan efisiensi operasional 
          dengan teknologi GDSS terdepan.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg"
            className="rounded-2xl shadow-lg"
          />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Pengalaman 15+ Tahun di Industri Travel</h3>

            <p className="text-gray-600">
              GDSS Pro telah menjadi mitra terpercaya agen travel, tour operator, 
              dan hospitality. Dengan teknologi cloud-native dan API yang kuat, 
              kami memastikan konektivitas real-time yang stabil dan aman.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>🔐 Keamanan Tingkat Enterprise</li>
              <li>⚡ Performa Tinggi & Response &lt; 200ms</li>
              <li>🌍 Jangkauan Global 500+ Supplier</li>
            </ul>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4">
          Layanan <span className="text-blue-600">Komprehensif</span>
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Solusi end-to-end untuk kebutuhan distribusi travel Anda.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Flight Booking System",
              features: [
                "Multi-GDS Integration",
                "Fare Comparison",
                "Seat Selection",
                "Baggage Management",
              ],
            },
            {
              title: "Hotel Reservation",
              features: [
                "Real-time Availability",
                "Rate Comparison",
                "Room Mapping",
                "Cancellation Policy",
              ],
            },
            {
              title: "Car Rental Services",
              features: [
                "Fleet Management",
                "GPS Tracking",
                "Insurance Options",
                "24/7 Support",
              ],
            },
            {
              title: "Cruise & Tours",
              features: ["Cruise Packages", "Tour Bundling", "Multi-destination"],
            },
            {
              title: "Payment Gateway",
              features: [
                "Secure Payment",
                "Multiple Methods",
                "Fraud Protection",
              ],
            },
            {
              title: "Analytics & Reporting",
              features: [
                "Sales Dashboard",
                "Performance Insights",
                "Supply Tracking",
              ],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
            >
              <h4 className="text-lg font-semibold mb-3">{item.title}</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                {item.features.map((f) => (
                  <li key={f}>✔ {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="py-20 px-6 bg-blue-50">
        <h2 className="text-3xl font-bold text-center mb-4">
          Apa Kata <span className="text-blue-600">Klien Kami?</span>
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Pengalaman nyata dari profesional travel yang telah merasakan manfaat
          GDSS Pro.
        </p>

        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-yellow-500 text-xl mb-3">★★★★★</p>

            <p className="italic text-gray-700 mb-4">
              "GDSS Pro mengubah cara kami beroperasi. Sistem yang terintegrasi membuat
              kami mengakses inventori global dengan mudah dan meningkatkan revenue 40%
              dalam 6 bulan pertama."
            </p>

            <h4 className="font-semibold">Budi Santoso</h4>
            <p className="text-sm text-gray-500">CEO - Nusantara Travel</p>
          </div>

          <div className="space-y-3">
            {["Budi Santoso", "Sari Wijaya", "Ahmad Rahman", "Linda Kusuma"].map(
              (name, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-xl hover:bg-blue-100 transition cursor-pointer"
                >
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-gray-500">Nusantara Travel</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA BESAR */}
      <section className="py-20 px-6 text-center text-white bg-gradient-to-br from-blue-600 to-indigo-700">
        <h2 className="text-3xl font-bold mb-3">
          Siap Mengoptimalkan Bisnis Travel Anda?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          Dapatkan akses gratis 30 hari tanpa komitmen. Bergabung bersama 500+
          perusahaan travel yang telah maju bersama GDSS Pro.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-full bg-white text-blue-600 font-semibold shadow-md hover:bg-gray-100"
          >
            🚀 Mulai Trial Gratis
          </button>
          <button
            className="px-6 py-3 rounded-full bg-white/20 border border-white text-white hover:bg-white/30 backdrop-blur"
          >
            📅 Jadwalkan Demo
          </button>
        </div>

        <div className="mt-8 text-sm text-blue-100">
          ✔ Setup 24 jam &nbsp; | &nbsp; ✔ Keamanan Enterprise &nbsp; | &nbsp; ✔ Support
          24/7
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1f4a] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold text-lg mb-3">GDSS Pro</h3>
            <p className="text-blue-200 text-sm mb-3">
              Penyedia solusi GDSS terpercaya sejak 2008. Membantu bisnis travel
              berkembang dengan teknologi terdepan.
            </p>

            <div className="flex gap-4 mt-4 text-xl text-blue-300">
              <a>🌐</a>
              <a>🐦</a>
              <a>📸</a>
              <a>💼</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Layanan</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>Flight Booking</li>
              <li>Hotel Reservation</li>
              <li>Car Rental</li>
              <li>Cruise & Tours</li>
              <li>Payment Gateway</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Kontak</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>📞 +62 21 5555 0123</li>
              <li>📧 info@gdsspro.com</li>
              <li>📍 Jakarta Pusat</li>
              <li>🕒 Support 24/7</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-10">
          © 2024 GDSS Pro. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
