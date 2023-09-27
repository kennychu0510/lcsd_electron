import * as cheerio from 'cheerio';
import fs from 'fs';
import Facilities from './facilities';

const facilityData = fs.readFileSync('src/raw/facility.html', { encoding: 'utf-8' });
const timeData = fs.readFileSync('src/raw/time.html', { encoding: 'utf-8' });
const badmintonCourtType = fs.readFileSync('src/raw/facilityType/badmintonCourt.html', { encoding: 'utf-8' });
const badmintonCourtArea = fs.readFileSync('src/raw/area/badmintonCourt.html', { encoding: 'utf-8' });

export function getFacilityOptions() {
  const $ = cheerio.load(facilityData);
  const facilityOptions = $('option').slice(1);
  const facilityOptionsMap = new Map<string, { value: number }>();
  for (let option of facilityOptions) {
    const facility = $(option).text();
    const value = $(option).attr('value');
    facilityOptionsMap.set(facility, {
      value: Number(value),
    });
  }
  return facilityOptionsMap;
}

export function getTimeOptions() {
  const $ = cheerio.load(timeData);
  const timeOptions = $('option').slice(1);
  const timesOptionMap = new Map<string, { value: string }>();
  for (let option of timeOptions) {
    const time = $(option).text();
    const value = $(option).attr('value');
    timesOptionMap.set(time, {
      value: value,
    });
  }
  return timesOptionMap;
}

export function getFacilityType(facility: Facilities) {
  const $ = getFacilityTypeData(facility);
  const typeOptions = $('option').slice(1);
  const typeOptionMap = new Map<string, { value: number }>();
  for (let option of typeOptions) {
    const type = $(option).text();
    const value = $(option).attr('value');
    typeOptionMap.set(type, {
      value: Number(value),
    });
  }
  return typeOptionMap;
}

function getFacilityTypeData(facility: Facilities) {
  switch (facility) {
    case Facilities.BadmintonCourt:
      return cheerio.load(badmintonCourtType);
  }
  throw new Error('no facility type data');
}

export function getArea(facility: Facilities) {
  const $ = getAreaData(facility);
  const areaOptions = $('option').slice(1);
  const areaOptionMap = new Map<string, { value: number }>();
  for (let option of areaOptions) {
    const type = $(option).text();
    const value = $(option).attr('value');
    areaOptionMap.set(type, {
      value: Number(value),
    });
  }
  return areaOptionMap;
}

function getAreaData(facility: Facilities) {
  switch (facility) {
    case Facilities.BadmintonCourt:
      return cheerio.load(badmintonCourtArea);
  }
  throw new Error('no facility type data');
}
