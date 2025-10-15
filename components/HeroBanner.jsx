import config from '../site.config.json'
import Flourish from './Flourish'

export default function HeroBanner(){
  const video = config.heroVideo
    if(video && video.endsWith('.mp4')){
    return (
      <section className="relative">
        <video className="w-full h-96 object-cover" autoPlay muted loop playsInline>
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30 flex items-center">
          <div className="container text-white">
            <h1 className="text-4xl font-bold heading">{config.name}</h1>
            <Flourish className="w-48" />
            <p className="mt-2 lead">Traditional pooja items, curated with care.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cover bg-center" style={{backgroundImage: `url('${config.hero}')`}}>
      <div className="bg-black/25">
        <div className="container py-20 text-white kp-decorative">
          <h1 className="text-4xl font-bold heading">{config.name}</h1>
          <Flourish className="w-48" />
          <p className="mt-2 lead">Traditional pooja items, curated with care.</p>
        </div>
      </div>
    </section>
  )
}
