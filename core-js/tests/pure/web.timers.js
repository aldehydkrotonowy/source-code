import { timeLimitedPromise } from '../helpers/helpers';

import { setTimeout, setInterval } from 'core-js-pure';

QUnit.test('setTimeout / clearTimeout', assert => {
  assert.expect(2);

  timeLimitedPromise(1e3, resolve => {
    setTimeout((a, b) => { resolve(a + b); }, 10, 'a', 'b');
  }).then(it => {
    assert.strictEqual(it, 'ab', 'setTimeout works with additional args');
  }).catch(() => {
    assert.ok(false, 'setTimeout works with additional args');
  }).then(assert.async());

  timeLimitedPromise(50, resolve => {
    clearTimeout(setTimeout(resolve, 10));
  }).then(() => {
    assert.ok(false, 'clearImmediate works with wraped setTimeout');
  }).catch(() => {
    assert.ok(true, 'clearImmediate works with wraped setTimeout');
  }).then(assert.async());
});

QUnit.test('setInterval / clearInterval', assert => {
  assert.expect(1);

  timeLimitedPromise(1e4, (resolve, reject) => {
    let i = 0;
    const interval = setInterval((a, b) => {
      if (a + b !== 'ab' || i > 2) reject({ a, b, i });
      if (i++ === 2) {
        clearInterval(interval);
        setTimeout(resolve, 30);
      }
    }, 5, 'a', 'b');
  }).then(() => {
    assert.ok(true, 'setInterval & clearInterval works with additional args');
  }).catch(error => {
    if (!error) error = {};
    assert.ok(false, `setInterval & clearInterval works with additional args: ${ error.a }, ${ error.b }, times: ${ error.i }`);
  }).then(assert.async());
});
