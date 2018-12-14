import React from 'react'

const RangeInfo = ({from, to}) => {
  if (from < to) {
    return (
      <span>
        Characters from {from}-{to}
      </span>
    )
  }

  return (
    <span>
      Nothing selected
    </span>
  )
}

export default RangeInfo
