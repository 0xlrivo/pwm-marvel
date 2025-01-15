import HeroCard from "./HeroCard"

export default function AlbumViewer({ pagination }) {

    return (
        <div className="row row-cols-1 row-cols-md-5 g-4">
            {
                pagination
                    ? pagination.cards.slice(
                        pagination.curPage * 10,
                        (pagination.curPage * 10) + 10
                    ).map((item, idx) => {
                        return (
                            <div key={idx} className="col">
                                <HeroCard itemKey={idx} id={item.id} name={item.name} description={item.description} imgSrc={`${item.thumbnail.path}.${item.thumbnail.extension}`} />
                            </div>
                        )
                    })
                    : ""
            }
        </div>
    )
}