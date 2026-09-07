import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

import { Rating } from "../src/components/rating"

describe("Rating", () => {
  test("shows a read-only rating as five stars with the value announced", () => {
    render(<Rating value={3.5} label="Rating" />)
    const meter = screen.getByRole("img", { name: "Rating: 3.5 out of 5" })
    expect(meter).toHaveAttribute("data-slot", "rating")
    expect(meter.querySelectorAll('[data-slot="rating-star"]')).toHaveLength(5)
  })

  test("an interactive rating is a radio group of stars that keyboard users can move through", async () => {
    const onChange = vi.fn()
    render(<Rating value={2} label="Your rating" onValueChange={onChange} />)
    const group = screen.getByRole("radiogroup", { name: "Your rating" })
    expect(group).toHaveAttribute("data-slot", "rating")
    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(5)
    expect(radios[1]).toHaveAttribute("aria-checked", "true")
    await userEvent.click(radios[3]!)
    expect(onChange).toHaveBeenCalledWith(4)
    radios[1]!.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onChange).toHaveBeenCalledWith(3)
  })
})
