import type { FormulaToken } from "./FormulaBuilder"

export function tokensToString(tokens: FormulaToken[]): string {
  return tokens
    .map((t) => {
      switch (t.kind) {
        case "field":
          return `{${t.fieldName}}`
        case "operator":
          return ` ${t.value} `
        case "number":
          return t.value
        case "paren":
          return t.value
        case "function":
          return `${t.name}(${tokensToString(t.args)})`
      }
    })
    .join("")
    .trim()
}

export function stringToTokens(formula: string): FormulaToken[] {
  // Naive parser — good enough for editing saved formulas
  // Handles {field}, operators, numbers, parens. Functions are best-effort.
  const tokens: FormulaToken[] = []
  const re = /(\{[^}]+\}|>=|<=|==|!=|[+\-*\/=<>()]|\d+\.?\d*)/g
  let match: RegExpExecArray | null
  let lastIndex = 0
  while ((match = re.exec(formula)) !== null) {
    // skip whitespace between matches
    lastIndex = match.index
    const raw = match[0]
    if (raw.startsWith("{") && raw.endsWith("}")) {
      const name = raw.slice(1, -1)
      tokens.push({ kind: "field", fieldId: name, fieldName: name, fieldType: "" })
    } else if (/^[+\-*\/=<>!]+$/.test(raw)) {
      tokens.push({ kind: "operator", value: raw })
    } else if (/^\d/.test(raw)) {
      tokens.push({ kind: "number", value: raw })
    } else if (raw === "(" || raw === ")") {
      tokens.push({ kind: "paren", value: raw })
    }
  }
  return tokens
}