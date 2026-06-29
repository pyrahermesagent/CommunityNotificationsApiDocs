import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null),
}