import { Link, useLocation, useNavigate } from "react-router-dom";

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
import { PasswordInput } from "@/components/ui/password-input";
import FormHeader from "@/components/auth/FormHeader";
import { cn } from "@/lib/utils";
import { useSignUpMutation } from "@/services/auth";
import { useCreateUserMutation } from "@/services/users";
import getRedirectUrl from "@/lib/getRedirectUrl";

const formSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2),

    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [signup, signupRes] = useSignUpMutation();
  const [createUser, createUserRes] = useCreateUserMutation();

  const onSubmit = async (values: Schema) => {
    const redirectUrl = getRedirectUrl(location.search);

    try {
      // console.log(values);
      toast.dismiss();
      toast.loading("Signing up...");

      const res = await signup({
        email: values.email,
        password: values.password,
      }).unwrap();

      await createUser({
        id: res.id,
        name: values.name,
        email: values.email,
      }).unwrap();

      toast.dismiss();
      toast.success(`${values.name} has been registered.`);
      let url = `/signin`;

      // console.log(redirectUrl);

      if (redirectUrl) {
        url = `/signin?callbackUrl=${encodeURIComponent(redirectUrl)}`;
      }
      navigate(url);
    } catch (error: any) {
      toast.dismiss();
      const msg = error?.message || "Unable to register";
      toast.error(msg);
    }
  };


  const handleFail = (...data: any) => {
    console.log(data);
  };

  return (
    <main className="flex-col min-h-screen p-1 center bg-c2-100">
      <FormHeader />

      <Form {...form}>
        <form
          className="w-full max-w-sm px-4 py-6 bg-white rounded-lg border-c5"
          onSubmit={form.handleSubmit(onSubmit, handleFail)}
        >
          <h3 className="mb-5 text-2xl font-bold leading-tight tracking-tight">
            Sign in to your account
          </h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Jane Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your-email@gmail.com" {...field} />
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
          </div>
          <Button
            disabled={signupRes.isLoading || createUserRes.isLoading}
            className={cn("w-full mt-6", {
              ["animate-pulse cursor-not-allowed"]:
                signupRes.isLoading || createUserRes.isLoading,
            })}
            type="submit"
          >
            Submit
          </Button>
          <p className="mt-6 text-sm font-light">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-primary">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </main>
  );
};

export default SignUp;
