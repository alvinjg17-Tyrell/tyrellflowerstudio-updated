import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#1a1a1a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al sitio
          </button>
          <div className="h-5 w-[1px] bg-white/15" />
          <div>
            <span className="font-['Playfair_Display'] text-lg tracking-[0.2em] font-bold">TYRELL</span>
            <span className="text-[#C9A96E] text-xs tracking-wider ml-3">Panel de Administración</span>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#C9A96E] hover:text-[#E8D5B5] text-sm transition-colors duration-300"
        >
          <Eye className="w-4 h-4" />
          Ver página
        </a>
      </div>
    </header>
  );
};
