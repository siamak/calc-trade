import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ path: string; locale: string }> }
) {
	try {
		const { path, locale } = await params;

		// Construct the file path to the markdown file
		const filePath = join(process.cwd(), "contents", path, `${locale}.md`);

		// Read the markdown file
		const content = await readFile(filePath, "utf-8");

		// Return the content with proper headers
		return new NextResponse(content, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
				"Cache-Control": "public, max-age=3600", // Cache for 1 hour
			},
		});
	} catch (error) {
		console.error("Error reading markdown file:", error);
		return new NextResponse("File not found", { status: 404 });
	}
}
