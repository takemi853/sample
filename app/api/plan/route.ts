import { NextRequest, NextResponse } from "next/server";
import { PlanRequest, PlanResponse } from "@/types";
import { geocode } from "@/lib/geo";
import { selectPOIs, calculateTotals } from "@/lib/score";
import { pois } from "@/data/pois";

/**
 * POST /api/plan
 * 寄り道プランを生成するAPIエンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    const body: PlanRequest = await request.json();
    const { originText, destinationText, interests, timeBudgetMin } = body;

    // バリデーション
    if (!originText || !destinationText) {
      return NextResponse.json(
        { error: "出発地と目的地を入力してください" },
        { status: 400 }
      );
    }

    if (timeBudgetMin < 0) {
      return NextResponse.json(
        { error: "寄り道時間上限は0以上で指定してください" },
        { status: 400 }
      );
    }

    // ジオコーディング（モック）
    const origin = geocode(originText);
    const destination = geocode(destinationText);

    if (!origin) {
      return NextResponse.json(
        { error: `出発地「${originText}」が見つかりませんでした` },
        { status: 400 }
      );
    }

    if (!destination) {
      return NextResponse.json(
        { error: `目的地「${destinationText}」が見つかりませんでした` },
        { status: 400 }
      );
    }

    // POI選定
    const selectedPOIs = selectPOIs(
      origin,
      destination,
      pois,
      interests,
      timeBudgetMin
    );

    // 合計計算
    const totals = calculateTotals(selectedPOIs);

    const response: PlanResponse = {
      items: selectedPOIs,
      totals,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Plan generation error:", error);
    return NextResponse.json(
      { error: "プランの生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
