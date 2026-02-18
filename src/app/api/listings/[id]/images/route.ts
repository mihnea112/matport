import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storage_path, sort_order = 0 } = await req.json();
  if (!storage_path)
    return NextResponse.json(
      { error: "storage_path required" },
      { status: 400 },
    );

  const { data, error } = await supabase
    .from("listing_images")
    .insert({ listing_id: params.id, storage_path, sort_order })
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ image: data }, { status: 201 });
}
