import { getPossibleCombo } from '../ocr/helper';
import { describe, it, expect } from 'vitest';

describe('helper', () => {
  it('getPossibleCombo', () => {
    expect(
      getPossibleCombo(
        [
          { value: 'a', key: '' },
          { value: 'b', key: '' },
          { value: 'c', key: '' },
        ],
        'ab'
      )
    ).toMatchObject([
      { value: 'a', key: '' },
      { value: 'b', key: '' },
    ]);

    expect(
      getPossibleCombo(
        [
          { value: 'e', key: '' },
          { value: 'f', key: '' },
          { value: 'g', key: '' },
        ],
        'ab'
      )
    ).toMatchObject([]);

    expect(
      getPossibleCombo(
        [
          { value: 'a', key: '' },
          { value: 'b', key: '' },
          { value: 'c', key: '' },
        ],
        'abc'
      )
    ).toMatchObject([
      { value: 'a', key: '' },
      { value: 'b', key: '' },
      { value: 'c', key: '' },
    ]);
  });
});
