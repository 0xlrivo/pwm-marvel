export default function PacketContentModal({ show, onClose, title, packetContent }) {
    if (!show) return null; // Non renderizzare nulla se il modal non è visibile

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" aria-labelledby="packetContentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl"> {/* Aggiungi modal-lg per larghezza maggiore */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="packetContentModalLabel">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {packetContent.length > 0 ? (
                            <div className="d-flex flex-row overflow-auto">
                                {packetContent.map((card, idx) => (
                                    <div
                                        key={idx}
                                        className="card mx-2"
                                        style={{
                                            width: "15rem", // Aumenta la larghezza della carta
                                            border: "none"
                                        }}
                                    >
                                        <img
                                            src={`${card.thumbnail.path}.${card.thumbnail.extension}`}
                                            className="card-img-top"
                                            alt={card.name}
                                            style={{ height: "15rem", objectFit: "cover", border: card.isDuplicate ? "2px solid red" : "2px solid green",}} // Imposta un'altezza per le immagini
                                        />
                                        <div className="card-body">
                                            <h5
                                                className="card-title"
                                                style={{ color: card.isDuplicate ? "red" : "green" }}
                                            >
                                                {card.name}
                                            </h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No cards in this packet.</p>
                        )}
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-primary mx-auto" onClick={onClose}>
                            Back to album
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
