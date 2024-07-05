import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { ref, createRef } from 'lit/directives/ref.js'

@customElement('yy-element')
class FirstLitElement extends LitElement {
  @property({ type: Number })
  estimatedItemSize = 50

  @state()
  templateStr = ''

  @state()
  listData = [
    { name: 'start', age: 1 },
    { name: 'Jane', age: 2 },
    { name: 'edTedT', age: 3 },
    { name: 'Alice', age: 4 },
    { name: 'Alice', age: 5 },
    { name: 'Alice', age: 6 },
    { name: 'Alice', age: 7 },
    {
      name: 'AlAliceAliceAliceAlAliceAliceAliceAliceAliceiceAlAliceAliceAliceAliceAliceiceAliceAliceice<br/>dw',
      age: 8,
    },
    { name: 'd', age: 9 },
    { name: 'end', age: 10 },
  ]

  @state()
  listDataKey = this.listData.map((item: any, index) => {
    return {
      ...item,
      _index: `_${index}`,
    }
  })

  @state()
  screenHeight = 0

  @state()
  start = 0

  @state()
  end = 0

  @state()
  visibleCount = [] as any

  @state()
  visibleData = [] as any

  changeVisibleCount() {
    this.visibleCount = Math.ceil(this.screenHeight / this.estimatedItemSize)
  }

  changeVisibleData() {
    this.visibleData = this.listDataKey.slice(this.start, this.end)
    this.dispatchEvent(new CustomEvent('virtualListChange', { detail: this.visibleData }))
  }

  @state()
  positions = [] as any

  getPositions() {
    this.positions.push(
      ...this.listData.slice(this.positions.length, this.listData.length).map((_, index: number) => {
        const indexRes = this.positions.length + index
        return {
          index: this.positions.length + index,
          height: this.estimatedItemSize,
          top: indexRes * this.estimatedItemSize,
          bottom: (indexRes + 1) * this.estimatedItemSize,
        }
      })
    )
  }

  listRef = createRef<any>()
  phantomRef = createRef<any>()
  contentRef = createRef<any>()
  itemsRef = createRef<any>()

  firstUpdated() {
    this.screenHeight = this.listRef.value?.clientHeight || 0
    this.changeVisibleCount()
    this.end = this.visibleCount
    this.changeVisibleData()
    this.getPositions()
  }

  fillTemplate(templateString: string, templateVars: any) {
    const resTemp = decodeURIComponent(templateString)
    return new Function('return `' + resTemp + '`;').call(templateVars)
  }

  getStartIndex = (scrollTop: number = 0) => {
    return this.binarySearch(this.positions, scrollTop)
  }
  binarySearch = (list: any[], value: number) => {
    let start = 0
    let end = list.length - 1
    let tempIndex = null
    while (start <= end) {
      let midIndex = Math.floor((start + end) / 2)
      let midValue = list[midIndex].bottom
      if (midValue === value) {
        return midIndex + 1
      } else if (midValue < value) {
        start = midIndex + 1
      } else if (midValue > value) {
        if (tempIndex === null || tempIndex > midIndex) {
          tempIndex = midIndex
        }
        end = end - 1
      }
    }
    return tempIndex
  }

  //获取当前的偏移量
  setStartOffset() {
    let startOffset = this.start >= 1 ? this.positions[this.start - 1].bottom : 0
    this.contentRef.value.style.transform = `translate3d(0,${startOffset}px,0)`
  }

  scrollEvent() {
    //当前滚动位置
    let scrollTop = this.listRef.value.scrollTop
    //此时的开始索引
    this.start = this.getStartIndex(scrollTop) || 0
    //此时的结束索引
    this.end = this.start + this.visibleCount
    this.changeVisibleData()
    //此时的偏移量
    this.setStartOffset()
  }
  updateItemsSize() {
    let nodes = this.contentRef.value!.children || []
    if (!this.templateStr) {
      const slots = []
      for (const node of nodes) {
        slots.push(...node.assignedNodes())
      }
      nodes = slots
    }
    for (const node of nodes) {
      if (!node?.getBoundingClientRect) continue
      let rect = node.getBoundingClientRect()
      let height = rect.height
      let index = +node.id.slice(1)
      let oldHeight = this.positions[index].height
      let dValue = oldHeight - height
      //存在差值
      if (dValue) {
        this.positions[index].bottom = this.positions[index].bottom - dValue
        this.positions[index].height = height
        for (let k = index + 1; k < this.positions.length; k++) {
          this.positions[k].top = this.positions[k - 1].bottom
          this.positions[k].bottom = this.positions[k].bottom - dValue
        }
      }
    }
  }

  updated() {
    //获取真实元素大小，修改对应的尺寸缓存
    this.updateItemsSize()
    const height = this.positions[this.positions.length - 1].bottom
    this.phantomRef.value.style.height = height + 'px'
    //更新真实偏移量
    this.setStartOffset()
  }

  render() {
    const template = this.querySelector('yy-template')!
    this.templateStr = template?.innerHTML || ''
    return html`
      <div>${this.start}-${this.end}</div>
      <div class="infinite-list-container" ${ref(this.listRef)} id="list" @scroll="${this.scrollEvent}">
        <div class="infinite-list-phantom" ${ref(this.phantomRef)}></div>
        <div class="infinite-list" ${ref(this.contentRef)}>
          ${this.templateStr
            ? this.visibleData.map(
                (item: any) =>
                  html`<div ${ref(this.itemsRef)} .id="${item._index}">
                    ${unsafeHTML(this.fillTemplate(this.templateStr, item))}
                  </div>`
              )
            : html`<slot></slot>`}
        </div>
      </div>
    `
  }

  static styles = css`
    .infinite-list-container {
      overflow: auto;
      position: relative;
      -webkit-overflow-scrolling: touch;
      height: var(--containerHeight, 200px);
      border: 1px #000 solid;
    }

    .infinite-list-phantom {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      z-index: -1;
    }

    .infinite-list {
      left: 0;
      right: 0;
      top: 0;
      position: absolute;
    }
  `
}
