import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // Simuler une réussite ou une erreur
      if (data.password === "erreur1234") {
        throw new Error("Erreur lors de la réinitialisation du mot de passe.");
      }
      return true;
    },
    onSuccess: () => {
      setSuccess("Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.");
      setError(null);
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    },
    onError: (err: any) => {
      setError(err.message || "Une erreur est survenue.");
      setSuccess(null);
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    setError(null);
    setSuccess(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <ShieldCheck className="text-autowise-blue mb-2" size={40} />
          <CardTitle className="text-2xl font-bold text-center">Réinitialiser le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Nouveau mot de passe
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                disabled={isSubmitting || mutation.isLoading}
                className={errors.password ? "border-red-500" : ""}
                placeholder="Entrez un nouveau mot de passe"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                disabled={isSubmitting || mutation.isLoading}
                className={errors.confirmPassword ? "border-red-500" : ""}
                placeholder="Confirmez le mot de passe"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-autowise-blue hover:bg-autowise-navy"
              disabled={isSubmitting || mutation.isLoading}
              loading={isSubmitting || mutation.isLoading}
            >
              Réinitialiser le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 