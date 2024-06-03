import FormHeader from "@/components/auth/FormHeader";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSendForgotPassordEmailMutation } from "@/services/auth";

const formSchema = z.object({
  email: z.string().email(),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  email: "",
};

const ForgotPassword = () => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [send, sendRes] = useSendForgotPassordEmailMutation();

  const onSubmit = async (values: Schema) => {
    try {
      toast.dismiss();
      const id = toast.loading("Initiating a password reset...");
      await send({
        email: values.email,
        originUrl: `${window.location.origin}/reset`,
      }).unwrap();

      toast.dismiss();
      toast.dismiss(id);

      toast.success(
        `Password reset initiated. An email was sent to ${values.email}`
      );
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
          <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tight">
            Forgot Password
          </h3>

          <p className="mb-5 text-sm text-c5-300">
            Enter your email address below and we'll send you instructions to
            reset your password.
          </p>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="your-email@gmail.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={sendRes.isLoading}
              className={cn("w-full mt-6", {
                ["animate-pulse cursor-not-allowed"]: sendRes.isLoading,
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

export default ForgotPassword;
