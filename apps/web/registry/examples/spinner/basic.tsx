import { Spinner } from '@apple-ds/ui/components/spinner'

export default function SpinnerBasic() {
  return (
    <div className="flex items-center gap-6">
      <Spinner />
      <Spinner size="large" />
      <Spinner size="large" label="Syncing" className="text-primary" />
    </div>
  )
}
