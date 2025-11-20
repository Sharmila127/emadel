/* eslint-disable @typescript-eslint/no-explicit-any */
import secureStorage from 'react-secure-storage';

export const StoreLocalStorage = (key: string, data: any) => {
	secureStorage.setItem(key, data);
};

export const GetLocalStorage = (key: string) => {
	const data = secureStorage.getItem(key);
	if (!data) {
		return null;
	}
	return data;
};

export const RemoveLocalStorage = (key: string) => {
	secureStorage.removeItem(key);
};

export const ClearLocalStorage = () => {
	secureStorage.clear();
};
