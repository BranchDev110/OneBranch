import FormHeader from "@/components/auth/FormHeader";

const ResetPassword = () => {
  return (
    <main className="min-h-screen center flex-col p-1 bg-c2-100">
      <FormHeader />

      <div className=" max-w-sm bg-white border-c5 w-full rounded-lg py-6 px-4 min-h-[30vh]">
        <h3 className="text-2xl font-bold leading-tight tracking-tight mb-5">
          Reset Passord
        </h3>
      </div>
    </main>
  );
};

export default ResetPassword;
