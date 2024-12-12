import MD5 from "crypto-js/md5";
const MARVEL_PUBKEY = process.env.MARVEL_PUBKEY
const MARVEL_PRIVKEY = process.env.MARVEL_PRIVKEY
const BASE_URL = 'https://gateway.marvel.com'

/*
 * GET a single character
 * GET multiple characters
 */

const baseMarvelRequest = async(route, params) => {
	// construct base request
	const timestamp = '123'
	const hash = MD5(`${timestamp}+${MARVEL_PRIVKEY}+${MARVEL_PUBKEY}`) 
	const url =	 `${BASE_URL}/${route}?ts=${timestamp}&api_key=${MARVEL_PUBKEY}&hash=${hash}`	
	
	// append any other additional parameters
	if (params && params.length > 0) {
		for (p in params) {
			url += `&${p}`
		}
	}

	const response = await fetch(url)
	if (response.ok) {
		return await response.json()
	} else {
		console.log(response.status)
	}
}

const marvelController = {
	
	async getCharacterById(id) {
		try {
			const response = await fetch(`${BASE_URL}/`)	
		} catch (err) {
			console.log(err)
			return err
		}
	}

}

export { marvelController }
