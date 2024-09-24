import assert from 'assert';
import nock from 'nock';
import multipart from 'parse-multipart-data';

const thankYouMessage = 'thank you for submitting the form';

const scope = nock('http://localhost:3000')
  .post('/submit-success', function test(body) {
    // using a function syntax here instead of array because the this parameter is
    // set during the call
    const contentType = this.headers['content-type'];
    const boundary = contentType.match('multipart/form-data; boundary=(.+)')?.[1];
    const parts = multipart.parse(Buffer.from(body), boundary);
    assert.equal(parts.length, 2);
    const data = parts.reduce((acc, part) => ({
      ...acc,
      [part.name]: JSON.parse(part.data.toString()),
    }), {});
    assert.deepStrictEqual(data.data, { f1: '10', f2: '102', 'radio-group-boolean': true });
    return true;
  })
  .reply(200, {
    thankYouMessage,
  });

export const sample = {
  action: 'http://localhost:3000/submit-success',
  items: [{
    fieldType: 'text-input',
    id: 'text-input',
    name: 'f2',
    rules: {
      value: "f1 & '2'",
    },
  },
  {
    fieldType: 'text-input',
    id: 'text-input-2',
    name: 'f1',
    default: '10',
  },
  {
    fieldType: 'radio-group',
    id: 'radio-group-boolean',
    name: 'radio-group-boolean',
    type: 'boolean',
    enumNames: ['yes', 'no'],
  },
  {
    fieldType: 'button',
    id: 'button',
    events: {
      click: 'submitForm()',
    },
  }],
};

export function op(block) {
  const radio = block.querySelectorAll('input[name="radio-group-boolean"]')[0];
  radio.click();
  radio.dispatchEvent(new Event('change', { bubbles: true }));
  const btn = block.querySelector('#button');
  btn.click();
  const form = block.querySelector('form');
  form.dispatchEvent(new Event('submit'));
}

export function expect(block) {
  assert.equal(scope.isDone(), true, 'submit call was not made');
  const el = block.querySelector('.form-message.success-message');
  assert.equal(el.textContent, thankYouMessage);
  assert.equal(el.nextSibling.nodeName, 'FORM');
  assert.equal(el.parentElement.nodeName, 'DIV');
}

export const opDelay = 100;
