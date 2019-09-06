import {getSAMLIdPQuery} from '../__generated__/getSAMLIdPQuery.graphql'
import {fetchQuery} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Atmosphere from '../Atmosphere'
import {ISAMLIdPOnQueryArguments} from '../types/graphql'

const query = graphql`
  query getSAMLIdPQuery($email: ID!, $isInvited: Boolean) {
    SAMLIdP(email: $email, isInvited: $isInvited)
  }
`

const getSAMLIdP = async (atmosphere: Atmosphere, variables: ISAMLIdPOnQueryArguments) => {
  let res
  try {
    res = await fetchQuery<getSAMLIdPQuery>(atmosphere, query, variables)
  } catch (e) {
    // server error, probably rate limited
    return null
  }
  return res && res.SAMLIdP
}

export default getSAMLIdP
