export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">EduPlatform</h3>
            <p className="text-gray-300 mb-4">
              Kelajak bugundan boshlanadi - Qarshi davlat Texnika universiteti
            </p>
            <p className="text-gray-400 text-sm">
              Dasturchi: Qudratov Abror KI_11-21(S) guruh talabasi
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tezkor havolalar</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Kurslar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">O'qituvchilar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Yordam</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Aloqa</h4>
            <ul className="space-y-2 text-gray-300">
              <li>+998 (90) 123-45-67</li>
              <li>info@eduplatform.uz</li>
              <li>Qarshi, O'zbekiston</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EduPlatform. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
