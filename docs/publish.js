/** @module publish */

const fs = require('fs');

function tagMd({ name, type, description }) {
  const nameMd = name ? `**${name}** ` : '';
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
