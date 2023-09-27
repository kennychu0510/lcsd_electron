import { describe, expect, test } from 'vitest';
import { getFacilityType, getTimeOptions } from '../options/loader';
import Facilities from '../options/facilities';

describe('getTimeOptions', () => {
  test('should return 3 options', () => {
    expect(getTimeOptions()).toBeInstanceOf(Map);
    expect(getTimeOptions().size).toBe(3);
  });
});

describe('getFacilityType', () => {
  test('get badminton type', () => {
    expect(getFacilityType(Facilities.BadmintonCourt)).toBeInstanceOf(Map);
    expect(getFacilityType(Facilities.BadmintonCourt).size).toBe(3);
    expect(getFacilityType(Facilities.BadmintonCourt).get('Badminton Court (NT)')).toEqual({ value: 22 });
  });
});
