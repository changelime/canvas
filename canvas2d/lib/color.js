export function hashToRgb(hash){
	return (hash = hash.slice(1)) && `rgb(${[0, 2, 4].map((i)=> parseInt(hash.substr(i, 2), 16)).join()})`;
};
export function hashToRgba(hash, a){
	return (hash = hash.slice(1)) && `rgba(${[0, 2, 4].map((i)=> parseInt(hash.substr(i, 2), 16)).join()}, ${a})`;
};
export function rgbToHash(r, g, b){
	return `#${[r, g, b].map((num)=> num < 16 ? "0" + num.toString(16) : num.toString(16)).join("")}`;
};
export function randomHash(){
	return `#${[].map.call("ffffff", ()=> (~~(Math.random() * 16)).toString(16)).join("")}`;
};
export default {
	hashToRgb,
	hashToRgba,
	rgbToHash,
	randomHash
};