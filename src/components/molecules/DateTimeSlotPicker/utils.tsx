export const highlightDateConditionally = (data: any, defaultStatus: any) => {
  return data?.map((m: any) => {
    return m?.slots?.some(
      (s: any) => s.status === defaultStatus?.available.value
    )
      ? {
          date: m?.date,
          className: 'greenDay'
        }
      : {
          date: m?.date,
          className: 'redDay'
        }
  })
}

export const prepareSlotPickerData = (data: any[]) => {
  return data?.map((d: any) => {
    const d1 = new Date(d?.date)
    d1.setSeconds(0)
    d1.setMilliseconds(0)
    const d2 = d1.getTime()
    return {
      date: d2,
      slots: d.slots
    }
  })
}
