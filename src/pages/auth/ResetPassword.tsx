import FormHeader from "@/components/auth/FormHeader";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useResetUserPasswordMutation } from "@/services/auth";
import { useLocation, useNavigate } from "react-router-dom";

const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  password: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [reset, resetRes] = useResetUserPasswordMutation();

  const onSubmit = async (values: Schema) => {
    try {
      toast.dismiss();
      const url = new URLSearchParams(location.search);

      const id = toast.loading("Resetting password...");
      const oobCode = url.get("oobCode");

      if (!oobCode) {
        toast.dismiss();
        toast.dismiss(id);
        throw new Error("Missing reset code");
      }
      await reset({
        password: values.password,
        oobCode,
      }).unwrap();

      toast.dismiss();
      toast.dismiss(id);

      toast.success(
        `Password reset success. You will be redirected to login soon`
      );

      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch (error: any) {
      toast.dismiss();
      const msg = error?.message || "Unable to reset password";
      toast.error(msg);
    }
  };

  return (
    <main className="flex-col min-h-screen p-1 center bg-c2-100">
      <FormHeader />

      <Form {...form}>
        <form
          className="w-full max-w-sm px-4 py-6 bg-white rounded-lg border-c5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h3 className="mb-5 text-2xl font-bold leading-tight tracking-tight">
            Reset Password
          </h3>

          <p className="mb-5 text-sm text-c5-300">
            Enter your a new password to reset your account password.
          </p>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={resetRes.isLoading}
              className={cn("w-full mt-6", {
                ["animate-pulse cursor-not-allowed"]: resetRes.isLoading,
              })}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default ResetPassword;
