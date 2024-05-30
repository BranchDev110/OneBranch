import { PropsWithChildren, useState, useEffect } from "react";

import { auth } from "@/firebase/BaseConfig";
import { useLazyGetUserByIdQuery } from "@/services/users";
import { onAuthStateChanged } from "firebase/auth";

const AuthWrapper = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [triggerGetAppUserProfile] = useLazyGetUserByIdQuery();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        triggerGetAppUserProfile(user.uid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [triggerGetAppUserProfile]);

  if (loading) {
    return <></>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
