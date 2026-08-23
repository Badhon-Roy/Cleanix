"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CleanerPendingApprovalRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/waiting-approval");
  }, [router]);

  return null;
}
