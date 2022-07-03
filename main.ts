import { Editor, MarkdownView, Plugin } from 'obsidian'
import { SampleModal } from './src/SampleModal'
import { SampleSettingTab } from './src/SampleSettingTab'
import { ExampleView, VIEW_TYPE_EXAMPLE } from './src/view'

// 这是示例项目，也是了解插件的开始
interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
}
// 主要的两个钩子 onload 与 onunload，也可以说是生命周期函数，顺序是 onload => onunload
export default class MyPlugin extends Plugin {
  settings: MyPluginSettings

  async onload() {
    await this.loadSettings()

    this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf))

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon('dice', 'My COooo Plugin', (evt: MouseEvent) => {
      // Called when the user clicks the icon.
      // new Notice('Changed')
      this.activateView()
    })
    // Perform additional things with the ribbon
    ribbonIconEl.addClass('my-plugin-ribbon-class')

    // 状态栏添加图标或者信息，不会在移动端显示
    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem()
    statusBarItemEl.setText('Status Bar Text')

    // addCommand 增加命令选项，在你使用 ctrl/comd + p 时，或者开启 / 扩展时的命令，使用起来几乎是必备的方便

    // 这条命令可以在任何位置运行，只要你打开运行窗口
    this.addCommand({
      id: 'open-sample-modal-simple',
      name: 'Open sample modal (simple)',
      callback: () => {
        new SampleModal(this.app).open()
      },
    })
    // editorCallback 是针对编辑器的命令，这是当前的编辑器
    this.addCommand({
      id: 'sample-editor-command',
      name: 'Sample editor command',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection())
        editor.replaceSelection('Sample Editor Command')
      },
    })
    // checkCallback 会给你一个检查，用于多次重复的验证？比如你只能打开一个弹窗，已经打开就不用再打开
    // checking 是函数第二次执行的回调，第一次会尝试执行命令，确定命令是否可以运行
    // checking 为 true 执行初步检查
    // checking 为 false 执行操作
    this.addCommand({
      id: 'open-sample-modal-complex',
      name: 'Open sample modal (complex)',
      checkCallback: (checking: boolean) => {
        console.log('checking', checking)
        // Conditions to check
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView)
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking) {
            new SampleModal(this.app).open()
          }

          // This command will only show up in Command Palette when the check function returns true
          return true
        }
      },
    })

    // 这是提供设置选项的插件加载，
    this.addSettingTab(new SampleSettingTab(this.app, this))

    this.app.workspace.onLayoutReady(() => {
      console.log('ready')
    })

    // 最后两个是为了配合obsidian的内部函数，用于注册全局事件，和使用setInterval

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    //   console.log('click', evt)
    // })

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    // this.registerInterval(
    //   window.setInterval(() => {
    //     console.log('setInterval')
    //     const data = fuzzySearch(
    //       {
    //         query: 'tag:#猫',
    //         tokens: ['猫'],
    //         fuzzy: ['猫'],
    //       },
    //       '猫'
    //     )
    //     console.log('search')
    //     console.log(data)
    //   }, 60 * 1000)
    // )
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE)
  }

  // 加载插件设置，必须在加载插件 onLoad 的时候就使用它，
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  // 这并不知道是用来干嘛的，因为 Plugin 目前并未声明它
  async saveSettings() {
    await this.saveData(this.settings)
  }

  async activateView() {
    // this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE)
    // await this.app.workspace.getRightLeaf(false).setViewState({
    //   type: VIEW_TYPE_EXAMPLE,
    //   active: true,
    // })
    //
    // this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0])

    const workspace = this.app.workspace
    workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE)
    const leaf = workspace.getLeaf(false)
    await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE })
    workspace.revealLeaf(leaf)

    if (leaf.view.containerEl.querySelector('textarea') !== undefined) {
      leaf.view.containerEl.querySelector('textarea')!.focus()
    }
  }
}
