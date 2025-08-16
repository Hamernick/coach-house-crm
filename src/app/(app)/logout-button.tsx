"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const onClick = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return <Button variant="ghost" onClick={onClick}>Log out</Button>;
}
