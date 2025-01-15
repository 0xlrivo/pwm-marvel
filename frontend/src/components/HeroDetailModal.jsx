import { useEffect, useState } from "react";

export default function HeroDetailModal({ show, onClose, title, card }) {
    if (!show) return null; // Non renderizzare nulla se il modal non è visibile

    const [additionalData, setAdditionalData] = useState(null)

    const getHeroData = async () => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        };
        let response = await fetch(
            `http://localhost:3000/api/album/getCharacterById/${card.id}/full`,
            options
        );
        if (response.ok) {
            response = await response.json();
            setAdditionalData({
                comics: response.comics,
                stories: response.stories,
                series: response.series
            })
        }
    };

    // fetch additional cards data when shown
    useEffect(() => {
        getHeroData()
    }, [show == true])

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" aria-labelledby="packetContentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-dark" id="packetContentModalLabel">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body text-dark">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <h5 className="text-dark">Description</h5>
                                    <textarea
                                        className="form-control"
                                        value={card.description} 
                                        readOnly
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <h5 className="text-dark">{`Comics (${additionalData ? additionalData.comics.number: "x"})`}</h5>
                                    <textarea
                                        className="form-control"
                                        value={additionalData ? additionalData.comics.items.join('\n') : ""}
                                        readOnly
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                <h5 className="text-dark">{`Stories (${additionalData ? additionalData.stories.number: "x"})`}</h5>
                                    <textarea
                                        className="form-control"
                                        value={additionalData ? additionalData.stories.items.join('\n') : ""} // Esempio di valore
                                        readOnly
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                <h5 className="text-dark">{`Series (${additionalData ? additionalData.series.number: "x"})`}</h5>
                                    <textarea
                                        className="form-control"
                                        value={additionalData ? additionalData.series.items.join('\n') : ""} // Esempio di valore
                                        readOnly
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Seconda colonna con l'immagine */}
                            <div className="col-md-6 text-center">
                                <img
                                    src={`${card.thumbnail.path}.${card.thumbnail.extension}`}
                                    style={{
                                        width: '500px',
                                        height: '500px', 
                                        objectFit: 'cover', 
                                    }}
                                    alt={card.name}
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
