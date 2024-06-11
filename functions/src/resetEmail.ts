import { getAuth } from "firebase-admin/auth";

export interface ResetEmailArgs {
  email: string;
  oldEmail: string;
}

export const resetUserEmail = async ({ email, oldEmail }: ResetEmailArgs) => {
  try {
    // console.log({ email });

    const user = await getAuth().getUserByEmail(oldEmail);

    await getAuth().updateUser(user.uid, { email });

    return true;
  } catch (e: any) {
    let error = new Error(e?.message || "Unable to update user's email");
    (error as any).details = e;

    throw error;
  }
};
