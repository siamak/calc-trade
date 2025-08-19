import { toast as sonnerToast } from "sonner";

export function useToast() {
	return {
		toast: ({
			title,
			description,
			...props
		}: {
			title?: string;
			description?: string;
			[key: string]: any;
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
