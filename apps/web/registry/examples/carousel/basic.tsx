import { Carousel, CarouselItem } from "@applecn/ui/components/carousel"
import { Text } from "@applecn/ui/components/text"

const shelves = [
  ["Now Playing", "var(--system-pink)", "var(--system-orange)"],
  ["New Music", "var(--system-blue)", "var(--system-indigo)"],
  ["Chill", "var(--system-mint)", "var(--system-teal)"],
  ["Workout", "var(--system-red)", "var(--system-yellow)"],
  ["Focus", "var(--system-purple)", "var(--system-blue)"],
]

export default function CarouselBasic() {
  return (
    <Carousel aria-label="Playlists" pages={shelves.length}>
      {shelves.map(([title, from, to]) => (
        <CarouselItem key={title} className="w-[70%] sm:w-[45%]">
          <div
            className="flex aspect-[4/3] items-end rounded-card p-4 text-white shadow-lift"
            style={{
              backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
            }}
          >
            <Text variant="title-3" emphasized color="inherit">
              {title}
            </Text>
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  )
}
