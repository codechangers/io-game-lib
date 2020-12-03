/** @module publish */
/* eslint-disable no-console */

const fs = require('fs');

function tagMd({ name, type, description }) {
  const nameMd = name ? `**${name}**: ` : '';
  const typeMd = type.names.length > 0 ? `\`${type.names.join('/')}\` ` : '';
  const descriptionMd = description ? `- ${description}` : '';
  return nameMd + typeMd + descriptionMd;
}

function paramsMd(params) {
  return params.map(tagMd).join('\n\n') || '**None**';
}

function returnsMd(returns) {
  return (
    returns
      .filter((ret) => ret.type.names.join('/') !== 'void')
      .map(tagMd)
      .join('\n\n') || '**Nothing**'
  );
}

const getDocumentation = ({ name, description, params, returns, tags }) =>
  `---
title: ${name}
subtitle: "${description}"
tags: [${tags ? tags.map((t) => t.text).join(', ') : ''}]
author: jason
---

## Parameters

${paramsMd(params)}

## Returns

${returnsMd(returns)}
`;

const getInfo = (fName) =>
  new Promise((resolve, reject) => {
    fs.readFile(`./docs/info/${fName}`, 'utf8', (err, data) => {
      if (err && err.errno === -2) resolve('');
      else if (err) reject(err);
      else resolve(data);
    });
  });

let totalDocs;
let count = 0;
async function createDocFile(doclet) {
  if (!doclet.undocumented && doclet.kind === 'function') {
    const fName = `${doclet.name}.md`;
    console.log(`    funcs/${fName}`);
    const info = await getInfo(fName);
    fs.writeFile(
      `./docs/funcs/${fName}`,
      `${getDocumentation(doclet)}\n${info}`,
      (err) => err !== null && console.error(err)
    );
  }
  count += 1;
  if (count === totalDocs) console.log('\n * Finished!\n');
}

/**
 * Generate documentation output.
 *
 * @param {TAFFY} data - A TaffyDB collection representing
 *                       all the symbols documented in your code.
 */
exports.publish = function (data) {
  console.log(' * Generating Documentation...\n');
  totalDocs = data().count();
  data().each(createDocFile);
};
