import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pour la connexion admin, email pré-configuré
      const emailToUse = isAdminLogin ? "admin@autowise.com" : email;
      // Mot de passe fictif pour la démo, à remplacer par un vrai système d'authentification
      const passwordToUse = isAdminLogin ? "admin123" : password;
      
      const success = await login(emailToUse, passwordToUse);
      
      if (success) {
        toast({
          title: "Connexion réussie",
          description: isAdminLogin ? "Bienvenue dans l'interface administrateur" : "Bienvenue sur AutoWise",
        });
        // Redirection intelligente après login
        const from = (location.state as any)?.from;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate(isAdminLogin ? "/admin" : "/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <img 
                src="/lovable-uploads/43daed69-9290-490b-99c3-7d35f12ec6d5.png" 
                alt="AutoWise" 
                className="h-10 mx-auto mb-4" 
              />
              <h1 className="text-2xl font-bold text-autowise-navy">
                {isAdminLogin ? "Administration" : "Connexion"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isAdminLogin 
                  ? "Accédez au tableau de bord administrateur" 
                  : "Connectez-vous à votre compte client"}
              </p>
            </div>

            {isAdminLogin && (
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Mode administrateur</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Utilisez les identifiants prédéfinis pour accéder à l'espace administrateur.
                  <div className="mt-2 p-2 bg-white rounded border border-blue-100">
                    <div><strong>Email:</strong> admin@autowise.com</div>
                    <div><strong>Mot de passe:</strong> admin123</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={isAdminLogin ? "admin@autowise.com" : email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  required
                  disabled={isAdminLogin || isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-autowise-blue hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={isAdminLogin ? "admin123" : password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-autowise-blue hover:bg-autowise-navy"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>

              <div className="text-center mt-6">
                {!isAdminLogin && (
                  <p className="text-sm text-gray-600">
                    Pas encore de compte ?{" "}
                    <Link to="/register" className="text-autowise-blue hover:underline">
                      S'inscrire
                    </Link>
                  </p>
                )}
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-autowise-blue mt-2 block mx-auto"
                  onClick={toggleLoginMode}
                >
                  {isAdminLogin 
                    ? "Accéder à l'espace client" 
                    : "Accéder à l'espace administrateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
