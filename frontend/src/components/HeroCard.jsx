export default function HeroCard({ id, name, description, imgSrc }) {
	return (
		<div key={id} className="card border-danger h-100">
			<img src={imgSrc} className="hero-card-img" alt="hero image"></img>
			<div className="card-footer text-center text-bold text-danger border-0">
				<h5 className="card-title">{name}</h5>
			</div>
		</div>
	)
}