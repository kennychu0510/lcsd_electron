import { describe, expect, test } from "vitest";
import { getEnquiryDates } from "./dates";
import moment from "moment";

describe('get dates function', () => {
  test('should return an array of 8 dates', () => {
    expect(getEnquiryDates()).toBeInstanceOf(Array)
    expect(getEnquiryDates().length).toBe(8)
  })

  test('should include today', () => {
    expect(getEnquiryDates()[0]).toBe(Number(moment().format('YYYYMMDD')))
  })

  test('should include date of 8 days later', () => {
    expect(getEnquiryDates().at(-1)).toBe(Number(moment().add(7, 'day').format('YYYYMMDD')))
  })
})