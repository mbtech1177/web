// PARTS ARE FROM https://github.com/plotly/react-plotly.js/blob/master/src/factory.js

const isBrowser = typeof window !== 'undefined';

class Plot extends React.Component {
  p = Promise.resolve()
  resizeHandler = null
  getRef = (el) => {
    this.el = el

    if (this.props.debug && isBrowser) {
      window.gd = this.el
    }
  }

  syncWindowResize = (propsIn, invoke) => {
    const props = propsIn || this.props;

    if (!isBrowser) {
      return
    }

    if (!this.resizeHandler) {
      this.resizeHandler = () => {
        return Plotly.Plots.resize(this.el)
      }
      window.addEventListener('resize', this.resizeHandler)
      if (invoke) {
        this.resizeHandler()
      }
    } else if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
  }


  componentDidMount() {
    this.p = this.p
      .then(() => {
        if (!this.el) {
          throw new Error('Missing element reference')
        }

        const { data, layout, config, frames } = this.props

        return Plotly.newPlot(this.el, {
          data,
          layout,
          config,
          frames,
        })
      })
      .then(() => this.syncWindowResize(null, true))
  }

  componentWillUnmount() {
    Plotly.purge(this.el)
  }

  UNSAFE_componentWillUpdate(nextProps) {
    this.p = this.p
      .then(() => {
        if (!this.el) {
          throw new Error('Missing element reference')
        }

        const { data, layout, config, frames } = nextProps

        return Plotly.react(this.el, {
          data,
          layout,
          config,
          frames,
        })
      })
      .then(() => this.syncWindowResize(nextProps))
  }

  render() {
     return (
       <div
         id={this.props.divId}
         style={this.props.style}
         ref={this.getRef}
         className={this.props.className}
       />
     )
   }

}
