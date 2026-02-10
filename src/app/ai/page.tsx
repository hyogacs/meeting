import { AiChat } from "@/components/ai/ai-chat";

export default function AiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 助手</h1>
        <p className="mt-1 text-sm text-gray-500">
          基于团队学习资料的智能问答，帮你答疑解惑、推荐学习路径
        </p>
      </div>
      <AiChat />
    </div>
  );
}
