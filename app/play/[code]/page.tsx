import RoomView from "./RoomView";

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  return <RoomView params={params} lang="en" />;
}
