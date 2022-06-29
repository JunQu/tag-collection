import {App, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "../main";

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Hi Are you OK'});

		// 为了少写类型，这写的有点恶心
		// 这里设置一个选项名叫 Setting Plugin
		// 选项的描述 a secret
		// 选项是一个 Text 组件，也就是文本输入框，然后就是文本默认内容，改变它文本值
		const pluginSetting = new Setting(containerEl);
		pluginSetting
			.setName('Setting Plugin')
			.setDesc('a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
