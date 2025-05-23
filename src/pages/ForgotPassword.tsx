import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer un email valide." }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    setError(null);
    // Simulation d'appel API
    setTimeout(() => {
      if (data.email === "user@exemple.com") {
        setSuccess(true);
      } else {
        setError("Aucun compte n'est associé à cet email.");
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-autowise-navy to-autowise-navy/90">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-autowise-navy mb-2 text-center">Mot de passe oublié</h1>
          <p className="text-gray-500 mb-6 text-center">
            Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.
          </p>

          {success ? (
            <Alert className="mb-4" variant="success">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              <AlertTitle>Lien envoyé !</AlertTitle>
              <AlertDescription>
                Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-autowise-blue hover:bg-autowise-navy text-white font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  Envoyer un lien de réinitialisation
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <Button variant="link" className="text-autowise-blue" onClick={() => navigate("/login")}>Retour à la connexion</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 