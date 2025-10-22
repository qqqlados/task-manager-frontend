import { http } from '@/lib/utils';

export const ProjectInvitationPage = async ({ params }: { params: { projectId: string; token: string } }) => {
  const { projectId, token } = await params;

  const handleClick = async () => {
    http(`/projects/${projectId}/invitations/accept/${token}`);
  };

  return <button onClick={handleClick}>Join!!!</button>;
};
