import { writeFileSync, readFileSync } from "fs"
import MD5 from "crypto-js/md5.js";
const MARVEL_PUBKEY = process.env.MARVEL_PUBKEY
const MARVEL_PRIVKEY = process.env.MARVEL_PRIVKEY
const BASE_URL = 'https://gateway.marvel.com/v1/public'

// caches hero requests after their first occurrence to increase perfomances
let hero_cache

const loadCacheOnStartup = () => {
	try {
		const json = readFileSync(process.env.HERO_CACHE_PATH, 'utf-8')
		const entries = JSON.parse(json)
		hero_cache = new Map(entries)
	} catch (err) {
		console.error("failed to load hero cache")
		hero_cache = new Map()
	}
}

const saveCacheOnShoutdown = () => {
	const json = JSON.stringify(Array.from(hero_cache.entries()), null, 2)
	writeFileSync(process.env.HERO_CACHE_PATH, json, 'utf-8')
	console.log("[INFO] hero cache saved")
}

/*
 * GET a single character
 * GET multiple characters
 */

// params = [{name: "hulk"}] 
const baseMarvelRequest = async (route, params) => {
	// get current timestamp
	const timestamp = Date.now()
	// hash timestamp, pubkey and privkey
	const hash = MD5(`${timestamp}${MARVEL_PRIVKEY}${MARVEL_PUBKEY}`)
	// construct base URL without parameters
	let url = `${BASE_URL}${route}?ts=${timestamp}&apikey=${MARVEL_PUBKEY}&hash=${hash}`
	// add any additional parameters to the base url
	if (params) {
		for (let i = 0; i < params.length; i++) {
			url += `&${Object.keys(params[i])[0]}=${Object.values(params[i])[0]}`
		}
	}

	const response = await fetch(url)
	if (response.ok) {
		return await response.json()
	} else {
		return Error("Marvel request failed");
	}
}

const marvelController = {

	async getCharacterById(id, fullData) {
		try {
			let resp
			// check if this id is cached
			if (hero_cache.has(id)) {
				// no need to fetch marvel APIs, just return the cached data
				resp = hero_cache.get(id)
				console.log("responded with cached hero " + id)
			} else {
				// fetch marvel APIs
				resp = await baseMarvelRequest(`/characters/${id}`)
				resp = resp.data.results[0]
				// cache this id for future requests
				hero_cache.set(id, resp)
				console.log("first time requesting hero " + id)
			}

			if (!fullData) {
				// return only essential things
				return {
					id: resp.id,
					name: resp.name,
					thumbnail: resp.thumbnail
				}
			} else {
				return {
					id: resp.id,
					name: resp.name,
					description: resp.description,
					thumbnail: resp.thumbnail,
					comics: {
						number: resp.comics.available,
						items: resp.comics.items.map((c) => {
							return c.name
						})
					},
					stories: {
						number: resp.stories.available,
						items: resp.stories.items.map((s) => {
							return s.name
						})
					},
					series: {
						number: resp.series.available,
						items: resp.series.items.map((s) => {
							return s.name
						})
					}
				}
			}

		} catch (err) {
			// in case this id isn't associated with any hero
			if (err.name === "TypeError") return {
				id: -1
			}
		}
	},

	// fetch a list of characters from a list of ids
	async getCharactersByIds(ids) {
		try {
			let characters = []
			for (let i = 0; i < ids.length; i++) {
				let result = await this.getCharacterById(ids[i])
				characters.push(result)
			}
			return characters
		} catch (err) {
			console.log(err)
			return err
		}
	},

	// fetch all of the characthers with the mathcing name
	async getCharactersByName(name) {
		try {
			const resp = await baseMarvelRequest('/characters', [{ 'nameStartsWith': name }, { 'limit': 10 }])
			console.log(resp)
			let result = []
			for (const i of resp.data.results) {
				result.push({
					id: i.id,
					name: i.name,
					description: i.description,
					thumbnail: i.thumbnail
				})
			}
			return result
		} catch (err) {
			console.log(err)
			return err;
		}
	},

	async getRandomCharacters(count) {
		try {
			let result = []
			for (let i = 0; i < count; i++) {
				let resp = await baseMarvelRequest('/characters', [
					{ 'offset': Math.floor(Math.random() * 1500) },
					{ 'limit': 1 }
				])
				console.log(resp.data.results)
				resp = resp.data.results[0]
				result.push({
					id: resp.id,
					name: resp.name,
					description: resp.description,
					thumbnail: resp.thumbnail
				})
			}
			return result
		} catch (err) {
			return err
		}
	}
}

export { loadCacheOnStartup, saveCacheOnShoutdown, marvelController }
