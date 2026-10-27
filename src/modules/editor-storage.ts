import { LabelComposition, labelCompositionSchema } from "@/modules/data-schema/directory"

const storageKey = "editor.composition"

/**
 * Parses and validates a serialized label composition. Returns undefined if it is invalid.
 */
export function parseComposition(json: string): LabelComposition | undefined {
  try {
    const result = labelCompositionSchema.safeParse(JSON.parse(json))
    if (result.success) return result.data
    console.error("[parseComposition] Invalid label composition", result.error)
  } catch (error) {
    console.error("[parseComposition] Invalid JSON", error)
  }
  return undefined
}

// localStorage throws when site data is blocked (e.g. some private browsing modes). The editor still works then, it just doesn't persist.

export function loadEditorComposition() {
  try {
    const value = localStorage.getItem(storageKey)
    return value ? parseComposition(value) : undefined
  } catch (error) {
    console.error("[loadEditorComposition] Storage unavailable", error)
    return undefined
  }
}

export function saveEditorComposition(composition: LabelComposition) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(composition))
  } catch (error) {
    console.error("[saveEditorComposition] Storage unavailable", error)
  }
}
