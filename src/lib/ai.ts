import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function summarizeMeeting(content: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `你是一个 AI 学习小组的会议助手。请对以下会议内容生成结构化的中文纪要：

${content}

请按以下格式输出：
## 讨论要点
- （3-5 条关键讨论内容）

## 行动项
- [ ] 谁 — 做什么 — 截止时间

## 关键决议
- （如有）

## 待解决问题
- （如有）`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function summarizeResource(
  title: string,
  content: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `请为以下学习资源生成中文摘要：

标题: ${title}
内容: ${content}

请按以下格式输出：
**一句话概括**: ...
**核心观点**:
1. ...
2. ...
3. ...
**推荐阅读优先级**: 高/中/低`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function chat(
  userMessage: string,
  context: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    system: `你是一个 AI 学习小组的智能助手。你可以根据团队的学习资料来回答问题、推荐学习路径、解释概念。

以下是团队已有的学习资料和记录：
${context}

请用中文回答，简洁明了。如果引用了团队资料请标注来源。`,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}
