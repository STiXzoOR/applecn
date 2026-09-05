import { Skeleton } from '@apple-ds/ui/components/skeleton'

export default function SkeletonBasic() {
  return (
    <div className="flex max-w-sm items-center gap-3 rounded-4xl bg-card p-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}
