import { AspectRatio } from "@applecn/ui/components/aspect-ratio"

const frames = [
  { ratio: 16 / 9, label: "16:9", from: "#0a84ff", to: "#5e5ce6" },
  { ratio: 4 / 3, label: "4:3", from: "#ff375f", to: "#ff9f0a" },
  { ratio: 1, label: "1:1", from: "#30d158", to: "#0a84ff" },
]

export default function AspectRatioBasic() {
  return (
    <div className="grid w-full max-w-lg grid-cols-3 gap-3">
      {frames.map(({ ratio, label, from, to }) => (
        <AspectRatio
          key={label}
          ratio={ratio}
          className="overflow-hidden rounded-card"
        >
          <div
            className="flex size-full items-center justify-center type-footnote font-semibold text-white"
            style={{
              backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
            }}
          >
            {label}
          </div>
        </AspectRatio>
      ))}
    </div>
  )
}
