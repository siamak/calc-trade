import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from "next/document";
class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		const { locale } = this.props.__NEXT_DATA__;
		const dir = locale === "fa" ? "rtl" : "ltr";
		return (
			<Html>
				<Head>
					{dir === "rtl" && (
						<link
							href="https://cdnjs.cloudflare.com/ajax/libs/vazir-font/30.1.0/UI/Farsi-Digits/font-face-FD-UI.min.css"
							rel="stylesheet"
						/>
					)}

					{dir === "ltr" && (
						<>
							<link rel="preconnect" href="https://fonts.googleapis.com" />
							<link
								rel="preconnect"
								href="https://fonts.gstatic.com"
								crossOrigin=""
							/>
							<link
								href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
								rel="stylesheet"
							/>
						</>
					)}
					{/*
					<script
						async
						src="https://www.googletagmanager.com/gtag/js?id=G-FDNZT3M442"
					/>

					<script
						dangerouslySetInnerHTML={{
							__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FDNZT3M442', { page_path: window.location.pathname });
            `,
						}}
					/> */}
				</Head>

				<body dir={dir} lang={locale}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
