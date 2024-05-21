import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { useLoginMutation } from "@/services/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import FormHeader from "@/components/auth/FormHeader";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  email: "",
  password: "",
};

const Login = () => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [login, loginRes] = useLoginMutation();

  const navigate = useNavigate();

  const onSubmit = async (values: Schema) => {
    try {
      // console.log(values);
      toast.dismiss();
      toast.loading("Logging you in...");

      await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      toast.dismiss();
      toast.success("Login successful");

      //to home page later
      navigate("/sprints/fake");
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to login";
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
            Sign in to your account
          </h3>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="current-password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-4 space-x-2 text-sm btwn">
            <div className="space-x-1 start">
              <Checkbox id="rem" />
              <label
                htmlFor="rem"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link to="/forgot" className="font-medium text-black/80">
              Forgot Password
            </Link>
          </div>

          <Button
            disabled={loginRes.isLoading}
            className={cn("w-full mt-6", {
              ["animate-pulse cursor-not-allowed"]: loginRes.isLoading,
            })}
            type="submit"
          >
            Submit
          </Button>
          <p className="mt-6 text-sm font-light">
            Don’t have an account yet?{" "}
            <Link to="/signup" className="font-medium text-primary">
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </main>
  );
};

export default Login;
