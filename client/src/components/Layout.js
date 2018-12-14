import React from 'react'

export const Row = (props) => (
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', ...props.style}}>
    {props.children}
  </div>
)

export const Col = (props) => (
  <div style={{display: 'flex', flexDirection: 'column', ...props.style}}>
    {props.children}
  </div>
)

export const Middle = (props) => (
  <div style={{
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...props.style,
  }}>
    {props.children}
  </div>
)

