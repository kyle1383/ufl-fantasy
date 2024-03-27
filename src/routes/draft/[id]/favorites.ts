import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const defaultValue: string[] = [];
const initialValue = browser ? window.localStorage.getItem('favorites') ?? JSON.stringify(defaultValue) : JSON.stringify(defaultValue);
 
const favorites = writable<string>(initialValue);
 
favorites.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('favorites', value);
  }
});
 
export default favorites;