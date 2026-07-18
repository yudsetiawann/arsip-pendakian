import { getGunung } from "@/lib/sanity-utils";
import HomeClient from "@/components/home/HomeClient";

// Force static rendering (Next.js will generate this route statically at build time)
export const dynamic = "force-static";

export default async function Home() {
  const gunungList = await getGunung();

  return <HomeClient initialGunung={gunungList || []} />;
}
