import Studio from "./Studio";

export default function StudioPage() {
  return <Studio />;
}

export function generateStaticParams() {
  return [
    { tool: [] }
  ];
}