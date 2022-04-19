import { Button, useColorMode } from "@chakra-ui/react";

export default function ThemeSwitcher() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Button mt={3} isFullWidth outline={0} onClick={toggleColorMode}>
			{colorMode === "light" ? (
				<svg
					version="1.1"
					viewBox="0 0 24 24"
					width={24}
					height={24}
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<g fill={"#1f39c7"}>
						<path d="M9.00068 18.9999c0 .84.13 1.66.37 2.42 -3.84-1.33-6.74-4.86-7.04-8.99 -.3-4.39003 2.23-8.49003 6.32-10.21 1.06-.44 1.60002-.12 1.83002.11 .22.22.53.75.09 1.76 -.45 1.04-.67002 2.14-.67002 3.28 .01 2.04.81002 3.93003 2.11002 5.38003 -1.83 1.46-3.01002 3.72-3.01002 6.25Z" />
						<path
							opacity=".40"
							d="M21.21 17.72c-1.98 2.69-5.12 4.27-8.47 4.27 -.16 0-.32-.01-.48-.02 -1-.04-1.97-.23-2.89-.55 -.24-.76-.37-1.58-.37-2.42 0-2.53 1.18-4.79 3.01-6.25 1.47 1.65 3.58 2.72 5.91 2.82 .63.03 1.26-.02 1.88-.13 1.12-.2 1.57.22 1.73.49 .17.27.35.86-.32 1.79Z"
						/>
					</g>
				</svg>
			) : (
				<svg
					version="1.1"
					viewBox="0 0 24 24"
					width={24}
					height={24}
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
				>
					<g fill={"#FFDB7E"}>
						<path
							opacity=".90"
							d="M12 19c3.866 0 7-3.134 7-7 0-3.86599-3.134-7-7-7 -3.86599 0-7 3.13401-7 7 0 3.866 3.13401 7 7 7Z"
						/>
						<path d="M12 22.96c-.55 0-1-.41-1-.96v-.08c0-.55.45-1 1-1 .55 0 1 .45 1 1 0 .55-.45 1.04-1 1.04Zm7.14-2.82c-.26 0-.51-.1-.71-.29l-.13-.13c-.39-.39-.39-1.02 0-1.41 .39-.39 1.02-.39 1.41 0l.13.13c.39.39.39 1.02 0 1.41 -.19.19-.44.29-.7.29Zm-14.28 0c-.26 0-.51-.1-.71-.29 -.39-.39-.39-1.02 0-1.41l.13-.13c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-.13.13c-.19.19-.45.29-.7.29Zm17.14-7.14h-.08c-.55 0-1-.45-1-1 0-.55.45-1 1-1 .55 0 1.04.45 1.04 1 0 .55-.41 1-.96 1Zm-19.92 0h-.08c-.55 0-1-.45-1-1 0-.55.45-1 1-1 .55 0 1.04.45 1.04 1 0 .55-.41 1-.96 1Zm16.93-7.01c-.26 0-.51-.1-.71-.29 -.39-.39-.39-1.02 0-1.41l.13-.13c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-.13.13c-.19.19-.44.29-.7.29Zm-14.02 0c-.26 0-.51-.1-.71-.29l-.13-.14c-.39-.39-.39-1.02 0-1.41 .39-.39 1.02-.39 1.41 0l.13.13c.39.39.39 1.02 0 1.41 -.19.2-.45.3-.7.3Zm7.01-2.95c-.55 0-1-.41-1-.96v-.08c0-.55.45-1 1-1 .55 0 1 .45 1 1 0 .55-.45 1.04-1 1.04Z" />
					</g>
				</svg>
			)}
		</Button>
	);
}
