'use client'

// TODO: scroll-video clip pending — see REFERENCE.md §2
// To activate:
//   1. Set enabled: true in clientConfig.home.sections
//   2. Place the video clip at config.videoSrc (e.g. /assets/demo/tour-clip.mp4)
//   3. Uncomment the GSAP scrub block below — zero other changes required.

import { useRef } from 'react'
import type { ScrollVideoSectionConfig } from '@/types'

export function ScrollVideoSection({ config }: { config: ScrollVideoSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll-scrub: maps scroll progress to video.currentTime
  // useEffect(() => {
  //   const video = videoRef.current
  //   if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  //   video.pause()
  //   const st = ScrollTrigger.create({
  //     trigger: sectionRef.current,
  //     start: 'top top',
  //     end: '+=280%',
  //     pin: true,
  //     anticipatePin: 1,
  //     scrub: true,
  //     onUpdate: (self) => {
  //       if (video.duration) video.currentTime = self.progress * video.duration
  //     },
  //   })
  //   return () => st.kill()
  // }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Видео аялал"
      style={{ height: '280svh' }}
    >
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: '100svh', backgroundColor: 'var(--bg-dark)' }}
      >
        <video
          ref={videoRef}
          src={config.videoSrc}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          aria-hidden
        />
      </div>
    </section>
  )
}
