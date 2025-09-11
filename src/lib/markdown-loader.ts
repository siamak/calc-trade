export async function loadMarkdownContent(
	locale: string,
	path: string
): Promise<string> {
	try {
		const response = await fetch(`/api/content/${path}/${locale}`);

		if (!response.ok) {
			throw new Error(
				`Failed to load markdown: ${response.status} ${response.statusText}`
			);
		}
		return await response.text();
	} catch (error) {
		console.error(`Failed to load markdown content for ${locale}:`, error);
		// Fallback to English if the requested locale fails
		if (locale !== "en") {
			console.log(`Falling back to English for path: ${path}`);
			return loadMarkdownContent("en", path);
		}
		throw error;
	}
}
