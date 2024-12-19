export default function TradeRow({ idx, tradeId, offer, request }) {

    const fillTrade = async () => {
        
    }

    // @todo scegliere un modo in cui mostrare offerta/richiesta del trade

    return (
        <tr>
            <th scope="row">{idx}</th>
            <td></td>
            <td></td>
            <td>
                <button className="btn btn-success" onClick={async () => {await fillTrade()}}>FILL</button>
            </td>
        </tr>
    )
}