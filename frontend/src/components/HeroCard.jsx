import '../App.css'

export default function HeroCard({ id, name, imgSrc }) {
	return (
		<div key={id} className="hero-card card border-danger h-100">
			<img src={imgSrc} className="hero-card-img" alt="hero image"></img>
			<div className="card-footer text-center text-bold text-danger p-2">
				<h5 className="card-title">{name}</h5>
			</div>
		</div>
	)
}