import {RefObject, useLayoutEffect, useState} from 'react'
import {ElementWidth} from '../types/constEnums'
import useResizeObserver from './useResizeObserver'

const useCardsPerRow = (wrapperRef: RefObject<HTMLDivElement>) => {
  const [cardsPerRow, setCardsPerRow] = useState(1)

  const getCardsPerRow = () => {
    const {current: el} = wrapperRef
    const width = el?.clientWidth || 0
    const cardsPerRow = Math.max(Math.floor(width / ElementWidth.MEETING_CARD_WITH_MARGIN), 1)
    setCardsPerRow(cardsPerRow)
  }

  useLayoutEffect(getCardsPerRow, [wrapperRef])
  useResizeObserver(getCardsPerRow, wrapperRef)
  return cardsPerRow
}

export default useCardsPerRow
