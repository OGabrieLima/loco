import './categoryPickerSkeleton.css'

import React from 'react'

export const CategoryPickerSkeleton = ({
  numberOfSkeleton = 1,
  styles,
}: {
  numberOfSkeleton: number
  styles?: React.CSSProperties
}) => {
  const skeletonArray = [...Array(numberOfSkeleton)].map(function(y, i) {
    return i
  })

  return (
    <>
      {skeletonArray.map((item) => (
        <div key={item} className="shimmer" style={styles}></div>
      ))}
    </>
  )
}
