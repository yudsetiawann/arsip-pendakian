import { getGunung } from "@/lib/sanity-utils";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const gunungList = await getGunung();

  return <HomeClient initialGunung={gunungList || []} />;
}
