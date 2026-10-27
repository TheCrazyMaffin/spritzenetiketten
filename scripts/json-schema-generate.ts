import { writeFileSync } from "node:fs";
import path from "node:path";
import { labelDirectorySchema } from "../src/modules/data-schema/directory.js";

const schema = JSON.stringify(labelDirectorySchema.toJSONSchema())
const loc = path.join(process.cwd(), `/src/data/label-directory.schema.json`)
writeFileSync(loc, schema)