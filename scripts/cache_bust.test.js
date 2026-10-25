// node --test scripts/cache_bust.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { tag } = require('./cache_bust.js');

const cases = {
  'tags a relative script': ['<script src="../../js/dating-guide.js"></script>', '<script src="../../js/dating-guide.js?v=abc1234"></script>'],
  'tags a root-relative stylesheet': ['<link rel="stylesheet" href="/css/style.css">', '<link rel="stylesheet" href="/css/style.css?v=abc1234">'],
  'leaves an external script alone': ['<script src="https://www.googletagmanager.com/gtag/js?id=G-1"></script>', '<script src="https://www.googletagmanager.com/gtag/js?id=G-1"></script>'],
  'leaves a protocol-relative script alone': ['<script src="//cdn.example.com/a.js"></script>', '<script src="//cdn.example.com/a.js"></script>'],
  'leaves an already tagged asset alone': ['<script src="js/app.js?v=old"></script>', '<script src="js/app.js?v=old"></script>'],
  'leaves page links alone': ['<a href="labs/dating/apps.html">Apps</a>', '<a href="labs/dating/apps.html">Apps</a>'],
};

for (const [name, [html, want]] of Object.entries(cases)) {
  test(name, () => assert.equal(tag(html, 'abc1234'), want));
}
