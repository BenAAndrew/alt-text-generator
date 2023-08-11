import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fetch resource
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const isText = searchParams.get("isText") === "true";

  // Try a simple GET
  try {
    const response = await fetch(url!);
    if (response.status === 200) {
      if (isText) {
        const htmlContent = await response.text();
        return new NextResponse(htmlContent);
      } else {
        const image = await response.arrayBuffer();
        return new NextResponse(image, {
          headers: { "Content-Type": "image/png" },
        });
      }
    }
  } catch {}

  // Use puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url!, { waitUntil: "domcontentloaded" });
  let response;
  if (isText) {
    const htmlContent = await page.content();
    response = new NextResponse(htmlContent);
  } else {
    const image = await page.screenshot();
    response = new NextResponse(image, {
      headers: { "Content-Type": "image/png" },
    });
  }
  await browser.close();
  return response;
}
