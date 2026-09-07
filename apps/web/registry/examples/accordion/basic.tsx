"use client"

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@applecn/ui/components/accordion"

export default function AccordionBasic() {
  return (
    <Accordion className="max-w-md" defaultValue={["warranty"]}>
      <AccordionItem value="warranty">
        <AccordionTrigger>What does AppleCare+ cover?</AccordionTrigger>
        <AccordionPanel>
          Unlimited incidents of accidental damage protection, battery service
          and priority access to Apple experts.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="trade">
        <AccordionTrigger>How does Apple Trade In work?</AccordionTrigger>
        <AccordionPanel>
          Answer a few questions about your device to get an estimate, then
          apply it to a new purchase or receive an Apple Gift Card.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="delivery">
        <AccordionTrigger>Can I pick up in store?</AccordionTrigger>
        <AccordionPanel>
          Choose Pick Up at checkout and collect at an Apple Store the same day,
          or get it delivered free.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
