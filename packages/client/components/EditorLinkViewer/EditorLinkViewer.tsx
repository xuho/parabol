import React, {Ref} from 'react'
import FlatButton from '../FlatButton'
import removeLink from '../../utils/draftjs/removeLink'
import dontTellDraft from '../../utils/draftjs/dontTellDraft'
import textOverflow from '../../styles/helpers/textOverflow'
import {EditorState} from 'draft-js'
import styled from '@emotion/styled'
import {PALETTE} from '../../styles/paletteV2'

const UrlSpan = styled('span')({
  ...textOverflow,
  alignItems: 'center',
  borderRight: `1px solid ${PALETTE.BORDER_MAIN}`,
  display: 'flex',
  flexShrink: 2,
  fontSize: 14,
  lineHeight: '32px',
  marginRight: 8,
  padding: '0 12px'
})

const LinkText = styled('a')({
  ...textOverflow,
  marginRight: 8,
  maxWidth: 320
})

const MenuStyles = styled('div')({
  alignItems: 'center',
  color: PALETTE.TEXT_MAIN,
  display: 'flex',
  fontSize: 20,
  padding: '0 8px'
})

interface Props {
  href: string
  addHyperlink: () => void
  innerRef: Ref<HTMLDivElement>
  editorState: EditorState
  setEditorState: (newEditorState: EditorState) => void
  removeModal: () => void
}

const EditorLinkViewer = (props: Props) => {
  const {href, addHyperlink, innerRef, editorState, removeModal, setEditorState} = props

  const handleRemove = () => {
    setEditorState(removeLink(editorState))
    removeModal()
  }

  const changeLink = () => {
    addHyperlink()
  }

  return (
    <MenuStyles onMouseDown={dontTellDraft} ref={innerRef}>
      <UrlSpan>
        <LinkText href={href} rel='noopener noreferrer' target='_blank'>
          {href}
        </LinkText>
      </UrlSpan>
      <FlatButton onClick={changeLink} palette='mid'>
        {'Change'}
      </FlatButton>
      <FlatButton onClick={handleRemove} palette='mid'>
        {'Remove'}
      </FlatButton>
    </MenuStyles>
  )
}

export default EditorLinkViewer
