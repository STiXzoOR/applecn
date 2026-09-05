import { codeToHtml } from "shiki"

export async function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string
  lang?: "tsx" | "bash" | "css" | "json"
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  return (
    <div
      data-slot="code-block"
      className="max-h-[32rem] overflow-auto rounded-3xl bg-card p-4 font-mono type-footnote [&_code]:font-mono [&_pre]:bg-transparent!"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
