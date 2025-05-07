import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = ({ token: propToken }) => {
  const [token, setToken] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("try-it");
  const [copied, setCopied] = useState(false);
  const [requestStartTime, setRequestStartTime] = useState(null);
  const [requestEndTime, setRequestEndTime] = useState(null);

  // Get token from cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const tokenCookie = getCookie("TOKEN");
    const storedToken = localStorage.getItem("jwt_token");

    if (propToken) {
      setToken(propToken);
    } else if (tokenCookie) {
      setToken(tokenCookie);
    } else if (storedToken) {
      setToken(storedToken);
      document.cookie = `TOKEN=${storedToken}; path=/`;
    }
  }, [propToken]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    // Simple toast notification
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    toast.textContent = "Token copiado para a área de transferência!";
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
      setCopied(false);
    }, 2000);
  };

  const testPrivateRoute = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    setRequestStartTime(Date.now());
    setRequestEndTime(null);

    try {
      const tokenToUse = manualToken || token;
      const res = await fetch(
        "https://login-backend-auth.onrender.com/private",
        {
          method: "GET",
          headers: {
            Authorization: tokenToUse,
          },
        }
      );

      const json = await res.json();
      setRequestEndTime(Date.now());
      setApiResponse({ status: res.status, body: json });
    } catch (err) {
      setError(err.message);
      setRequestEndTime(Date.now());
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-blue-500";
    if (status >= 400 && status < 500) return "bg-yellow-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  };

  const getResponseTime = () => {
    if (requestStartTime && requestEndTime) {
      return `${requestEndTime - requestStartTime}ms`;
    }
    return null;
  };

  // Tab components
  const TabsList = ({ children }) => (
    <div className="flex border-b border-gray-700">{children}</div>
  );

  const TabsTrigger = ({ value, active, onClick, children, className }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 ${
        active
          ? "border-b-2 border-purple-500 text-purple-400"
          : "text-gray-400 hover:text-gray-300"
      } ${className || ""}`}
    >
      {children}
    </button>
  );

  const TabsContent = ({ value, activeValue, children }) => {
    if (value !== activeValue) return null;
    return <div className="py-4">{children}</div>;
  };

  // Badge component
  const Badge = ({ children, className, variant }) => {
    const baseClass =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    const variantClass =
      variant === "outline"
        ? "border border-gray-700 text-gray-400"
        : className || "bg-purple-600 text-white";

    return <span className={`${baseClass} ${variantClass}`}>{children}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              API Docs
            </h1>
          </div>
          {token ? (
            <div className="px-3 py-1 border border-green-500 text-green-400 rounded-full flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Autenticado
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-4 py-2 rounded-md"
            >
              Fazer Login
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 sticky top-6">
              <h3 className="text-lg font-medium mb-4">Endpoints</h3>
              <nav className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>GET /private</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50 text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                  <span>POST /auth</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50 text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                  <span>GET /status</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
              <div className="border-b border-gray-700 bg-gray-800/80 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="mb-2 bg-purple-600">GET</Badge>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <code className="text-purple-300">/private</code>
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Endpoint protegido que requer autenticação via JWT
                    </p>
                  </div>
                  <Badge variant="outline">Requer Autenticação</Badge>
                </div>
              </div>
              <div className="p-0">
                <div className="border-b border-gray-700">
                  <TabsList>
                    <TabsTrigger
                      value="try-it"
                      active={activeTab === "try-it"}
                      onClick={setActiveTab}
                      className="h-12 px-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Try It
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      active={activeTab === "code"}
                      onClick={setActiveTab}
                      className="h-12 px-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      Code Samples
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="try-it" activeValue={activeTab}>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Request Headers</h3>
                      <div className="grid grid-cols-3 gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <div className="font-medium text-gray-400">
                          Authorization
                        </div>
                        <div className="col-span-2 font-mono">
                          Bearer{" "}
                          {token ? (
                            <span className="text-green-400">
                              {token.substring(0, 15)}...
                            </span>
                          ) : (
                            <span className="text-yellow-400">
                              &lt;seu_token&gt;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {token ? (
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="token"
                            className="text-sm font-medium text-gray-400"
                          >
                            Seu Token JWT
                          </label>
                          <div className="flex">
                            <div className="relative flex-1">
                              <input
                                id="token"
                                value={token}
                                readOnly
                                className="w-full pr-10 font-mono text-xs bg-gray-900 border border-gray-700 text-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <button
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                                onClick={() => copyToClipboard(token)}
                              >
                                {copied ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 text-green-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <rect
                                      x="8"
                                      y="2"
                                      width="8"
                                      height="4"
                                      rx="1"
                                      ry="1"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => copyToClipboard(token)}
                              className="rounded-l-none bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-md"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="manual-token"
                            className="text-sm font-medium text-gray-400"
                          >
                            Ou insira um token manualmente
                          </label>
                          <input
                            id="manual-token"
                            value={manualToken}
                            onChange={(e) => setManualToken(e.target.value)}
                            placeholder="Insira o seu token aqui"
                            className="font-mono text-xs bg-gray-900 border border-gray-700 text-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <button
                          onClick={testPrivateRoute}
                          disabled={loading}
                          className={`w-full py-2 px-4 rounded-md transition-all duration-200 relative overflow-hidden group ${
                            loading
                              ? "bg-purple-700 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
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
                              Enviando requisição...
                            </div>
                          ) : (
                            <>
                              <span className="flex items-center justify-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Executar requisição
                              </span>
                              <span className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                            </>
                          )}
                        </button>

                        {error && (
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
                              Erro na requisição
                            </div>
                            <div className="mt-2 text-sm">{error}</div>
                          </div>
                        )}

                        {apiResponse && (
                          <div className="space-y-3 animate-in fade-in-50 duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`text-white ${getStatusColor(
                                    apiResponse.status
                                  )}`}
                                >
                                  {apiResponse.status}
                                </Badge>
                                <span className="text-sm text-gray-400">
                                  {apiResponse.status >= 200 &&
                                  apiResponse.status < 300
                                    ? "Success"
                                    : "Error"}
                                </span>
                              </div>
                              {getResponseTime() && (
                                <Badge variant="outline">
                                  {getResponseTime()}
                                </Badge>
                              )}
                            </div>

                            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  Response
                                </span>
                                <button
                                  className="h-8 px-2 text-gray-400 hover:text-white"
                                  onClick={() =>
                                    copyToClipboard(
                                      JSON.stringify(apiResponse.body, null, 2)
                                    )
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1 inline"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </svg>
                                  Copy
                                </button>
                              </div>
                              <pre className="p-4 text-sm font-mono overflow-auto max-h-80 text-gray-300">
                                {JSON.stringify(apiResponse.body, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 p-4 rounded-lg">
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
                          Autenticação necessária
                        </div>
                        <div className="mt-2">
                          Você precisa estar autenticado para testar este
                          endpoint.
                          <Link
                            to="/login"
                            className="mt-2 inline-block border border-yellow-800 text-yellow-300 hover:bg-yellow-900/30 px-3 py-1 rounded-md text-sm"
                          >
                            Fazer login
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="code" activeValue={activeTab}>
                  <div className="border-b border-gray-700">
                    <TabsList>
                      <TabsTrigger
                        value="curl"
                        active={true}
                        onClick={() => {}}
                        className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-none rounded-none h-10 px-4"
                      >
                        cURL
                      </TabsTrigger>
                      <TabsTrigger
                        value="javascript"
                        active={false}
                        onClick={() => {}}
                        className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-none rounded-none h-10 px-4"
                      >
                        JavaScript
                      </TabsTrigger>
                      <TabsTrigger
                        value="python"
                        active={false}
                        onClick={() => {}}
                        className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-none rounded-none h-10 px-4"
                      >
                        Python
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="bg-gray-900 p-4 font-mono text-sm overflow-auto relative group">
                    <button
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        copyToClipboard(`curl -X GET \\
  https://login-backend-auth.onrender.com/private \\
  -H 'Authorization: Bearer <seu_token>'`)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1 inline"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </button>
                    <code className="text-gray-300">
                      curl -X GET \<br />
                      &nbsp;&nbsp;https://login-backend-auth.onrender.com/private
                      \<br />
                      &nbsp;&nbsp;-H &apos;Authorization: Bearer
                      &lt;seu_token&gt;&apos;
                    </code>
                  </div>
                </TabsContent>
              </div>
            </div>

            <div className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold">Documentação da API</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Instruções detalhadas para utilizar a API
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Autenticação</h3>
                  <p className="text-gray-400 text-sm">
                    Todas as rotas protegidas requerem um token JWT válido no
                    header Authorization.
                  </p>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 font-mono text-sm">
                    Authorization: Bearer &lt;seu_token&gt;
                  </div>
                </div>

                <hr className="border-gray-700" />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Códigos de Resposta</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">200</Badge>
                      <span className="text-gray-300">Sucesso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">401</Badge>
                      <span className="text-gray-300">Não autorizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">403</Badge>
                      <span className="text-gray-300">Proibido</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">500</Badge>
                      <span className="text-gray-300">Erro interno</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 bg-gray-800/30 p-4">
                <div className="flex items-center justify-between w-full text-sm text-gray-400">
                  <span>Última atualização: 07/05/2025</span>
                  <a
                    href="#"
                    className="flex items-center hover:text-purple-400 transition-colors"
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Documentação completa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
