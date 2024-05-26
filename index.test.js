import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { isValidCron } from "./dist/esm/index.js";

describe("validate", () => {
  it("should not accept less than 5 symbols", () => {
    const valid = isValidCron("* * * *");
    assert.ok(!valid);
  });

  it("should not accept more than 6 symbols", () => {
    const valid = isValidCron("* * * * * * *");
    assert.ok(!valid);
  });

  it("should accept 6 symbols to support seconds if seconds option is true", () => {
    const valid = isValidCron("* * * * * *", { seconds: true });
    assert.ok(valid);
  });

  it("should accept 5 symbols to support without seconds", () => {
    const valid = isValidCron("* * * * *");
    assert.ok(valid);
  });

  it("should accept whitespaces on each side", () => {
    const valid = isValidCron(" * * * * * ");
    assert.ok(valid);
  });

  it("should not accept scalar ending with a wildcard", () => {
    const wildcardAfterMinute = isValidCron("1* * * * *");
    assert.ok(!wildcardAfterMinute);

    const wildcardAfterHour = isValidCron("* 1* * * *");
    assert.ok(!wildcardAfterHour);

    const wildcardBeforeMinute = isValidCron("*1 * * * *");
    assert.ok(!wildcardBeforeMinute);

    const wildcardBeforeHour = isValidCron("* *1 * * *");
    assert.ok(!wildcardBeforeHour);
  });

  it("should not accept seconds outside of 0-59", () => {
    const at0 = isValidCron("0 * * * * *", { seconds: true });
    assert.ok(at0);

    const at59 = isValidCron("59 * * * * *", { seconds: true });
    assert.ok(at59);

    const above59 = isValidCron("60 * * * * *", { seconds: true });
    assert.ok(!above59);
  });

  it("should not accept minutes outside of 0-59", () => {
    const at0 = isValidCron("* 0 * * * *", { seconds: true });
    assert.ok(at0);

    const at596Symbols = isValidCron("* 59 * * * *", { seconds: true });
    assert.ok(at596Symbols);

    const above596Symbols = isValidCron("* 60 * * * *", { seconds: true });
    assert.ok(!above596Symbols);

    const at595Symbols = isValidCron("59 * * * *");
    assert.ok(at595Symbols);

    const above595Symbols = isValidCron("60 * * * *");
    assert.ok(!above595Symbols);
  });

  it("should not accept hours outside of 0-23", () => {
    const at0 = isValidCron("* 0 * * *");
    assert.ok(at0);

    const at23 = isValidCron("* 23 * * *");
    assert.ok(at23);

    const above23 = isValidCron("* 24 * * *");
    assert.ok(!above23);
  });

  it("should not accept days outside of 1-31", () => {
    const at1 = isValidCron("* * 1 * *");
    assert.ok(at1);

    const below1 = isValidCron("* * 0 * *");
    assert.ok(!below1);

    const at31 = isValidCron("* * 31 * *");
    assert.ok(at31);

    const above31 = isValidCron("* * 32 * *");
    assert.ok(!above31);
  });

  it("should not accept months outside of 1-12", () => {
    const at1 = isValidCron("* * * 1 *");
    assert.ok(at1);

    const below1 = isValidCron("* * * 0 *");
    assert.ok(!below1);

    const at12 = isValidCron("* * * 12 *");
    assert.ok(at12);

    const above12 = isValidCron("* * * 13 *");
    assert.ok(!above12);
  });

  it("should accept month alias with the alias flag", () => {
    const jan = isValidCron("* * * jan,JAN *", { alias: true });
    assert.ok(jan);

    const feb = isValidCron("* * * feb,FEB *", { alias: true });
    assert.ok(feb);

    const mar = isValidCron("* * * mar,MAR *", { alias: true });
    assert.ok(mar);

    const apr = isValidCron("* * * apr,APR *", { alias: true });
    assert.ok(apr);

    const may = isValidCron("* * * may,MAY *", { alias: true });
    assert.ok(may);

    const jun = isValidCron("* * * jun,JUN *", { alias: true });
    assert.ok(jun);

    const jul = isValidCron("* * * jul,JUL *", { alias: true });
    assert.ok(jul);

    const aug = isValidCron("* * * aug,AUG *", { alias: true });
    assert.ok(aug);

    const sep = isValidCron("* * * sep,SEP *", { alias: true });
    assert.ok(sep);

    const oct = isValidCron("* * * oct,OCT *", { alias: true });
    assert.ok(oct);

    const nov = isValidCron("* * * nov,NOV *", { alias: true });
    assert.ok(nov);

    const dec = isValidCron("* * * dec,DEC *", { alias: true });
    assert.ok(dec);
  });

  it("should not accept month alias without the alias flag", () => {
    const valid = isValidCron("* * * jan *");
    assert.ok(!valid);
  });

  it("should not accept invalid month alias", () => {
    const valid = isValidCron("* * * january *", { alias: true });
    assert.ok(!valid);
  });

  it("should not accept month alias as steps", () => {
    const valid = isValidCron("* * * */jan *", { alias: true });
    assert.ok(!valid);
  });

  it("should not accept days of week outside of 0-6", () => {
    const at0 = isValidCron("* * * * 0");
    assert.ok(at0);

    const at6 = isValidCron("* * * * 6");
    assert.ok(at6);

    const at7 = isValidCron("* * * * 7");
    assert.ok(!at7);
  });

  it("should accept 7 days of week with the allowSevenAsSunday flag", () => {
    const at7 = isValidCron("* * * * 7", { allowSevenAsSunday: true });
    assert.ok(at7);
  });

  it("should accept weekdays alias with the alias flag", () => {
    const sun = isValidCron("* * * * sun,SUN", { alias: true });
    assert.ok(sun);

    const mon = isValidCron("* * * * mon,MON", { alias: true });
    assert.ok(mon);

    const tue = isValidCron("* * * * tue,TUE", { alias: true });
    assert.ok(tue);

    const wed = isValidCron("* * * * wed,WED", { alias: true });
    assert.ok(wed);

    const thu = isValidCron("* * * * thu,THU", { alias: true });
    assert.ok(thu);

    const fri = isValidCron("* * * * fri,FRI", { alias: true });
    assert.ok(fri);

    const sat = isValidCron("* * * * sat,SAT", { alias: true });
    assert.ok(sat);
  });

  it("should not accept weekdays alias without the flag", () => {
    const valid = isValidCron("* * * * sun");
    assert.ok(!valid);
  });

  it("should not accept invalid weekdays alias", () => {
    const valid = isValidCron("* * * * sunday", { alias: true });
    assert.ok(!valid);
  });

  it("should not accept weekdays alias as steps", () => {
    const valid = isValidCron("* * * * */sun", { alias: true });
    assert.ok(!valid);
  });

  it("should accept ranges", () => {
    const validSecond = isValidCron("1-10 * * * * *", { seconds: true });
    assert.ok(validSecond);

    const validMinute = isValidCron("1-10 * * * *");
    assert.ok(validMinute);

    const validHour = isValidCron("* 1-10 * * *");
    assert.ok(validHour);

    const validDay = isValidCron("* * 1-31 * *");
    assert.ok(validDay);

    const validMonth = isValidCron("* * * 1-12 *");
    assert.ok(validMonth);

    const validWeekday = isValidCron("* * * * 0-6");
    assert.ok(validWeekday);
  });

  it("should accept ranges regardless of allowNthWeekdayOfMonth flag", () => {
    const validWeekday = isValidCron("* * * * 0-6", {
      allowNthWeekdayOfMonth: true,
    });
    assert.ok(validWeekday);
  });

  it("should accept list of ranges", () => {
    const validSecond = isValidCron("1-10,11-20,21-30 * * * * *", {
      seconds: true,
    });
    assert.ok(validSecond);

    const validMinute = isValidCron("1-10,11-20,21-30 * * * *");
    assert.ok(validMinute);

    const validHour = isValidCron("* 1-10,11-20,21-23 * * *");
    assert.ok(validHour);

    const validDay = isValidCron("* * 1-10,11-20,21-31 * *");
    assert.ok(validDay);

    const validMonth = isValidCron("* * * 1-2,3-4,5-6 *");
    assert.ok(validMonth);

    const validWeekday = isValidCron("* * * * 0-2,3-4,5-6");
    assert.ok(validWeekday);
  });

  it("should not accept inverted ranges", () => {
    const validSecond = isValidCron("10-1,20-11,30-21 * * * * *", {
      seconds: true,
    });
    assert.ok(!validSecond);

    const validMinute = isValidCron("10-1,20-11,30-21 * * * *");
    assert.ok(!validMinute);

    const validHour = isValidCron("* 10-1,20-11,23-21 * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * 10-1,20-11,31-21 * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * 2-1,4-3,6-5 *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * 2-0,4-3,6-5");
    assert.ok(!validWeekday);
  });

  it("should accept steps in ranges", () => {
    const validSecond = isValidCron("1-10/2,21-30/2 * * * * *", {
      seconds: true,
    });
    assert.ok(validSecond);

    const validMinute = isValidCron("1-10/2,11-20/2 * * * *");
    assert.ok(validMinute);

    const validHour = isValidCron("* 1-10/2,11-20/2 * * *");
    assert.ok(validHour);

    const validDay = isValidCron("* * 1-10/2,11-20/2 * *");
    assert.ok(validDay);

    const validMonth = isValidCron("* * * 1-2/2,3-4/2 *");
    assert.ok(validMonth);

    const validWeekday = isValidCron("* * * * 0-2/2,3-4/2");
    assert.ok(validWeekday);
  });

  it("should accept wildcards over steps in ranges", () => {
    const validSecond = isValidCron("1-10,*/2 * * * * *", { seconds: true });
    assert.ok(validSecond);

    const validMinute = isValidCron("1-10,*/2 * * * *");
    assert.ok(validMinute);

    const validHour = isValidCron("* 1-10,*/2 * * *");
    assert.ok(validHour);

    const validDay = isValidCron("* * 1-10,*/2 * *");
    assert.ok(validDay);

    const validMonth = isValidCron("* * * 1-2,*/2 *");
    assert.ok(validMonth);

    const validWeekday = isValidCron("* * * * 0-2,*/2");
    assert.ok(validWeekday);
  });

  it("should not accept steps below 1", () => {
    const validSecond = isValidCron("1-10,*/0 * * * * *", { seconds: true });
    assert.ok(!validSecond);

    const validMinute = isValidCron("1-10,*/0 * * * *");
    assert.ok(!validMinute);

    const validHour = isValidCron("* 1-10,*/0 * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * 1-10,*/0 * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * 1-2,*/0 *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * 0-2,*/-1");
    assert.ok(!validWeekday);
  });

  it("should not accept an invalid range", () => {
    const validSecond = isValidCron("1-10-20 * * * * *");
    assert.ok(!validSecond);

    const validMinute = isValidCron("1-10-20 * * * *", { seconds: true });
    assert.ok(!validMinute);

    const validHour = isValidCron("* 1-10-20 * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * 1-10-20 * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * 1-2-10 *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * 0-2-6");
    assert.ok(!validWeekday);
  });

  it("should not accept invalid step", () => {
    const validSecond = isValidCron("1/10/20 * * * * *", { seconds: true });
    assert.ok(!validSecond);

    const validMinute = isValidCron("1/10/20 * * * *");
    assert.ok(!validMinute);

    const validHour = isValidCron("* 1/10/20 * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * 1/10/20 * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * 1/2/10 *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * 0/2/6");
    assert.ok(!validWeekday);
  });

  it("should not accept incomplete step", () => {
    const validSecond = isValidCron("*/ * * * * *", { seconds: true });
    assert.ok(!validSecond);

    const validMinute = isValidCron("*/ * * * *");
    assert.ok(!validMinute);

    const validHour = isValidCron("* */ * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * */ * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * /* *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * */");
    assert.ok(!validWeekday);
  });

  it("should not accept wildcards as range value", () => {
    const validSecond = isValidCron("1-* * * * * *", { seconds: true });
    assert.ok(!validSecond);

    const validMinute = isValidCron("1-* * * * *");
    assert.ok(!validMinute);

    const validHour = isValidCron("* 1-* * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * 1-* * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * 1-* *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * 0-*");
    assert.ok(!validWeekday);
  });

  it("should not accept invalid range", () => {
    const validSecond = isValidCron("1- * * * * *", {
      seconds: true,
      alias: true,
    });
    assert.ok(!validSecond);

    const validMinute = isValidCron("1- * * * *");
    assert.ok(!validMinute);

    const validHour = isValidCron("* - * * *");
    assert.ok(!validHour);

    const validDay = isValidCron("* * 1- * *");
    assert.ok(!validDay);

    const validMonth = isValidCron("* * * -1 *");
    assert.ok(!validMonth);

    const validWeekday = isValidCron("* * * * 0-");
    assert.ok(!validWeekday);
  });

  it("should accept everything combined", () => {
    const valid = isValidCron(
      // tslint:disable-next-line:max-line-length
      "10,*/15,12-14,15-30/5 10,*/15,12-14,15-30/5 10,*/12,12-14,5-10/2 10,*/7,12-15,15-30/5 1,*/3,4-5,jun-oct/2 0,*/3,2-4,mon-fri/2",
      { seconds: true, alias: true }
    );
    assert.ok(valid);
  });

  it("should accept number prefixed with a 0", () => {
    const valid = isValidCron("05 05 * * *");
    assert.ok(valid);
  });

  it("should not accept question marks in days if allowBlankDay is not set", () => {
    const dayValid = isValidCron("* * ? * *");
    assert.ok(!dayValid);

    const weekDayValid = isValidCron("* * * * ?");
    assert.ok(!weekDayValid);

    const bothValid = isValidCron("* * ? * ?");
    assert.ok(!bothValid);
  });

  it("should accept question marks in days if allowBlankDay is set", () => {
    const valid = isValidCron("* * ? * *", { allowBlankDay: true });
    assert.ok(valid);
  });

  it("should accept question marks in weekdays", () => {
    const valid = isValidCron("* * * * ?", { allowBlankDay: true });
    assert.ok(valid);

    const validWithAliases = isValidCron("* * * * ?", {
      alias: true,
      allowBlankDay: true,
    });
    assert.ok(validWithAliases);
  });

  it("should not accept question marks in days and weekdays at the same time if allowBlankDay is set", () => {
    const valid = isValidCron("* * ? * ?", { allowBlankDay: true });
    assert.ok(!valid);

    const validWithAliases = isValidCron("* * ? * ?", {
      alias: true,
      allowBlankDay: true,
    });
    assert.ok(!validWithAliases);
  });

  describe("nth weekday", () => {
    for (let weekday of ["1#2", "mon#2", "WED#5"]) {
      it(`should accept ${weekday}`, () => {
        const valid = isValidCron(`* * * * ${weekday}`, {
          allowNthWeekdayOfMonth: true,
          alias: true,
        });
        assert.ok(valid);
      });
    }

    for (let weekday of ["mon-fri#2", "mon#2-fri#2", "WED#6"]) {
      it(`should not accept ${weekday}`, () => {
        const valid = isValidCron(`* * * * ${weekday}`, {
          allowNthWeekdayOfMonth: true,
          alias: true,
        });
        assert.ok(!valid);
      });
    }

    it("should not accept aliases if alias is not set", () => {
      const valid = isValidCron("* * * * mon#2", {
        allowNthWeekdayOfMonth: true,
      });
      assert.ok(!valid);
    });
  });
});
