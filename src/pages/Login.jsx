import { useState } from "react";
import { useAuth } from "../api/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLocal, setErrorLocal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLocal(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Una vez logueado con éxito, redirigimos al POS
      navigate("/");
    } catch (err) {
      // Traducimos errores comunes de Supabase
      if (err.message === "Invalid login credentials") {
        setErrorLocal("Correo o contraseña incorrectos.");
      } else {
        setErrorLocal(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 w-full px-4">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border border-slate-200"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Software POS
          </h2>
          <p className="text-slate-500 mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {errorLocal && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {errorLocal}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-8 py-3 rounded-lg font-bold text-white transition-all ${
            isSubmitting
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? "Iniciando sesión..." : "Entrar al Sistema"}
        </button>

        <p className="text-center text-xs text-slate-400 mt-6 uppercase tracking-widest">
          Control de Acceso Seguro
        </p>
      </form>
    </div>
  );
}
