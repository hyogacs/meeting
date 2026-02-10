import { getResources } from "@/actions/resources";
import { CreateResourceForm } from "@/components/resources/create-resource-form";
import { ResourceCard } from "@/components/resources/resource-card";
import { FolderOpen } from "lucide-react";

export default async function ResourcesPage() {
  const resourceList = await getResources();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">资源库</h1>
        <p className="mt-1 text-sm text-gray-500">
          团队共享的学习资料和工具
        </p>
      </div>

      <CreateResourceForm />

      {resourceList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-3 text-sm font-medium text-gray-900">
            资源库是空的
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            添加论文、教程、视频等学习资源
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceList.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
