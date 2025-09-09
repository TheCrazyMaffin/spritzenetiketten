// Utility code snippets for working with the data

// Statistics (requires lodash)
let str = '';
_.forEach(data.groups, (g) => {
  str += `|${g.name}|`;
  str += `${g.medications.length}|${_.sum(_.map(g.medications, (m) => m.variations.length))}|`;
  str += '\n';
});


str = `|**Gesamt**|${_.flatten(_.map(data.groups, g => g.medications)).length}|${_.flatten(_.map(_.flatten(_.map(data.groups, g => g.medications)), m => m.variations)).length}|` + str