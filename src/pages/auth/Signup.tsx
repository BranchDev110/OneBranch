import { Link, useNavigate } from "react-router-dom";

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
import { fakeAPICall } from "@/lib/utils";

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

  const onSubmit = async (values: Schema) => {
    try {
      console.log(values);
      toast.dismiss();
      toast.loading("Signing up...");

      await fakeAPICall();

      toast.dismiss();
      toast.success("Registration successfull");
      navigate("/signin");
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to register";
      toast.error(msg);
    }
  };

  return (
    <main className="min-h-screen center flex-col p-1 bg-c2-100">
      <FormHeader />

      <Form {...form}>
        <form
          className=" max-w-sm bg-white border-c5 w-full rounded-lg py-6 px-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h3 className="text-2xl font-bold leading-tight tracking-tight mb-5">
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
                    <PasswordInput {...field} />
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
                    <PasswordInput {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full mt-6" type="submit">
            Submit
          </Button>
          <p className="text-sm font-light mt-6">
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
