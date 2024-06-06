import AppHeaderNav from "@/components/AppHeaderNav";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useAddUserToProjectAndTaskMutation } from "@/services/projects";
import { NavLink, useSearchParams } from "react-router-dom";

import { useCallback, useEffect, useRef } from "react";
import { deserializeSearchParams } from "@/lib/deserializeSearchParams";
import { toast } from "sonner";
import { AddUserToProjectAndTaskArgs } from "@/types/project.types";
import LoadingComponent from "@/components/LoadingComponent";
import CaseRender from "@/components/CaseRender";
import ErrorComponent from "@/components/ErrorComponent";
import { Button } from "@/ui/button";

const AcceptInvitation = () => {
  const { user } = useLoggedInUser();
  const [searchParams] = useSearchParams();

  const [addUser, res] = useAddUserToProjectAndTaskMutation();
  const ref = useRef(false);
  const params = deserializeSearchParams(searchParams);

  const acceptInvite = useCallback(async () => {
    ref.current = true;

    try {
      toast.dismiss();

      if (!params?.projectId) {
        throw new Error("Missing invite params");
      }

      const id = toast.loading("Verifying invitation...");

      // console.log(params);
      await addUser({
        ...params,
        userId: user?.id as string,
      } as unknown as AddUserToProjectAndTaskArgs).unwrap();

      toast.dismiss();
      toast.dismiss(id);
      toast.success("Added user to project");
    } catch (error: any) {
      toast.dismiss();
      const msg = error?.message || "Unable to add you to project";
      toast.error(msg);
    }
  }, [user?.id, addUser, params]);

  useEffect(() => {
    toast.dismiss();
    if (ref.current) {
      toast.dismiss();
      return;
    }
    acceptInvite();
  }, [acceptInvite]);

  return (
    <div>
      <AppHeaderNav>
        <h6 className="font-medium text-c5-300 ">Accept Invitation</h6>
      </AppHeaderNav>

      <div className="p-4 center">
        <LoadingComponent show={res.isUninitialized || res.isLoading} />

        <ErrorComponent
          show={res.isError}
          message={
            <div>
              <Button className="my-2" size={"sm"} onClick={acceptInvite}>
                Retry?
              </Button>
              <hr />
              <code className="block w-full">
                <pre className="max-w-full text-sm break-all whitespace-break-spaces ">
                  {JSON.stringify(res.error, null, 2)}
                </pre>
              </code>
            </div>
          }
        />

        <CaseRender condition={res.isSuccess}>
          <div className="min-h-[70dvh] center ">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Project Invite Accepted
              </h1>

              <p className="max-w-xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                Congratulations! You have successfully joined the project. You
                can now access the project dashboard and start collaborating
                with your team.
              </p>

              <NavLink
                replace
                className="inline-flex items-center justify-center h-10 px-8 text-sm font-medium transition-colors bg-gray-900 rounded-md shadow text-gray-50 hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 "
                to={`/projects/${params?.projectId}`}
              >
                Go to Project Dashboard
              </NavLink>
            </div>
          </div>
        </CaseRender>
      </div>
    </div>
  );
};

export default AcceptInvitation;
