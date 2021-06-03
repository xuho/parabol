import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {RefObject, useMemo} from 'react'
import {createFragmentContainer} from 'react-relay'
import {MeetingsDash_viewer} from '~/__generated__/MeetingsDash_viewer.graphql'
import blueSquiggle from '../../../static/images/illustrations/blue-squiggle.svg'
import yellowFlashLine from '../../../static/images/illustrations/yellow-flash-line.svg'
import useBreakpoint from '../hooks/useBreakpoint'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useInitialRender from '../hooks/useInitialRender'
import useTransition, {TransitionStatus} from '../hooks/useTransition'
import {Breakpoint, ElementHeight, ElementWidth, Layout} from '../types/constEnums'
import MeetingCard from './MeetingCard'
import MeetingsDashEmpty from './MeetingsDashEmpty'
import useCardsPerRow from '../hooks/useCardsPerRow'
import useTopPerRow from '../hooks/useTopPerRow'
import useDeepEqual from '../hooks/useDeepEqual'

interface Props {
  meetingsDashRef: RefObject<HTMLDivElement>
  viewer: MeetingsDash_viewer | null
}

const Wrapper = styled('div')<{maybeTabletPlus: boolean; minHeight: number}>(
  ({maybeTabletPlus, minHeight}) => ({
    padding: maybeTabletPlus ? 0 : 16,
    minHeight
  })
)

const EmptyContainer = styled('div')({
  display: 'flex',
  flex: 1,
  height: '100%',
  margin: '0 auto',
  maxWidth: Layout.TASK_COLUMNS_MAX_WIDTH,
  padding: 16,
  position: 'relative'
})

const Squiggle = styled('img')({
  bottom: 80,
  display: 'block',
  position: 'absolute',
  right: 160
})

const Flash = styled('img')({
  bottom: 56,
  display: 'block',
  position: 'absolute',
  right: -32
})

const MeetingsDash = (props: Props) => {
  const {meetingsDashRef, viewer} = props
  const teams = viewer?.teams ?? []
  const activeMeetings = useMemo(() => {
    const meetings = teams
      .flatMap((team) => team.activeMeetings)
      .filter(Boolean)
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    return meetings.map((meeting, displayIdx) => ({
      ...meeting,
      key: meeting.id,
      displayIdx
    }))
  }, [teams])
  const transitioningMeetings = useTransition(activeMeetings)
  const maybeBigDisplay = useBreakpoint(Breakpoint.BIG_DISPLAY)
  const maybeTabletPlus = useBreakpoint(Breakpoint.FUZZY_TABLET)
  const isInit = useInitialRender()
  const cardsPerRow = useCardsPerRow(meetingsDashRef)
  const memodMeetings = useDeepEqual(activeMeetings)
  const topByRow = useTopPerRow(cardsPerRow, memodMeetings)
  const hasMeetings = activeMeetings.length > 0
  const totalRows = !memodMeetings.length ? 0 : Math.ceil(memodMeetings.length / cardsPerRow)
  useDocumentTitle('Meetings | Parabol', 'Meetings')
  if (!viewer || isInit) return null
  return (
    <>
      {hasMeetings ? (
        <Wrapper
          maybeTabletPlus={maybeTabletPlus}
          minHeight={
            ElementHeight.MEETING_CARD_WITH_MARGIN * totalRows + ElementHeight.MEETING_CARD_MARGIN
          }
        >
          {transitioningMeetings.map((meeting, idx) => {
            const rowIdx = Math.floor(idx / cardsPerRow)
            const topForAvatars = topByRow[rowIdx]?.top || 0
            const leftMargin = maybeBigDisplay
              ? ElementWidth.MEETING_CARD_LARGE_MARGIN
              : ElementWidth.MEETING_CARD_MARGIN
            return (
              <MeetingCard
                key={meeting.child.createdAt}
                left={ElementWidth.MEETING_CARD_WITH_MARGIN * (idx % cardsPerRow) + leftMargin}
                top={
                  ElementHeight.MEETING_CARD_WITH_MARGIN * rowIdx +
                  ElementHeight.MEETING_CARD_MARGIN +
                  topForAvatars
                }
                meeting={meeting.child}
                onTransitionEnd={meeting.onTransitionEnd}
                status={isInit ? TransitionStatus.ENTERED : meeting.status}
              />
            )
          })}
        </Wrapper>
      ) : (
        <EmptyContainer>
          <MeetingsDashEmpty />
          {maybeBigDisplay ? (
            <>
              <Squiggle src={blueSquiggle} />
              <Flash src={yellowFlashLine} />
            </>
          ) : null}
        </EmptyContainer>
      )}
    </>
  )
}

graphql`
  fragment MeetingsDashActiveMeetings on Team {
    activeMeetings {
      ...MeetingCard_meeting
      ...useSnacksForNewMeetings_meetings
      id
      createdAt
      meetingMembers {
        user {
          isConnected
          lastSeenAtURLs
        }
      }
    }
  }
`

export default createFragmentContainer(MeetingsDash, {
  viewer: graphql`
    fragment MeetingsDash_viewer on User {
      id
      teams {
        ...MeetingsDashActiveMeetings @relay(mask: false)
      }
    }
  `
})
