import {
  ItemView,
  prepareQuery,
  fuzzySearch,
  request,
  renderResults,
  type WorkspaceLeaf,
} from 'obsidian'

export const VIEW_TYPE_EXAMPLE = 'example-view'

export class ExampleView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }
  getDisplayText(): string {
    return 'Example view'
  }

  getViewType(): string {
    return VIEW_TYPE_EXAMPLE
  }
  async onOpen() {
    console.log('containerEl')
    console.log(this.containerEl.children)
    const container = this.containerEl.children[1]
    container.empty()
    const child1 = container.createEl('h4', { text: 'example View' })
    const child2 = container.createEl('main', { text: 'Results show' })
    // const query = prepareQuery('tag#mao')
    // console.log('query', query)
    const results = fuzzySearch(
      {
        query: 'tag:#猫',
        tokens: ['猫'],
        fuzzy: ['猫'],
      },
      '猫'
    )
    console.log('results:', results)
    if (results) {
      renderResults(child2, 'Results in', results)
    }
  }
  async onClose() {}
}
