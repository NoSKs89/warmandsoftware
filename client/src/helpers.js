import React from 'react'
import { Transition, Trail, animated, config } from 'react-spring'

// Wrapper around react-springs Trail component.
// It will make each child (which must be a dom node) fade and trail in.
export class Slug extends React.PureComponent {
  render() {
    const {
      children,
      from = { opacity: 0, transform: 'translate3d(0,40px,0)' },
      to = { opacity: 1, transform: 'translate3d(0,0px,0)' },
      ...rest
    } = this.props
    const result = React.Children.map(children, child => styles => {
      const Component = animated[child.type] || animated(child.type)
      const props = {
        ...child.props,
        style: {
          willChange: 'opacity, transform',
          ...child.props.style,
          ...styles
        }
      }
      return <Component {...props} />
    })
    return (
      <Trail
        native
        config={config.slow}
        {...rest}
        keys={React.Children.map(children, (_, i) => 'trail_' + i)}
        from={from}
        to={to}
        children={result}
      />
    )
  }
}

// Wrapper around react-springs Transition.
// It will Transition the child node in and out depending on the "show" prop.
export class Fade extends React.PureComponent {
  render() {
    const {
      children,
      show,
      from = { opacity: 0 },
      enter = { opacity: 1 },
      leave = { opacity: 0 },
      ...rest
    } = this.props

    const { type, props } = children
    const Component = animated[type] || animated(type)
    const result = styles => {
      const newProps = {
        ...props,
        style: {
          willChange: 'opacity, transform',
          ...props.style,
          ...styles
        }
      }
      return <Component {...newProps} />
    }

    return (
      <Transition
        native
        config={config.slow}
        keys={show.toString()}
        {...rest}
        from={from}
        enter={enter}
        leave={leave}
        children={show ? result : undefined}
      />
    )
  }
}
