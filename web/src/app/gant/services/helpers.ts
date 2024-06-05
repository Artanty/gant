export function isoDateWithoutTimeZone(date: Date | string | null): string {
  try {
    if (!date) return ''
    if (!(date instanceof Date)){
      date = new Date(date)
    }
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    correctDate.setUTCHours(0, 0, 0, 0);
    return correctDate.toISOString().substring(0, 10)
  } catch (e) {
    // this.showSnackbarMessage('error', 'Не удалось преобразовать дату')
    console.log('ERROR: ')
    console.log(e)
    return ''
  }
}
