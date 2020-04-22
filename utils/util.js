const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formSolarDate = date => {
  const year = date.getFullYear()
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())

  return year+'年'+month+'月'+day+'日'
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const getWeekByDate = dates => {
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate());
  let day = date.getDay();
  return show_day[day];
}

module.exports = {
  formatTime: formatTime,
  getWeekByDate: getWeekByDate,
  formSolarDate: formSolarDate
}