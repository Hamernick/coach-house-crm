import { createSupabaseBrowser } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="text-sm underline">
      Logout
    </button>
  );
}
