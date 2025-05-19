import { getPerpPositions } from "@/lib/getPerpPositions";

export async function POST(req) {
  const { address } = await req.json();
  const positions = await getPerpPositions(address);
  return Response.json(positions);
}