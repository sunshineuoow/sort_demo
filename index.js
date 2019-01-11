import './index.less'
import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'


const dataLength = 40 // sort data length
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

class Node {
  constructor(value) {
    this.value = value
    this.isSorted = false
  }
}


class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      arr: new Array(dataLength), // arr to store data
      status: 0, // flag of starting
      type: 'bubble', // type of sort
      checkedIndex: -1,
      chosenIndex: -1
    }

    this.isAnimate = false

    this.checkStatus = this.checkStatus.bind(this)
    this.animate = this.animate.bind(this)
    this.handleChangeType = this.handleChangeType.bind(this)
    this.handleInsert = this.handleInsert.bind(this)
    this.handleStart = this.handleStart.bind(this)
  }

  componentDidMount() {
    this.handleInsert()
  }

  // check the sort status (if sorting raise a tip)
  checkStatus() {
    if (this.state.isStart) {
      alert('正在排序中，请停止排序后插入')
      return false
    }
    return true
  }

  // animate
  async animate() {
    const { stack } = this.state
    for (let i = 0; i < stack.length; i++) {
      await stack[i]()
    }
  }

  // change sort type
  handleChangeType(e) {
    this.setState({ type: e.target.value })
  }

  // init the arr and render the page
  handleInsert() {
    if (!this.checkStatus()) return
    const arr = new Array(dataLength)

    for (let i = 0; i < dataLength; i++) {
      arr[i] = new Node(Math.floor(Math.random() * 90 + 10))
    }

    this.setState({ arr })
  }

  // start sort
  handleStart() {
    if (!this.checkStatus()) return
    this.setState({ isStart: true })
    const arr = [...this.state.arr]
    const stack = []
    for (let i = 0; i < dataLength - 1; i++) {
      for (let j = i + 1; j < dataLength; j++) {
        const cb = async () => {
          if (arr[i].value > arr[j].value) {
            [arr[i], arr[j]] = [arr[j], arr[i]]
          }
          this.setState({ chosenIndex: j, checkedIndex: i, arr })
          await sleep(30)
        }
        stack.push(cb)
      }
      stack.push(() => {arr[i].isSorted = true})
    }
    this.setState({ stack }, this.animate)
  }


  render() {
    const { arr, type, chosenIndex, checkedIndex } = this.state

    return (
      <div className="page">
        <h1>A Demo for all kind of sort</h1>
        <div className="header">
          <div className="select">
            选择排序方式
            <select value={type} onChange={this.handleChangeType}>
              <option value="bubble">冒泡</option>
            </select>
          </div>
          <div className="btn-groups">
            <button onClick={this.handleInsert}>插入数据</button>
            <button onClick={this.handleStart}>开始</button>
            <button id="stop">停止</button>
          </div>
        </div>
        <section>
          <ul>
            {arr.map((item, index) => (
              <li
                className={`${checkedIndex === index ? 'checked' : ''} ${chosenIndex === index ? 'chosen' : ''} ${item.isSorted ? 'sorted' : ''}`}
                style={{ height: `${item.value}px` }}
                title={item.value}
                key={`${index}-${item.value}`}
              />
            ))}
          </ul>
        </section>
        <footer>
          <p>step 1. 选择排序方式</p>
          <p>step 2. 点击插入数据</p>
          <p>step 3. 点击开始</p>
        </footer>
      </div>
    )
  }
}


ReactDOM.render(
  <Page/>,
  document.getElementById('app')
)
