# Basic Idea

- 指令 - dom 树（仅 HTML 结构）- 添加样式，使用原子化 css 来减少 token
- 问题：

已解决：

1. 如果给出带样式的例子，提示词会过长；并且 llm 无法生成 token 限制内的符合要求的页面（可以考虑只生成简单的例子）
2. token 限制即使设置为 1000 也不够用，问题在于需要消耗过多的 token。2000 个 token 勉强够用，但是还是很花钱
3. 只有一个例子的时候，生成什么都会长得像这个例子
4. 如果 html 是一点点生成的，则 tailwind 不会工作

未解决：

1. 生成页面功能在开发环境下能正常运作；但是在生产环境下输出的 HTML 只有一部分

- 功能性需求：

1. 添加历史记录，点击恢复生成的页面。这样可以部分解决 tailwind 不工作的问题
2. loading 加载提示
3. 添加选择和修改的部分。选择那一部分应该抽离成单独的逻辑，通过 dom 选择器来选择元素，而与页面本身无关
