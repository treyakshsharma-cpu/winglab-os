import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Simulate AI logic (replace with OpenAI or custom model integration in production)
  const { application, reynolds, speed, constraints } = body;

  // Mocked plausible aerofoil suggestion logic
  const aerofoil = application?.toLowerCase().includes("formula")
    ? "NACA 4412"
    : application?.toLowerCase().includes("uav")
    ? "Selig S1223"
    : "Eppler 423";

  const parameters = {
    chord: constraints?.toLowerCase().includes("chord") ? "0.25m" : "0.3m",
    thickness: constraints?.toLowerCase().includes("thickness") ? "12%" : "10%",
    reynolds,
    speed,
    notes: constraints || "Standard config",
  };

  // Mocked test matrix
  const testMatrix = [
    { angle: -2, cl: 0.1, cd: 0.025, cm: -0.02 },
    { angle: 0, cl: 0.3, cd: 0.022, cm: -0.01 },
    { angle: 2, cl: 0.5, cd: 0.021, cm: 0.0 },
    { angle: 4, cl: 0.7, cd: 0.023, cm: 0.01 },
    { angle: 6, cl: 0.9, cd: 0.028, cm: 0.02 },
  ];

  return NextResponse.json({ aerofoil, parameters, testMatrix });
}
