import "../../public/style.css"

export default function HeroCard({ id, name, imgSrc, onClick }) {
	return (
		<div key={id} className="hero-card card border-danger h-100" onClick={onClick}>
			<img src={imgSrc} className="hero-card-img" alt="hero image"></img>
			<div className="card-footer text-center text-bold text-danger p-2">
				<h5 className="card-title">{name}</h5>
			</div>
		</div>
	)
}