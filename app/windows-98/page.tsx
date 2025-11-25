import { headers } from "next/headers";

export default async function Windows98Page() {
  // Safe: server component
  const ua = (await headers()).get("user-agent") || "";
  // More complete mobile check
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      ua
    );

  return (
    <div>
      <h1>You are using: {isMobile ? "Mobile" : "Desktop"}</h1>
      <p className="text-xs text-zinc-500 break-all mt-2">
        UA: {ua || "Unavailable"}
      </p>
    </div>
  );
}
