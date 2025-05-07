import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const endpoint = "https://login-backend-auth.onrender.com/user";
      const response = await axios.post(endpoint, {
        email,
        name,
        password,
      });
      const msgSuccess = response.data.message;
      setSuccessMessage(msgSuccess);
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    } catch (error) {
      const msgError = error.response?.data?.message || "Erro desconhecido!";
      setErrorMessage(msgError);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-center">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-purple-400 mb-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
            <p className="text-gray-400 mt-1">
              Preencha os campos para se registrar
            </p>
          </div>
        </div>

        <form onSubmit={submitForm} className="p-6 space-y-4">
          {successMessage && (
            <div className="bg-green-900/30 border border-green-800 text-green-300 p-4 rounded-lg">
              <div className="flex items-center gap-2 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Sucesso
              </div>
              <div className="mt-2 text-sm">
                {successMessage} Redirecionando para a página de login!
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-lg">
              <div className="flex items-center gap-2 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Erro
              </div>
              <div className="mt-2 text-sm">{errorMessage}</div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-400">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-400"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-400"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition-all duration-200 relative overflow-hidden group ${
              loading
                ? "bg-purple-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registrando...
              </div>
            ) : (
              <>
                <span>Registrar</span>
                <span className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
              </>
            )}
          </button>
        </form>

        <div className="p-6 border-t border-gray-700 bg-gray-800/30">
          <div className="flex items-center justify-center">
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Já tem uma conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
