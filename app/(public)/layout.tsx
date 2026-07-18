import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      {children}
    </SmoothScroll>
  );
}
