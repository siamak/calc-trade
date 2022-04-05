import { useEffect } from "react";

const useFormPersist = (
	name: any,
	{ watch, setValue }: any,
	{ storage, exclude = [], include, onDataRestored, validate = false, dirty = false }: any = {}
) => {
	const values = watch(include);
	const getStorage = () => storage || window.sessionStorage;

	useEffect(() => {
		const str = getStorage().getItem(name);
		if (str) {
			const values = JSON.parse(str);
			const dataRestored: any = {};

			Object.keys(values).forEach((key) => {
				const shouldSet = !exclude.includes(key);
				if (shouldSet) {
					dataRestored[key] = values[key];
					setValue(key, values[key], { shouldValidate: validate, shouldDirty: dirty });
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
