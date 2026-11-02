import RoomView from "@/app/play/[code]/RoomView";

export default function SpielenRaumPage({ params }: { params: Promise<{ code: string }> }) {
  return <RoomView params={params} lang="de" />;
}
