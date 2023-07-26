// This comes from the fact that parseInt trims characters coming
// after digits and consider it a valid int, so `1*` becomes `1`.
const safeParseInt = (value: string): number => {
  if (/^\d+$/.test(value)) {
    return Number(value)
  } else {
    return NaN
  }
}

const isWildcard = (value: string): boolean => {
  return value === '*'
}

const isQuestionMark = (value: string): boolean => {
  return value === '?'
}

const isInRange = (value: number, start: number, stop: number): boolean => {
  return value >= start && value <= stop
}

const isValidHashed = (value: string[], start: number, stop: number): boolean => {
  switch (value.length) {
    case 1:
      return value[0] === "H"
    case 2:
      // H Range: Has to start with H(, integers in range need to be valid, end has to be /\d\)/
      const startNum = safeParseInt(value[0].slice(2))
      const stopNum = safeParseInt(value[1].slice(0,-1))
      return value[0].slice(0,2) === "H(" && startNum <= stopNum && isInRange(startNum, start, stop) && isInRange(stopNum, start, stop) && value[1].search(/\d+\)/) === 0
    default:
      return false
  }
}

const isValidLast = (value: string[], start: number, stop: number, allowWeekday: boolean, inWeekday: boolean): boolean => {
  switch (value.length) {
    case 1:
      // Only L or LW for DOM, xL for DOW
      return value[0] === "L" || (!inWeekday && allowWeekday && value[0] === "LW") || ( inWeekday && value[0].slice(-1) === "L" && isInRange(safeParseInt(value[0].slice(0,-1)), start, stop) )
    case 2:
      // L with offset
      return value[0] === "L" && isInRange( safeParseInt(value[1]), start, stop )
    default:
      return false
  }
}

const isValidWeekday = (value: string[], start: number, stop: number): boolean => {
  if (value.length === 1) {
    return value[0].slice(-1) === "W" && isInRange( safeParseInt(value[0].slice(0,-1)), start, stop )
  }
  return false
}

const isValidRange = (value: string, start: number, stop: number, allowHashed?: boolean, allowLast?: boolean, allowWeekday?: boolean, inWeekday?: boolean): boolean => {
  const sides = value.split('-')
  if (allowHashed && sides[0].slice(0,1) === "H") {
    return isValidHashed(sides, start, stop)
  }
  switch (sides.length) {
    case 1:
      return isWildcard(value) || isInRange(safeParseInt(value), start, stop) || (!!allowLast && isValidLast(sides, start, stop, !!allowWeekday, !!inWeekday)) || (!!allowWeekday && isValidWeekday(sides, start, stop))
    case 2:
      const [small, big] = sides.map((side: string): number => safeParseInt(side))
      return (small <= big && isInRange(small, start, stop) && isInRange(big, start, stop)) || (!!allowLast && isValidLast(sides, start, stop, !!allowWeekday, !!inWeekday))
    default:
      return false
  }
}

const isValidStep = (value: string | undefined): boolean => {
  return value === undefined || (value.search(/[^\d]/) === -1 && safeParseInt(value) > 0)
}

const validateForRange = (value: string, start: number, stop: number, allowHashed?: boolean, allowLast?: boolean, allowWeekday?: boolean, inWeekday?: boolean): boolean => {
  if (value.search(/[^\d-,\/*H()LW]/) !== -1) {
    return false
  }

  const list = value.split(',')
  return list.every((condition: string): boolean => {
    const splits = condition.split('/')
    // Prevents `*/ * * * *` from being accepted.
    if (condition.trim().endsWith('/')) {
      return false
    }

    // Prevents `*/*/* * * * *` from being accepted
    if (splits.length > 2) {
      return false
    }

    // If we don't have a `/`, right will be undefined which is considered a valid step if we don't a `/`.
    const [left, right] = splits
    return isValidRange(left, start, stop, allowHashed, allowLast, allowWeekday, inWeekday) && isValidStep(right)
  })
}

const hasValidSeconds = (seconds: string, allowHashed?: boolean): boolean => {
  return validateForRange(seconds, 0, 59, allowHashed)
}

const hasValidMinutes = (minutes: string, allowHashed?: boolean): boolean => {
  return validateForRange(minutes, 0, 59, allowHashed)
}

const hasValidHours = (hours: string, allowHashed?: boolean): boolean => {
  return validateForRange(hours, 0, 23, allowHashed)
}

const hasValidDays = (days: string, allowBlankDay?: boolean, allowHashed?: boolean, allowLast?: boolean, allowWeekday?: boolean): boolean => {
  return (allowBlankDay && isQuestionMark(days)) || validateForRange(days, 1, 31, allowHashed, allowLast, allowWeekday)
}

const monthAlias: { [key: string]: string } = {
  jan: '1',
  feb: '2',
  mar: '3',
  apr: '4',
  may: '5',
  jun: '6',
  jul: '7',
  aug: '8',
  sep: '9',
  oct: '10',
  nov: '11',
  dec: '12'
}

const hasValidMonths = (months: string, alias?: boolean, allowHashed?: boolean): boolean => {
  // Prevents alias to be used as steps
  if (months.search(/\/[a-zA-Z]/) !== -1) {
    return false
  }

  if (alias) {
    const remappedMonths = months.toLowerCase().replace(/[a-z]{3}/g, (match: string): string => {
      return monthAlias[match] === undefined ? match : monthAlias[match]
    })
    // If any invalid alias was used, it won't pass the other checks as there will be non-numeric values in the months
    return validateForRange(remappedMonths, 1, 12, allowHashed)
  }

  return validateForRange(months, 1, 12, allowHashed)
}

const weekdaysAlias: { [key: string]: string } = {
  sun: '0',
  mon: '1',
  tue: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6'
}

const hasValidWeekdays = (weekdays: string, alias?: boolean, allowBlankDay?: boolean, allowSevenAsSunday?: boolean, allowHashed?: boolean, allowLast?: boolean, allowWeekday?: boolean): boolean => {

  // If there is a question mark, checks if the allowBlankDay flag is set
  if (allowBlankDay && isQuestionMark(weekdays)) {
    return true
  } else if (!allowBlankDay && isQuestionMark(weekdays)) {
    return false
  }

  // Prevents alias to be used as steps
  if (weekdays.search(/\/[a-zA-Z]/) !== -1) {
    return false
  }

  if (alias) {
    const remappedWeekdays = weekdays.toLowerCase().replace(/[a-z]{3}/g, (match: string): string => {
      return weekdaysAlias[match] === undefined ? match : weekdaysAlias[match]
    })
    // If any invalid alias was used, it won't pass the other checks as there will be non-numeric values in the weekdays
    return validateForRange(remappedWeekdays, 0, allowSevenAsSunday ? 7 : 6, allowHashed, allowLast, allowWeekday, true)
  }

  return validateForRange(weekdays, 0, allowSevenAsSunday ? 7 : 6, allowHashed, allowLast, allowWeekday, true)
}

const hasCompatibleDayFormat = (days: string, weekdays: string, allowBlankDay?: boolean) => {
  return !(allowBlankDay && isQuestionMark(days) && isQuestionMark(weekdays))
}

const split = (cron: string): string[] => {
  return cron.trim().split(/\s+/)
}

type Options = {
  alias: boolean
  seconds: boolean
  allowBlankDay: boolean
  allowSevenAsSunday: boolean
  allowHashed: boolean
  allowLast: boolean
  allowWeekday: boolean
}

const defaultOptions: Options = {
  alias: false,
  seconds: false,
  allowBlankDay: false,
  allowSevenAsSunday: false,
  allowHashed: false,
  allowLast: false,
  allowWeekday: false
}

export const isValidCron = (cron: string, options?: Partial<Options>): boolean => {
  options = { ...defaultOptions, ...options }

  const splits = split(cron)

  if (splits.length > (options.seconds ? 6 : 5) || splits.length < 5) {
    return false
  }

  const checks: boolean[] = []
  if (splits.length === 6) {
    const seconds = splits.shift()
    if (seconds) {
      checks.push(hasValidSeconds(seconds, options.allowHashed))
    }
  }

  // We could only check the steps gradually and return false on the first invalid block,
  // However, this won't have any performance impact so why bother for now.
  const [minutes, hours, days, months, weekdays] = splits
  checks.push(hasValidMinutes(minutes, options.allowHashed))
  checks.push(hasValidHours(hours, options.allowHashed))
  checks.push(hasValidDays(days, options.allowBlankDay, options.allowHashed, options.allowLast, options.allowWeekday))
  checks.push(hasValidMonths(months, options.alias, options.allowHashed))
  checks.push(hasValidWeekdays(weekdays, options.alias, options.allowBlankDay, options.allowSevenAsSunday, options.allowHashed, options.allowLast))
  checks.push(hasCompatibleDayFormat(days, weekdays, options.allowBlankDay))

  return checks.every(Boolean)
}
