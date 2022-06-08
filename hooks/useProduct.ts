import { IProduct } from "interfaces/products";
import useSWR, { SWRConfiguration } from "swr";
// const fetcher = (...args: [keys: string]) =>
// 	fetch(...args).then((res) => res.json());

export const useProduct = (url: string, config: SWRConfiguration = {}) => {
	//const { data, error } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);
	const { data, error } = useSWR<IProduct[]>(`/api${url}`, config);

	return {
		products: data || [],
		isLoading: !data && !error,
		isError: error,
	};
};
