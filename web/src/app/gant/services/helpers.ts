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

export function lsSet (propName: string, content: any) {
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  localStorage.setItem(propName, content)
}

export function lsGet (propName: string): any | null {
  let localStorageItem = localStorage.getItem(propName)
  if (localStorageItem) {
    try {
      localStorageItem = JSON.parse(localStorageItem)
    } catch (error) {
      console.log(error)
    }
  }
  return localStorageItem
}
