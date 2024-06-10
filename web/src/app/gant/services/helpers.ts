export interface IDateWithoutTimeZoneOptions {
  resetTime: boolean,
  sliceTime: boolean,
  returnDateObj: boolean
}

const defaultOptions: IDateWithoutTimeZoneOptions = {
  resetTime: false,
  sliceTime: false,
  returnDateObj: false
}

export type TDateOrString<T> = T extends Date ? Date : string

export function noTimeZone<T extends Date | string>(
  date: Date | string | null,
  options: Partial<IDateWithoutTimeZoneOptions> = defaultOptions
): TDateOrString<T> {
  const { resetTime, sliceTime, returnDateObj } = options
  if (returnDateObj && sliceTime) {
    throw new Error('Can\'t slice time while returning Date object')
  }
  try {
    if (!date) return '' as TDateOrString<T>;
    if (!(date instanceof Date)){
      date = new Date(date)
    }

    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);

    if (resetTime) {
      correctDate.setUTCHours(0, 0, 0, 0);
    }

    if (returnDateObj) {
      return correctDate as TDateOrString<T>
    } else {
      if (sliceTime) {
        return correctDate.toISOString().substring(0, 10) as TDateOrString<T>
      }
      return correctDate.toISOString() as TDateOrString<T>
    }
  } catch (e) {
    console.log('Не удалось преобразовать дату, ERROR: ')
    console.log(e)
    return '' as TDateOrString<T>
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

export function jsonCopy (data: any) {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch(err) {
    console.error(err)
    return data
  }
}

export function isSame (data1: any, data2: any): boolean {
  console.log(jsonCopy(objVals2Str(data1)))
  console.log(jsonCopy(objVals2Str(data2)))
  return jsonCopy(objVals2Str(data1)) === jsonCopy(objVals2Str(data2))
}

export function objVals2Str(obj: any, immutable?: boolean) {
  if (immutable) {
    obj = jsonCopy(obj)
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        objVals2Str(obj[key]);
      } else {
        obj[key] = String(obj[key]);
      }
    }
  }
  return obj
}
