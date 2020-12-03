/** @module publish */

const fs = require('fs');

function paramsMd(params) {
  const md = params
    .map(
      ({ name, type, description }) =>
        `**${name}** \`${type.names.join('/')}\` - ${description}`
    )
    .join('\n\n');
  return md === '' ? '**None**' : md;
}

function returnsMd(returns) {
  const md = returns
    .filter((ret) => ret.type.names.join('/') !== 'void')
    .map(
      ({ type, description }) => `\`${type.names.join('/')}\` - ${description}`
    )
    .join('\n\n');
  return md === '' ? '**Nothing**' : md;
}

const getDocumentation = ({ name, description, params, returns }) =>
  `---
title: ${name}
subtitle: '${description}'
tags: []
author: jason
---

## Parameters
${paramsMd(params)}

## Returns
${returnsMd(returns)}
`;

function createDocFile(doclet) {
  if (!doclet.undocumented && doclet.kind === 'function') {
    console.log(`    funcs/${doclet.name}.md`);
    fs.writeFile(
      `./docs/funcs/${doclet.name}.md`,
      getDocumentation(doclet),
      (err) => err !== null && console.error(err)
    );
  }
}

/**
 * Generate documentation output.
 *
 * @param {TAFFY} data - A TaffyDB collection representing
 *                       all the symbols documented in your code.
 */
exports.publish = function (data) {
  console.log('\n\nCreating Documentation Files:\n');
  data().each(createDocFile);
  console.log('\nFinished!\n\n');
};
