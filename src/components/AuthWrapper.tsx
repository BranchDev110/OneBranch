import { PropsWithChildren, useState, useEffect } from "react";

import { auth } from "@/firebase/BaseConfig";
import { useLazyGetUserByIdQuery } from "@/services/users";
import { onAuthStateChanged } from "firebase/auth";

const AuthWrapper = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [triggerGetUserProfile] = useLazyGetUserByIdQuery();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        triggerGetUserProfile(user.uid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [triggerGetUserProfile]);

  if (loading) {
    return <></>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
