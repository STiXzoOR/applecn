import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@applecn/ui/components/breadcrumb"

export default function BreadcrumbBasic() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Macintosh HD</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Users</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Shared</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Documents</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
