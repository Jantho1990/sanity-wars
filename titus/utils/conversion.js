export function convertUnit (value, to, from) {
  const units = {
    'px': 96,
    'pt': 72,
    'em': 6,
    '%': 600,
    'in': 1
  }

  let fromUnit, toUnit = null

  if (typeof value === 'string') {
    Object.keys(units).forEach(unit => {
      if (!!fromUnit && !!toUnit) return
  
      fromUnit = value.toLowerCase().indexOf(unit) !== -1 ? unit : fromUnit
      toUnit = to.toLowerCase().indexOf(unit) !== -1 ? unit : toUnit
    })

    value = Number(value.replace(fromUnit, ''))
  }

  return units[toUnit] / units[fromUnit] * value
}