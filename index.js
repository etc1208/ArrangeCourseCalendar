// 国际化
pickmeup.defaults.locales['zh'] = {
	days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
	daysShort: ['日', '一', '二', '三', '四', '五', '六'],
	daysMin: ['日', '一', '二', '三', '四', '五', '六'],
	months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
};

// 星期中文映射
function getWeekIdx(ch) {
  switch (ch) {
    case '一':
      return 1;
      break;
    case '二':
      return 2;
      break;
    case '三':
      return 3;
      break;
    case '四':
      return 4;
      break;
    case '五':
      return 5;
      break;
    case '六':
      return 6;
      break;
    case '日':
      return 0;
      break;
    default:
      break;
  }
}

// 全局变量
var __CalendarData__ = {
  TOTAL_CLASS_NUM: 10, //课时数， 默认40
  CLASS_BEGIN_DATE: null, // 开课日期, e.g. 2018-01-01
  SELECT_WEEK: [],  // 当前选择的星期, 0-6 代表 周日-周六
  SELECT_DAYS: [], // 当前选中日期的标准格式， e.g. 2018-01-01
}

// 将时间戳格式化城年-月-日
function formatDate(str) {
  var y = new Date(str).getFullYear()
  var m = new Date(str).getMonth() + 1 > 9 ? new Date(str).getMonth() + 1 : '0' + (new Date(str).getMonth() + 1)
  var d = new Date(str).getDate() > 9 ? new Date(str).getDate() : '0' + new Date(str).getDate()
  return y + '-' + m + '-' + d 
}

// 渲染排课日历
function renderCalendar() {
  pickmeup('#pickmeup').set_date(__CalendarData__.SELECT_DAYS);
}

// 计算应选择的日期并渲染日历
function getSelectDays(weeks) {
  __CalendarData__.SELECT_DAYS = [__CalendarData__.CLASS_BEGIN_DATE]

  var beginWeek = new Date(__CalendarData__.CLASS_BEGIN_DATE).getDay()  // 开课日期是星期几
  var dist = null
  var tmpDateStamp = null
  var tmpDate
  for (var i = 0; i < weeks.length; i += 1) {
    dist = weeks[i] - beginWeek > 0 ? weeks[i] - beginWeek : weeks[i] - beginWeek + 7
    tmpDateStamp = dist * 24 * 60 * 60 * 1000 + (+new Date(__CalendarData__.CLASS_BEGIN_DATE))
    for (var j = 0; j < __CalendarData__.TOTAL_CLASS_NUM; j += 1) {
      tmpDate = formatDate(tmpDateStamp)
      tmpDateStamp += 7 * 24 * 60 * 60 * 1000
      if (__CalendarData__.SELECT_DAYS.indexOf(tmpDate) === -1) {
        __CalendarData__.SELECT_DAYS.push(tmpDate)
      }
    }
  }
  __CalendarData__.SELECT_DAYS = __CalendarData__.SELECT_DAYS.sort().slice(0, __CalendarData__.TOTAL_CLASS_NUM)
  renderCalendar()
}

// 初始化开课日期日历
pickmeup('#classBeginCalendar', {
  locale: 'zh',
  format: 'Y-m-d',
  default_date: false,
  hide_on_select: true
});

// 初始化日历列表
pickmeup('#pickmeup', {
  locale: 'zh',
  flat: true,
  date: __CalendarData__.SELECT_DAYS,
  current: '',
  format: 'Y-m-d',
  mode: 'multiple',
  default_date: false,
  select_month: false,
  select_year: false,
  calendars: 12
});

// 监听开课日期变化
document.getElementById('classBeginCalendar').addEventListener('pickmeup-change', function (e) {
  if (__CalendarData__.CLASS_BEGIN_DATE === e.detail.formatted_date) return
  __CalendarData__.CLASS_BEGIN_DATE = e.detail.formatted_date
  getSelectDays(__CalendarData__.SELECT_WEEK)
})

// 修改课时数按钮点击处理
$('#totalClassBtn').click(function() {
  var tmpVal = $('#totalClassNum').val()
  if (isNaN(tmpVal.trim()) || tmpVal.trim() === 0) {
    alert('输入数字不合法')
    $('#totalClassNum').val('')
  }
  else {
    __CalendarData__.TOTAL_CLASS_NUM = tmpVal
    if (__CalendarData__.CLASS_BEGIN_DATE) getSelectDays(__CalendarData__.SELECT_WEEK)
  }
})

// 星期点击事件处理
$('.pmu-day-of-week').click(function(e) {
  if (!__CalendarData__.CLASS_BEGIN_DATE) alert('未选择开课日期')
  else {
    var selectWeek = getWeekIdx(e.target.innerText)
    var weekIdx = __CalendarData__.SELECT_WEEK.indexOf(selectWeek)
    if (weekIdx === -1) { // 增加某星期
      __CalendarData__.SELECT_WEEK.push(selectWeek)
      getSelectDays(__CalendarData__.SELECT_WEEK)
    } else {  // 去除某星期
      __CalendarData__.SELECT_WEEK.splice(weekIdx, 1)
      getSelectDays(__CalendarData__.SELECT_WEEK)
    }
  }
})

// 提交数据处理
$('.submitCalendar').click(function() {
  if (__CalendarData__.SELECT_DAYS.length === 0) alert('数据为空')
  else if (__CalendarData__.SELECT_DAYS.length !== __CalendarData__.TOTAL_CLASS_NUM) alert('未选满')
  else alert(JSON.stringify(__CalendarData__.SELECT_DAYS))
})
