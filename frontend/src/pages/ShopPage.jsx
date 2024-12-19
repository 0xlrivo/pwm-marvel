export default function ShopPage() {

    const openPacket = async() => {
        const options = {
            method: 'POST', // @note why POST, me stesso che ha scritto il backend?
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth-token'),
                'Accept': 'application/json',
            },
        }
        const resp = await fetch(`http://localhost:3000/api/album/openPacket`, options)
        if (resp.ok) {
            const content = await resp.json()
            console.log(content)
        }
    }

    return (
        <>
            <h1>Shop</h1><br/>
            <button type="button" className="btn btn-warning" onClick={async() => {await openPacket()}}>BUY PACKET</button>
        </>
    )

}