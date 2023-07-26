import { isValidCron } from './index'

describe('validate', () => {
  it('should not accept less than 5 symbols', () => {
    const valid = isValidCron('* * * *')
    expect(valid).toBeFalsy()
  })

  it('should not accept more than 6 symbols', () => {
    const valid = isValidCron('* * * * * * *')
    expect(valid).toBeFalsy()
  })

  it('should accept 6 symbols to support seconds if seconds option is true', () => {
    const valid = isValidCron('* * * * * *', { seconds: true })
    expect(valid).toBeTruthy()
  })

  it('should accept 5 symbols to support without seconds', () => {
    const valid = isValidCron('* * * * *')
    expect(valid).toBeTruthy()
  })

  it('should accept whitespaces on each side', () => {
    const valid = isValidCron(' * * * * * ')
    expect(valid).toBeTruthy()
  })

  it('should not accept scalar ending with a wildcard', () => {
    const wildcardAfterMinute = isValidCron('1* * * * *')
    expect(wildcardAfterMinute).toBeFalsy()

    const wildcardAfterHour = isValidCron('* 1* * * *')
    expect(wildcardAfterHour).toBeFalsy()

    const wildcardBeforeMinute = isValidCron('*1 * * * *')
    expect(wildcardBeforeMinute).toBeFalsy()

    const wildcardBeforeHour = isValidCron('* *1 * * *')
    expect(wildcardBeforeHour).toBeFalsy()
  })

  it('should not accept seconds outside of 0-59', () => {
    const at0 = isValidCron('0 * * * * *', { seconds: true })
    expect(at0).toBeTruthy()

    const at59 = isValidCron('59 * * * * *', { seconds: true })
    expect(at59).toBeTruthy()

    const above59 = isValidCron('60 * * * * *', { seconds: true })
    expect(above59).toBeFalsy()
  })

  it('should not accept minutes outside of 0-59', () => {
    const at0 = isValidCron('* 0 * * * *', { seconds: true })
    expect(at0).toBeTruthy()

    const at596Symbols = isValidCron('* 59 * * * *', { seconds: true })
    expect(at596Symbols).toBeTruthy()

    const above596Symbols = isValidCron('* 60 * * * *', { seconds: true })
    expect(above596Symbols).toBeFalsy()

    const at595Symbols = isValidCron('59 * * * *')
    expect(at595Symbols).toBeTruthy()

    const above595Symbols = isValidCron('60 * * * *')
    expect(above595Symbols).toBeFalsy()
  })

  it('should not accept hours outside of 0-23', () => {
    const at0 = isValidCron('* 0 * * *')
    expect(at0).toBeTruthy()

    const at23 = isValidCron('* 23 * * *')
    expect(at23).toBeTruthy()

    const above23 = isValidCron('* 24 * * *')
    expect(above23).toBeFalsy()
  })

  it('should not accept days outside of 1-31', () => {
    const at1 = isValidCron('* * 1 * *')
    expect(at1).toBeTruthy()

    const below1 = isValidCron('* * 0 * *')
    expect(below1).toBeFalsy()

    const at31 = isValidCron('* * 31 * *')
    expect(at31).toBeTruthy()

    const above31 = isValidCron('* * 32 * *')
    expect(above31).toBeFalsy()
  })

  it('should not accept months outside of 1-12', () => {
    const at1 = isValidCron('* * * 1 *')
    expect(at1).toBeTruthy()

    const below1 = isValidCron('* * * 0 *')
    expect(below1).toBeFalsy()

    const at12 = isValidCron('* * * 12 *')
    expect(at12).toBeTruthy()

    const above12 = isValidCron('* * * 13 *')
    expect(above12).toBeFalsy()
  })

  it('should accept month alias with the alias flag', () => {
    const jan = isValidCron('* * * jan,JAN *', { alias: true })
    expect(jan).toBeTruthy()

    const feb = isValidCron('* * * feb,FEB *', { alias: true })
    expect(feb).toBeTruthy()

    const mar = isValidCron('* * * mar,MAR *', { alias: true })
    expect(mar).toBeTruthy()

    const apr = isValidCron('* * * apr,APR *', { alias: true })
    expect(apr).toBeTruthy()

    const may = isValidCron('* * * may,MAY *', { alias: true })
    expect(may).toBeTruthy()

    const jun = isValidCron('* * * jun,JUN *', { alias: true })
    expect(jun).toBeTruthy()

    const jul = isValidCron('* * * jul,JUL *', { alias: true })
    expect(jul).toBeTruthy()

    const aug = isValidCron('* * * aug,AUG *', { alias: true })
    expect(aug).toBeTruthy()

    const sep = isValidCron('* * * sep,SEP *', { alias: true })
    expect(sep).toBeTruthy()

    const oct = isValidCron('* * * oct,OCT *', { alias: true })
    expect(oct).toBeTruthy()

    const nov = isValidCron('* * * nov,NOV *', { alias: true })
    expect(nov).toBeTruthy()

    const dec = isValidCron('* * * dec,DEC *', { alias: true })
    expect(dec).toBeTruthy()
  })

  it('should not accept month alias without the alias flag', () => {
    const valid = isValidCron('* * * jan *')
    expect(valid).toBeFalsy()
  })

  it('should not accept invalid month alias', () => {
    const valid = isValidCron('* * * january *', { alias: true })
    expect(valid).toBeFalsy()
  })

  it('should not accept month alias as steps', () => {
    const valid = isValidCron('* * * */jan *', { alias: true })
    expect(valid).toBeFalsy()
  })

  it('should not accept days of week outside of 0-6', () => {
    const at0 = isValidCron('* * * * 0')
    expect(at0).toBeTruthy()

    const at6 = isValidCron('* * * * 6')
    expect(at6).toBeTruthy()

    const at7 = isValidCron('* * * * 7')
    expect(at7).toBeFalsy()
  })

  it('should accept 7 days of week with the allowSevenAsSunday flag', () => {
    const at7 = isValidCron('* * * * 7', { allowSevenAsSunday: true })
    expect(at7).toBeTruthy()
  })

  it('should accept weekdays alias with the alias flag', () => {
    const sun = isValidCron('* * * * sun,SUN', { alias: true })
    expect(sun).toBeTruthy()

    const mon = isValidCron('* * * * mon,MON', { alias: true })
    expect(mon).toBeTruthy()

    const tue = isValidCron('* * * * tue,TUE', { alias: true })
    expect(tue).toBeTruthy()

    const wed = isValidCron('* * * * wed,WED', { alias: true })
    expect(wed).toBeTruthy()

    const thu = isValidCron('* * * * thu,THU', { alias: true })
    expect(thu).toBeTruthy()

    const fri = isValidCron('* * * * fri,FRI', { alias: true })
    expect(fri).toBeTruthy()

    const sat = isValidCron('* * * * sat,SAT', { alias: true })
    expect(sat).toBeTruthy()
  })

  it('should not accept weekdays alias without the flag', () => {
    const valid = isValidCron('* * * * sun')
    expect(valid).toBeFalsy()
  })

  it('should not accept invalid weekdays alias', () => {
    const valid = isValidCron('* * * * sunday', { alias: true })
    expect(valid).toBeFalsy()
  })

  it('should not accept weekdays alias as steps', () => {
    const valid = isValidCron('* * * * */sun', { alias: true })
    expect(valid).toBeFalsy()
  })

  it('should accepts ranges', () => {
    const validSecond = isValidCron('1-10 * * * * *', { seconds: true })
    expect(validSecond).toBeTruthy()

    const validMinute = isValidCron('1-10 * * * *')
    expect(validMinute).toBeTruthy()

    const validHour = isValidCron('* 1-10 * * *')
    expect(validHour).toBeTruthy()

    const validDay = isValidCron('* * 1-31 * *')
    expect(validDay).toBeTruthy()

    const validMonth = isValidCron('* * * 1-12 *')
    expect(validMonth).toBeTruthy()

    const validWeekday = isValidCron('* * * * 0-6')
    expect(validWeekday).toBeTruthy()
  })

  it('should accept list of ranges', () => {
    const validSecond = isValidCron('1-10,11-20,21-30 * * * * *', { seconds: true })
    expect(validSecond).toBeTruthy()

    const validMinute = isValidCron('1-10,11-20,21-30 * * * *')
    expect(validMinute).toBeTruthy()

    const validHour = isValidCron('* 1-10,11-20,21-23 * * *')
    expect(validHour).toBeTruthy()

    const validDay = isValidCron('* * 1-10,11-20,21-31 * *')
    expect(validDay).toBeTruthy()

    const validMonth = isValidCron('* * * 1-2,3-4,5-6 *')
    expect(validMonth).toBeTruthy()

    const validWeekday = isValidCron('* * * * 0-2,3-4,5-6')
    expect(validWeekday).toBeTruthy()
  })

  it('should not accept inverted ranges', () => {
    const validSecond = isValidCron('10-1,20-11,30-21 * * * * *', { seconds: true })
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('10-1,20-11,30-21 * * * *')
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* 10-1,20-11,23-21 * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * 10-1,20-11,31-21 * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * 2-1,4-3,6-5 *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * 2-0,4-3,6-5')
    expect(validWeekday).toBeFalsy()
  })

  it('should accept steps in ranges', () => {
    const validSecond = isValidCron('1-10/2,21-30/2 * * * * *', { seconds: true })
    expect(validSecond).toBeTruthy()

    const validMinute = isValidCron('1-10/2,11-20/2 * * * *')
    expect(validMinute).toBeTruthy()

    const validHour = isValidCron('* 1-10/2,11-20/2 * * *')
    expect(validHour).toBeTruthy()

    const validDay = isValidCron('* * 1-10/2,11-20/2 * *')
    expect(validDay).toBeTruthy()

    const validMonth = isValidCron('* * * 1-2/2,3-4/2 *')
    expect(validMonth).toBeTruthy()

    const validWeekday = isValidCron('* * * * 0-2/2,3-4/2')
    expect(validWeekday).toBeTruthy()
  })

  it('should accept wildcards over steps in ranges', () => {
    const validSecond = isValidCron('1-10,*/2 * * * * *', { seconds: true })
    expect(validSecond).toBeTruthy()

    const validMinute = isValidCron('1-10,*/2 * * * *')
    expect(validMinute).toBeTruthy()

    const validHour = isValidCron('* 1-10,*/2 * * *')
    expect(validHour).toBeTruthy()

    const validDay = isValidCron('* * 1-10,*/2 * *')
    expect(validDay).toBeTruthy()

    const validMonth = isValidCron('* * * 1-2,*/2 *')
    expect(validMonth).toBeTruthy()

    const validWeekday = isValidCron('* * * * 0-2,*/2')
    expect(validWeekday).toBeTruthy()
  })

  it('should not accept steps below 1', () => {
    const validSecond = isValidCron('1-10,*/0 * * * * *', { seconds: true })
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('1-10,*/0 * * * *')
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* 1-10,*/0 * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * 1-10,*/0 * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * 1-2,*/0 *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * 0-2,*/-1')
    expect(validWeekday).toBeFalsy()
  })

  it('should not accept an invalid range', () => {
    const validSecond = isValidCron('1-10-20 * * * * *')
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('1-10-20 * * * *', { seconds: true })
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* 1-10-20 * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * 1-10-20 * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * 1-2-10 *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * 0-2-6')
    expect(validWeekday).toBeFalsy()
  })

  it('should not accept invalid step', () => {
    const validSecond = isValidCron('1/10/20 * * * * *', { seconds: true })
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('1/10/20 * * * *')
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* 1/10/20 * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * 1/10/20 * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * 1/2/10 *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * 0/2/6')
    expect(validWeekday).toBeFalsy()
  })

  it('should not accept incomplete step', () => {
    const validSecond = isValidCron('*/ * * * * *', { seconds: true })
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('*/ * * * *')
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* */ * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * */ * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * /* *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * */')
    expect(validWeekday).toBeFalsy()
  })

  it('should not accept wildcards as range value', () => {
    const validSecond = isValidCron('1-* * * * * *', { seconds: true })
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('1-* * * * *')
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* 1-* * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * 1-* * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * 1-* *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * 0-*')
    expect(validWeekday).toBeFalsy()
  })

  it('should not accept invalid range', () => {
    const validSecond = isValidCron('1- * * * * *', { seconds: true, alias: true })
    expect(validSecond).toBeFalsy()

    const validMinute = isValidCron('1- * * * *')
    expect(validMinute).toBeFalsy()

    const validHour = isValidCron('* - * * *')
    expect(validHour).toBeFalsy()

    const validDay = isValidCron('* * 1- * *')
    expect(validDay).toBeFalsy()

    const validMonth = isValidCron('* * * -1 *')
    expect(validMonth).toBeFalsy()

    const validWeekday = isValidCron('* * * * 0-')
    expect(validWeekday).toBeFalsy()
  })

  it('should accept everything combined', () => {
    const valid = isValidCron(
      // tslint:disable-next-line:max-line-length
      '10,*/15,12-14,15-30/5 10,*/15,12-14,15-30/5 10,*/12,12-14,5-10/2 10,*/7,12-15,15-30/5 1,*/3,4-5,jun-oct/2 0,*/3,2-4,mon-fri/2',
      { seconds: true, alias: true }
    )
    expect(valid).toBeTruthy()
  })

  it('should accept number prefixed with a 0', () => {
    const valid = isValidCron('05 05 * * *')
    expect(valid).toBeTruthy()
  })

  it('should not accept question marks in days if allowBlankDay is not set', () => {
    const dayValid = isValidCron('* * ? * *')
    expect(dayValid).toBeFalsy()

    const weekDayValid = isValidCron('* * * * ?')
    expect(weekDayValid).toBeFalsy()

    const bothValid = isValidCron('* * ? * ?')
    expect(bothValid).toBeFalsy()
  })

  it('should accept question marks in days if allowBlankDay is set', () => {
    const valid = isValidCron('* * ? * *', { allowBlankDay: true })
    expect(valid).toBeTruthy()
  })

  it('should accept question marks in weekdays', () => {
    const valid = isValidCron('* * * * ?', { allowBlankDay: true })
    expect(valid).toBeTruthy()

    const validWithAliases = isValidCron('* * * * ?', { alias: true, allowBlankDay: true })
    expect(validWithAliases).toBeTruthy()
  })

  it('should not accept question marks in days and weekdays at the same time if allowBlankDay is set', () => {
    const valid = isValidCron('* * ? * ?', { allowBlankDay: true })
    expect(valid).toBeFalsy()

    const validWithAliases = isValidCron('* * ? * ?', { alias: true, allowBlankDay: true })
    expect(validWithAliases).toBeFalsy()
  })

  it('should not accept H if allowHashed is not set', () => {
    const valid = isValidCron('H * * * *')
    expect(valid).toBeFalsy()

    const validWithSeconds = isValidCron('* * H * * *', {seconds: true} )
    expect(validWithSeconds).toBeFalsy()

    const validWithAlias = isValidCron('* * H * THU', {alias: true} )
    expect(validWithAlias).toBeFalsy()
  })

  it('should accept H if allowHashed is set', () => {
    const valid = isValidCron('H * * * *', {allowHashed: true})
    expect(valid).toBeTruthy()

    const validWithSeconds = isValidCron('* * H * * *', {allowHashed: true, seconds: true} )
    expect(validWithSeconds).toBeTruthy()

    const validWithAlias = isValidCron('* * H * THU', {allowHashed: true, alias: true} )
    expect(validWithAlias).toBeTruthy()
  })

  it('should not accept H with ranges if allowHashed is not set', () => {
    const valid = isValidCron('H(0-20) * * * *')
    expect(valid).toBeFalsy()

    const validWithSeconds = isValidCron('* * H(10-15) * * *', {seconds: true} )
    expect(validWithSeconds).toBeFalsy()

    const validWithAlias = isValidCron('* * H(1-8) * THU', {alias: true} )
    expect(validWithAlias).toBeFalsy()

    const validWithRange = isValidCron('* * H(1-8)-10 * *')
    expect(validWithRange).toBeFalsy()
  })

  it('should accept H with ranges if allowHashed is set', () => {
    const valid = isValidCron('H(0-20) * * * *', {allowHashed: true})
    expect(valid).toBeTruthy()

    const validWithSeconds = isValidCron('* * H(10-15) * * *', {allowHashed: true, seconds: true} )
    expect(validWithSeconds).toBeTruthy()

    const validWithAlias = isValidCron('* * H(1-8) * THU', {allowHashed: true, alias: true} )
    expect(validWithAlias).toBeTruthy()

    const validWithNoRange = isValidCron('* * H( * THU', {allowHashed: true, alias: true} )
    expect(validWithNoRange).toBeFalsy()
  })

  it('should not accept H with invalid ranges even if allowHashed is set', () => {
    const valid = isValidCron('H(0-61) * * * *', {allowHashed: true})
    expect(valid).toBeFalsy()

    const validWithSeconds = isValidCron('* * H(0-25) * * *', {allowHashed: true, seconds: true} )
    expect(validWithSeconds).toBeFalsy()

    const validWithAlias = isValidCron('* * H(0-8) * THU', {allowHashed: true, alias: true} )
    expect(validWithAlias).toBeFalsy()

    const validWithWrongDOM = isValidCron('* * H(1-32) * THU', {allowHashed: true, alias: true} )
    expect(validWithWrongDOM).toBeFalsy()

    const validWithRange = isValidCron('H(0-30)-50 * * * *', {allowHashed: true})
    expect(validWithRange).toBeFalsy()

    const validWithReverse = isValidCron('H(30-0) * * * *', {allowHashed: true})
    expect(validWithReverse).toBeFalsy()
  })

  it('should accept H with iterators if allowHashed is set', () => {
    const valid = isValidCron('H/8 * * * *', {allowHashed: true})
    expect(valid).toBeTruthy()

    const validWithSeconds = isValidCron('* * H(10-15)/2 * * *', {allowHashed: true, seconds: true} )
    expect(validWithSeconds).toBeTruthy()

    const validWithAlias = isValidCron('* * H/4 * THU', {allowHashed: true, alias: true} )
    expect(validWithAlias).toBeTruthy()

    // TODO: Iterators are always valid if they're integers. Maybe behaviour changes in the future?
    //const validWithWrongIterator = isValidCron('* * H/32 * THU', {allowHashed: true, alias: true} )
    //expect(validWithWrongIterator).toBeFalsy()

    // TODO: Allow H as a step val? No.
    const validWithHstep = isValidCron('* * 4/H * *', {allowHashed: true} )
    expect(validWithHstep).toBeFalsy()

    const validWithHstep2 = isValidCron('* * 4/H(1-5) * *', {allowHashed: true} )
    expect(validWithHstep2).toBeFalsy()
  })

  it('should not accept H in a range if allowHashed is set', () => {
    const valid = isValidCron('H-8 * * * *', {allowHashed: true})
    expect(valid).toBeFalsy()

    const validWithSeconds = isValidCron('* * H-2 * * *', {allowHashed: true, seconds: true} )
    expect(validWithSeconds).toBeFalsy()

    const validWithAlias = isValidCron('* * H-4 * THU', {allowHashed: true, alias: true} )
    expect(validWithAlias).toBeFalsy()
  })

  // TODO: Decide if multiple H in one field should be supported? Would only work properly if their ranges were starting at different points

  it('should not accept L if allowLast is not set', () => {
    const valid = isValidCron('* * L * *')
    expect(valid).toBeFalsy()

    const validWithSeconds = isValidCron('* * * L * *', {seconds: true})
    expect(validWithSeconds).toBeFalsy()

    const validWithAlias = isValidCron('* * L * WED', {alias: true})
    expect(validWithAlias).toBeFalsy()

    const validWithWrongField = isValidCron('* L * * *')
    expect(validWithWrongField).toBeFalsy()
  })

  it('should accept L in DOM and DOW if allowLast is set', () => {
    const validDOM = isValidCron('* * L * *', {allowLast: true})
    expect(validDOM).toBeTruthy()

    const validLW = isValidCron('* * LW * *', {allowLast: true, allowWeekday: true})
    expect(validLW).toBeTruthy()

    const validLWDOW = isValidCron('* * * * LW', {allowLast: true, allowWeekday: true})
    expect(validLWDOW).toBeFalsy()

    const validDOMAlias = isValidCron('* * L * WED', {allowLast: true, alias:true})
    expect(validDOMAlias).toBeTruthy()

    const validDOMsec = isValidCron('* * * L * THU', {allowLast: true, alias: true, seconds: true})
    expect(validDOMsec).toBeTruthy()

    const validDOMOffset = isValidCron('* * L-2 * *', {allowLast: true})
    expect(validDOMOffset).toBeTruthy()

    const validDOW = isValidCron('* * * * L', {allowLast: true})
    expect(validDOW).toBeTruthy()

    const validDOWDay = isValidCron('* * * * 2L', {allowLast: true})
    expect(validDOWDay).toBeTruthy()

    const validWithWrongField = isValidCron('* L * * *', {allowLast: true})
    expect(validWithWrongField).toBeFalsy()

    const validWithSeconds = isValidCron('L * * * * *', {allowLast: true, seconds: true})
    expect(validWithSeconds).toBeFalsy()
  })

  it('should not accept L in invalid places or with invalid offsets/values', () => {
    const validDOM = isValidCron('* L L * *', {allowLast: true})
    expect(validDOM).toBeFalsy()

    const validDOMOffset = isValidCron('* L-2 L-3 * *', {allowLast: true})
    expect(validDOMOffset).toBeFalsy()

    const validDOW = isValidCron('* * * * L *', {allowLast: true, seconds: true})
    expect(validDOW).toBeFalsy()

    const validDOWDay = isValidCron('* * * * 2L-2', {allowLast: true})
    expect(validDOWDay).toBeFalsy()

    const validDOMDay = isValidCron('* * * 3L * 2L', {allowLast: true, seconds: true})
    expect(validDOMDay).toBeFalsy()
  })

  it('should not accept W if allowWeekdays is not set', () => {
    const validDOM = isValidCron('* * 1W * *')
    expect(validDOM).toBeFalsy()

    const validDOW = isValidCron('* * * 5W * *', {seconds: true})
    expect(validDOW).toBeFalsy()

    const validDOWDay = isValidCron('* * 2W * THU', {alias: true})
    expect(validDOWDay).toBeFalsy()

    const validDOMDay = isValidCron('* * * 3W * 2L', {allowLast: true, seconds: true})
    expect(validDOMDay).toBeFalsy()
  })

  it('should accept W if allowWeekdays is set', () => {
    const validDOM = isValidCron('* * 1W * *', {allowWeekday: true})
    expect(validDOM).toBeTruthy()

    const validDOW = isValidCron('* * * 5W * *', {allowWeekday: true, seconds: true})
    expect(validDOW).toBeTruthy()

    const validDOWDay = isValidCron('* * 2W * THU', {allowWeekday: true, alias: true})
    expect(validDOWDay).toBeTruthy()

    const validDOMDay = isValidCron('* * * 3W * *', {allowWeekday: true, seconds: true})
    expect(validDOMDay).toBeTruthy()
  })

  it('should not accept W in invalid fields or combinations', () => {
    const validDOM = isValidCron('* * * 1W *', {allowWeekday: true})
    expect(validDOM).toBeFalsy()

    const validDOW = isValidCron('* * * 32W * *', {allowWeekday: true, seconds: true})
    expect(validDOW).toBeFalsy()

    const validDOWDay = isValidCron('* * 2W-5 * THU', {allowWeekday: true, alias: true})
    expect(validDOWDay).toBeFalsy()

    const validDOWDay2 = isValidCron('* * 2-5W * THU', {allowWeekday: true, alias: true})
    expect(validDOWDay2).toBeFalsy()

    const validDOMDay = isValidCron('* * * * * 2W', {allowWeekday: true, seconds: true})
    expect(validDOMDay).toBeFalsy()
  })

  // TODO: L and W usage with iterators?
})
