import { useState } from "react";
import HeroCard from "./HeroCard";
import HeroDetailModal from "./HeroDetailModal";

export default function AlbumViewer({ pagination }) {
    const [selectedCard, setSelectedCard] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = (card) => {
        console.log(card)
        setSelectedCard(card); // Imposta la carta selezionata
        setShowModal(true); // Mostra il modal
    };

    return (
        <>
            <div className="row row-cols-1 row-cols-md-5 g-4">
                {
                    pagination
                        ? pagination.cards.slice(
                            pagination.curPage * 10,
                            (pagination.curPage * 10) + 10
                        ).map((item, idx) => (
                            <div key={idx} className="col">
                                <HeroCard
                                    itemKey={idx}
                                    id={item.id}
                                    name={item.name}
                                    imgSrc={`${item.thumbnail.path}.${item.thumbnail.extension}`}
                                    onClick={() => handleCardClick(item)} // Passa la carta selezionata al modal
                                />
                            </div>
                        ))
                        : ""
                }
            </div>

            {/* Modal per visualizzare i dettagli della carta */}
            <HeroDetailModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={selectedCard ? selectedCard.name : ""}
                card={selectedCard} // Passa la carta selezionata al modal
            />
        </>
    );
}
