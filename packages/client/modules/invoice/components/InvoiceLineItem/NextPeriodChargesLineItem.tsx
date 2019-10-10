import React from 'react'
import invoiceLineFormat from '../../helpers/invoiceLineFormat'
import {createFragmentContainer} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {NextPeriodChargesLineItem_item} from '__generated__/NextPeriodChargesLineItem_item.graphql'
import plural from '../../../../utils/plural'
import InvoiceLineItemContent from './InvoiceLineItemContent'
import {TierEnum} from '../../../../types/graphql'

interface Props {
  item: NextPeriodChargesLineItem_item
  tier: TierEnum
}

const NextPeriodChargesLineItem = (props: Props) => {
  const {item, tier} = props
  const {unitPrice, quantity} = item
  const amount = invoiceLineFormat(item.amount)
  if (tier === TierEnum.enterprise) {
    return (
      <InvoiceLineItemContent description={`${quantity} Enterprise Licenses`} amount={amount} />
    )
  }
  const unitPriceString = (unitPrice! / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })
  const description = `${quantity} active ${plural(quantity, 'user')} (${unitPriceString} each)`
  return <InvoiceLineItemContent description={description} amount={amount} />
}

export default createFragmentContainer(NextPeriodChargesLineItem, {
  item: graphql`
    fragment NextPeriodChargesLineItem_item on NextPeriodCharges {
      amount
      quantity
      unitPrice
    }
  `
})
