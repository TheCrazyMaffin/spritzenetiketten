import { parse } from "yaml";
import labelDirectoryFile from "./label-directory.yaml?raw";
import { getOrInsert, isObject } from "@/modules/util";
import { LabelComposition, LabelDirectoryEntry, labelDirectorySchema } from "@/modules/data-schema/directory";

// Parse data from yaml file.
const labelDirectory = labelDirectorySchema.parse(parse(labelDirectoryFile, { maxAliasCount: 500 }));

// Read all labels and generate a map of available tag categories and their entries.
// Is used for quick filtering.
const tags = new Map<string, string[]>();
labelDirectory.labels.forEach((label) => {
  for (const tagName in label.tags) {
    const tagValue = label.tags[tagName];
    const existing = getOrInsert(tags, tagName, []);
    if (!existing.includes(tagValue)) {
      existing.push(tagValue);
      tags.set(tagName, existing.sort());
    }
  }
});

/**
 * Goes through the keys of the source object, if that key exists on the target and if it isnt an object
 * it assigns the source value to it.
 * If it is an object recursively calls assignDeep on it.
 * 
*/
export function assignDeep(target: { [key: string]: any }, source: { [key: string]: any }) {
  for (const key of Object.keys(source)) {
    if (isObject(source[key])) {
      if (!isObject(target[key])) target[key] = {}
      assignDeep(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

export class LabelDirectory {
  static readonly partials = labelDirectory.partials;
  static readonly labels = labelDirectory.labels;
  static readonly tags = tags;

  static resolveComposition(composition: LabelComposition | string): LabelComposition {
    if (typeof composition === "string") {
      const partial = LabelDirectory.partials[composition]
      if (!partial) throw new Error(`[computeLabel] Cannot find partial named "${composition}"`)
      return partial
    } else {
      return composition
    }
  }

  static computeLabel(label: LabelDirectoryEntry): LabelComposition {
    const result: LabelComposition = {}
    label.composition.forEach(composition => {
      assignDeep(result, LabelDirectory.resolveComposition(composition))
    })
    return structuredClone(result)
  }
}

for (const label of LabelDirectory.labels) {
  for (const composition of label.composition) {
    if (typeof composition === "string" && !(composition in LabelDirectory.partials)) {
      console.error(
        `Label "${label.name}" references unknown partial "${composition}"`,
      );
    }
  }
}

// Label names are used as keys when listing labels, so they have to be unique.
const labelNames = new Set<string>();
for (const label of LabelDirectory.labels) {
  if (labelNames.has(label.name)) {
    console.error(`Label name "${label.name}" is used more than once`);
  }
  labelNames.add(label.name);
}
