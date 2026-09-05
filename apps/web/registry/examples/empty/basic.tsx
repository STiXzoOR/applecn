import { Search01Icon } from '@hugeicons/core-free-icons'

import { Button } from '@apple-ds/ui/components/button'
import { Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from '@apple-ds/ui/components/empty'

export default function EmptyBasic() {
  return (
    <Empty>
      <EmptyIcon icon={Search01Icon} />
      <EmptyTitle>No Results</EmptyTitle>
      <EmptyDescription>Check the spelling or try a new search.</EmptyDescription>
      <EmptyActions>
        <Button variant="tinted" size="small">
          Clear Search
        </Button>
      </EmptyActions>
    </Empty>
  )
}
