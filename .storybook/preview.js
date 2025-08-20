import '../lib/src'
import './preview.css'
import { spread } from '@open-wc/lit-helpers'
import { within } from 'storybook/test'
import { html, unsafeStatic } from 'lit/static-html.js'

globalThis.COMPONENT_ID = 'lit-component'

globalThis.getComponent = (canvasElement) => {
  return within(canvasElement).findByTestId(COMPONENT_ID)
}

globalThis.renderComponent = (name, props) => {
  const tag = unsafeStatic(name)

  const attrs = Object
    .entries(props)
    .reduce((accum, [key, val]) => {
      const prefixedKey = typeof val === 'boolean'
        ? `?${key}`
        : `.${key}`

      return { ...accum, [prefixedKey]: val }
    }, {})

  return html`
    <${tag}
      id="${COMPONENT_ID}"
      data-testid="${COMPONENT_ID}"
      ${spread(attrs)}
    ></${tag}>
  `
}

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Theme for the component',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
      },
    },
  },
}