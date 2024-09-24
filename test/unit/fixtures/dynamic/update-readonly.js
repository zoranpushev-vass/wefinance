/* eslint-env mocha */
import assert from 'assert';
import { setValue } from '../../testUtils.js';

export const sample = {
  items: [
    {
      fieldType: 'text-input',
      id: 'text-input',
      name: 'name',
      events: {
        change: [
          "if(contains($event.payload.changes[].propertyName, 'value'),[dispatchEvent(checkboxgroup, 'custom:setProperty', {readOnly : true()}),dispatchEvent(radiogroup, 'custom:setProperty', {readOnly : true()})],{})",
          "if(contains($event.payload.changes[].propertyName, 'value'),[dispatchEvent(dropdown, 'custom:setProperty', {readOnly : true()})],{})",
        ],
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
    {
      fieldType: 'checkbox-group',
      id: 'checkbox-group',
      name: 'checkboxgroup',
      enum: [
        '0',
        '1',
      ],
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
    {
      fieldType: 'drop-down',
      id: 'drop-down',
      name: 'dropdown',
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
    {
      fieldType: 'radio-group',
      id: 'radio-group',
      name: 'radiogroup',
      enum: [
        'a',
        'b',
      ],
      events: {
        'custom:setProperty': [
          '$event.payload',
        ],
      },
    },
  ],
};

function getValue(block, id, fieldType, property = 'disabled') {
  const fieldEl = block.querySelector(id);
  if (fieldType === 'checkbox-group' || fieldType === 'radio-group') {
    const child = fieldEl.querySelector('input');
    return child[property];
  }
  return fieldEl[property];
}

export function op(block) {
  setValue(block, '#text-input', 'abc');
}

export function expect(block) {
  assert.equal(getValue(block, '#checkbox-group', 'checkbox-group', 'disabled'), true);
  assert.equal(getValue(block, '#drop-down', 'disabled'), true);
}
