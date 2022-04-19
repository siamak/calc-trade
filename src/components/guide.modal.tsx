import {
	Text,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GuideModal() {
	const t = useTranslations("guide_modal");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const { locale } = router;

	useEffect(() => {
		const isSeen =
			window.localStorage.getItem(`@guide_modal_${locale}`) === "true";

		if (!isSeen) {
			window.localStorage.setItem(`@guide_modal_${locale}`, "true");
			onOpen();
		}
	}, []);

	return (
		<>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<Text
						position={"absolute"}
						top={-9}
						transform="translateX(-50%)"
						left={"50%"}
					>
						<Image
							src={"/icon.png"}
							alt="Money icon"
							quality={100}
							width={80}
							height={80}
						/>
					</Text>
					<ModalCloseButton />
					<ModalBody>
						<Text
							fontWeight={700}
							letterSpacing={-1}
							fontSize="3xl"
							mt={8}
							textAlign={"center"}
						>
							{t("title")}
						</Text>
						<Text
							maxW={"300px"}
							textAlign={"center"}
							// fontSize="sm"
							mx="auto"
							my={2}
							opacity={0.6}
						>
							{t("subtitle")}
						</Text>
						<Text fontSize="sm" mt={4} opacity={0.9}>
							{t("description")}
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme={"purple"} isFullWidth onClick={onClose}>
							{t("cta")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
