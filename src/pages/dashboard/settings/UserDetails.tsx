import { useEffect } from "react";
import AppHeaderNav from "@/components/AppHeaderNav";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { NavLink } from "react-router-dom";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { v4 as uuid } from "uuid";
import { storage } from "@/firebase/BaseConfig";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useDeleteImagesFromFirebase from "@/hooks/useDeleteImagesFromFirebase";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import CaseRender from "@/components/CaseRender";
import { Label } from "@/ui/label";
import { UpdateUserProfileBody } from "@/types/user.types";
import { useEditProfileMutation } from "@/services/users";

const maxFileSize = 1048576; //1mb

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  name: "",
  email: "",
};

const UserDetails = () => {
  const { user, isLoading, isError, isSuccess, error } = useLoggedInUser();
  const { handleDelete } = useDeleteImagesFromFirebase();

  const [update, updateRes] = useEditProfileMutation();

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    maxSize: maxFileSize,

    onDrop: (_acceptedFiles, fileRejections) => {
      //   console.log({ acceptedFiles, fileRejections });
      //   console.log(fileRejections?.[0]?.errors);
      if (fileRejections.length) {
        let msg = "";

        fileRejections?.[0]?.errors?.forEach((c) => {
          msg += `${c.message}.`;
        });

        if (msg) {
          toast.error("Error(s): " + msg);
        }
      }
    },
  });

  const handleSubmit = async (values: Schema) => {
    try {
      //   console.log({ values, acceptedFiles });

      const body: UpdateUserProfileBody = {
        ...values,
        avatarUrl: user?.avatarUrl || "",
        oldEmail: user?.email as string,
        id: user?.id as string,
      };

      if (acceptedFiles.length) {
        const storageRef = ref(
          storage,
          `/avatars/${uuid()}-${acceptedFiles[0].name}`
        );

        toast.dismiss();
        toast.loading("Uploading avatar...");

        const snapshot = await uploadBytes(storageRef, acceptedFiles[0]);
        const url = await getDownloadURL(snapshot.ref);

        body.avatarUrl = url;
        toast.dismiss();
      }

      toast.dismiss();
      toast.loading("Updating details...");

      await update(body).unwrap();

      toast.dismiss();
      toast.success("Updated user details");

      if (user?.avatarUrl && user?.avatarUrl !== body?.avatarUrl) {
        handleDelete([user?.avatarUrl]);
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to set avatar");
    }
  };

  const handleErrors = (...args: any) => {
    console.log(args);
  };

  useEffect(() => {
    if (user?.id) {
      form.reset({
        email: user.email,
        name: user.name,
      });
    }
  }, [form, user]);

  return (
    <div>
      <AppHeaderNav>
        <h6 className="font-medium text-c5-300 ">Profile</h6>
      </AppHeaderNav>

      <div className="p-2.5 md:p-4 [&_form]:max-w-3xl">
        <LoadingComponent show={isLoading} />
        <ErrorComponent
          show={isError}
          message={
            <code className="block w-full">
              <pre className="max-w-full text-sm break-all whitespace-break-spaces ">
                {JSON.stringify(error, null, 2)}
              </pre>
            </code>
          }
        />

        <CaseRender condition={isSuccess}>
          <Form {...form}>
            <form
              className="p-4 mx-auto bg-white"
              onSubmit={form.handleSubmit(handleSubmit, handleErrors)}
            >
              <h1 className="my-3 text-3xl font-bold text-center">
                User Details
              </h1>

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

                <div className="space-y-2">
                  <Label>Avatar Url</Label>
                  <div
                    className={cn(
                      "text-center border-dashed rounded-lg p-2 border text-c5-300 h-24",
                      {
                        "border-destructive": isDragReject,
                        "border-primary": isDragAccept,
                      }
                    )}
                  >
                    <div className="h-full center" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Upload an image file. {"(<=1MB)"}</p>
                    </div>
                  </div>
                </div>

                {user?.avatarUrl || acceptedFiles.length ? (
                  <div className="relative w-12 mx-auto overflow-hidden border-2 rounded-full aspect-square border-primary">
                    <img
                      className="absolute object-cover object-center w-full h-full"
                      src={
                        acceptedFiles?.[0]
                          ? URL.createObjectURL(acceptedFiles?.[0])
                          : user?.avatarUrl
                      }
                    />
                  </div>
                ) : (
                  <></>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center justify-between">
                    <NavLink
                      to="/forgot?allowBack=true"
                      className="text-sm underline"
                    >
                      Reset password
                    </NavLink>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    disabled={updateRes.isLoading}
                    className={cn("", {
                      "animate-pulse cursor-not-allowed": updateRes.isLoading,
                    })}
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CaseRender>
      </div>
    </div>
  );
};

export default UserDetails;
