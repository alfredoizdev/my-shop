export const capitalize = (srt: string) => {
	const lower = srt.toLocaleLowerCase();
	return srt.charAt(0).toLocaleUpperCase() + lower.slice(1);
};
