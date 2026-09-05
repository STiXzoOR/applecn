"use client"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@applecn/ui/components/field"
import { Input } from "@applecn/ui/components/input"

export default function FieldBasic() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" />
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Username</FieldLabel>
        <Input defaultValue="a" />
        <FieldError match>Choose at least three characters.</FieldError>
      </Field>
    </FieldGroup>
  )
}
