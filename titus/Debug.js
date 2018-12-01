const debugConsoleHTML = `
  <div class="debug-console">
    <h1>Debug Console</h1>
    <ul class="debug-console-content">

    </ul>
  </div>
`

const debugConsoleStyle = `
<style>
.debug-console {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  background: hsla(0, 50%, 50%, 0.5);
  color: hsl(0, 100%, 100%);
  height: 100vh;
}
</style>
`

const debugLineHTML = `
<dl>
  <dt>%TITLE%</dt>
  <dd>%CONTENT%</dd>
</dl>
`

class Debug {
  constructor () {

  }

  update () {
    const { addLineHTML, addLineToConsoleHTML } = this
    // Clear current data.
    // debugger
    this.console.contentEl.innerHTML = ''

    this.console.contentData.forEach(line => this.addLineToConsoleHTML(addLineHTML(line)))

    // Clear content data. New data will be added in on the next update cycle.
    this.console.contentData = []
  }

  /**
   * Show the debug console.
   */
  showConsole () {
    if (!this.console) {
      this.createDebugConsoleHTML()
    }
    
    document.body.querySelector('.debug-console').style.display = 'block' // not working when setting on the class element directly
  }

  /**
   * Hide the debug console.
   */
  hideConsole () {
    const el = document.body.querySelector('.debug-console')

    el.style.display = 'none'
  }

  /**
   * Add a line to the debug console.
   *
   * @param {string} title The line's title.
   * @param {mixed} content The line's content.
   *
   * @return {void}
   */
  addLine (title, content) {
    this.console.contentData.push({ title, content })
  }

  createDebugConsoleHTML () {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.outerHTML = debugConsoleHTML

    const style = document.createElement('style')
    document.head.appendChild(style)
    style.outerHTML = debugConsoleStyle

    this.console = el

    this.console.contentData = []

    this.console.contentEl = document.querySelector('.debug-console').querySelector('ul')
  }

  /**
   * Add a line of data to the debug console.
   *
   * @param {object} data An object representing a line of data.
   *
   * @return void
   */
  addLineHTML (data) {
    const { title, content } = data

    const lineHTML = debugLineHTML
      .replace('%TITLE%', title)
      .replace('%CONTENT%', content)
    
    return lineHTML
  }

  addLineToConsoleHTML (lineHTML) {
    const el = document.createElement('li')

    el.innerHTML = lineHTML

    this.console.contentEl.appendChild(el)
  }
}

export default Debug