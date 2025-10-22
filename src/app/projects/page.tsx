import { ProjectsList } from "@/components/projects-list";
import { ProjectsSidebar } from "@/components/projects-sidebar";
import { SearchInput } from "@/components/search-input";
import { FC, Suspense } from "react";

const ProjectsPage = async ({
  searchParams,
}: {
  searchParams: { name?: string; status?: string; page?: number };
}) => {
  const { name, status, page } = await searchParams;

  return (
    <div className="flex flex-col gap-7 flex-1 h-full">
      <SearchInput />

      <div className="flex gap-6 flex-1">
        <div className="flex-1">
          <Suspense
            key={name || status || page}
            fallback={
              <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <ProjectsList searchParams={searchParams} />
          </Suspense>
        </div>

        <div className="flex-shrink-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <ProjectsSidebar searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
