import { ProjectsService } from '@/services/projects.service';
import { PaginationComponent } from './pagination';
import { formatSnakeCase } from '@/lib/utils';
import Link from 'next/link';
import { CheckCircle, Clock, Circle, XCircle, User, FolderOpen } from 'lucide-react';
import { getCookies } from '@/lib/cookies';

const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return <Circle className="w-4 h-4 text-green-600" />;
    case 'COMPLETED':
      return <CheckCircle className="w-4 h-4 text-gray-600" />;
    case 'IN_PROGRESS':
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'PENDING':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'CANCELLED':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <FolderOpen className="w-4 h-4 text-gray-500" />;
  }
};

const getUserIcon = () => <User className="w-4 h-4 text-gray-600" />;

export const ProjectsList = async ({ searchParams }: { searchParams: { name?: string; status?: string; page?: number } }) => {
  const { name, status, page } = await searchParams;
  const query = {
    name,
    status,
    page,
  };

  const paginatedProjects = await ProjectsService.getProjects(query);
  const projects = paginatedProjects.data;

  const currentUser = await getCookies('user');

  return (
    <>
      <div className="flex flex-col justify-between gap-5 flex-1 h-full">
        <div className="rounded-box border border-base-300">
          {projects?.length ? (
            <div className="overflow-x-auto">
              <table className="table table-hover w-full">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th className="w-32">Status</th>
                    <th className="w-40">Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="hover">
                      <td className="flex gap-3 items-center">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={project?.image} alt="Project logo" />
                          </div>
                        </div>
                        <Link href={`projects/${project.id}`} className="hover:underline">
                          <div className="font-semibold">{project?.name}</div>
                          <div className="text-sm text-base-content/60">{formatSnakeCase(project?.type)}</div>
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <span className="text-lg">{getStatusIcon(project?.status)}</span>
                          <span className="badge badge-ghost uppercase text-xs px-2 py-1">{project?.status}</span>
                        </div>
                      </td>
                      <td>
                        {project?.lead?.name ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{getUserIcon()}</span>
                            <span className="badge badge-outline text-xs">{JSON.parse(currentUser!).name === project.lead.name ? 'Me' : project.lead.name}</span>
                          </div>
                        ) : (
                          <span className="text-base-content/40 text-xs">Not assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-base-content/60">No projects found</div>
          )}
        </div>
      </div>

      <PaginationComponent page={page ?? 1} totalPages={paginatedProjects.pagination.totalPages} />
    </>
  );
};
