import { toast as sonnerToast, type ExternalToast } from "sonner";

export function useToast() {
	return {
		toast: ({
			title,
			description,
			...props
		}: ExternalToast & {
			title?: string;
			description?: string;
		}) => {
			if (description) {
				return sonnerToast(title, { description, ...props });
			}
			return sonnerToast(title || "", props);
		},
		dismiss: (toastId?: string) => {
			if (toastId) {
				sonnerToast.dismiss(toastId);
			} else {
				sonnerToast.dismiss();
			}
		},
	};
}

export { toast } from "sonner";
