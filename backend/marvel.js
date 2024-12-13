import MD5 from "crypto-js/md5.js";
const MARVEL_PUBKEY = process.env.MARVEL_PUBKEY
const MARVEL_PRIVKEY = process.env.MARVEL_PRIVKEY
const BASE_URL = 'https://gateway.marvel.com/v1/public'

/*
 * GET a single character
 * GET multiple characters
 */

// params = [{name: "hulk"}] 
const baseMarvelRequest = async(route, params) => {
	// construct base request
	const timestamp = Date.now() 
	const hash = MD5(`${timestamp}${MARVEL_PRIVKEY}${MARVEL_PUBKEY}`) 
	let url =	`${BASE_URL}${route}?ts=${timestamp}&apikey=${MARVEL_PUBKEY}&hash=${hash}`	
	
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
	
	async getCharacterById(id) {
		try {
			let resp = await baseMarvelRequest(`/characters/${id}`)
			resp = resp.data.results[0]
			return {
				id: resp.id,
				name: resp.name,
				description: resp.description,
				thumbnail: resp.thumbnail
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
			const resp = await baseMarvelRequest('/characters', [{'name': name}])
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
	}
}

export { marvelController }
