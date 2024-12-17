export default function HeroCard({ id, name, description, imgSrc }) {
	return (
		<div className="card border-danger h-100">
			<img src={imgSrc} className="hero-card-img" alt="hero image"></img>
			<div className="card-body">
				<h5 className="card-title">{name}</h5>
				<p className="card-text">{description}</p>
			</div>
			<div className="card-footer">
				<button type="button" className="btn btn-primary">Info</button>
			</div>
		</div>
	)
}