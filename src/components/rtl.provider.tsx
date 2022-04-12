import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useRouter } from "next/router";
import rtl from "stylis-plugin-rtl";
import React from "react";

const options = {
	rtl: { key: "css-fa", stylisPlugins: [rtl] },
	ltr: { key: "css-en" },
};

export function RtlProvider({ children }: { children: React.ReactNode }) {
	const { locale } = useRouter();
	const dir = locale == "fa" ? "rtl" : "ltr";
	const cache = createCache(options[dir]);
	return <CacheProvider value={cache}>{children}</CacheProvider>;
}
