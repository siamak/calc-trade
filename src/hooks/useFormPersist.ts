import { useEffect } from "react";

// type IProps = {
// 	storage: false | Storage;
// 	exclude: string[];
// 	include: string[];
// 	onDataRestored: (data: { [key: string]: string }) => void;
// 	validate: boolean;
// 	dirty: boolean;
// };

const useFormPersist = (
	name: string,
	{ watch, setValue }: any,
	{
		storage,
		exclude = [],
		include,
		onDataRestored,
		validate = false,
		dirty = false,
	}: any = {}
) => {
	const values = watch(include);
	const getStorage = () => storage || window.sessionStorage;

	useEffect(() => {
		const str = getStorage().getItem(name);
		if (str) {
			const values = JSON.parse(str);
			const dataRestored: { [key: string]: string } = {};

			Object.keys(values).forEach((key) => {
				const shouldSet = !exclude.includes(key);
				if (shouldSet) {
					dataRestored[key] = values[key];
					setValue(key, values[key], {
						shouldValidate: validate,
						shouldDirty: dirty,
					});
				}
			});

			if (onDataRestored) {
				onDataRestored(dataRestored);
			}
		}
	}, [name]);

	useEffect(() => {
		getStorage().setItem(name, JSON.stringify(values));
	});

	return {
		clear: () => getStorage().removeItem(name),
	};
};

export default useFormPersist;
