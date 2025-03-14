import { admin_directory_v1, google } from 'googleapis';
import { JWT } from 'google-auth-library';
import Schema$Group = admin_directory_v1.Schema$Group;

export async function getGoogleDirectoryClient(): Promise<JWT> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    !process.env.GOOGLE_ADMIN_EMAIL
  ) {
    throw new Error('Google service account credentials not configured');
  }
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    [
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      'https://www.googleapis.com/auth/admin.directory.group.readonly',
    ],
    process.env.GOOGLE_ADMIN_EMAIL,
  );

  await jwtClient.authorize();
  return jwtClient;
}

export async function getUserGroups(email: string): Promise<Schema$Group[]> {
  const auth = await getGoogleDirectoryClient();
  const admin = google.admin({ version: 'directory_v1', auth });

  try {
    const response = await admin.groups.list({
      userKey: email,
    });

    return response.data.groups || [];
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
}

const enum Role {
  Admin = 'admin',
  Editor = 'editor',
  Member = 'member',
}

export function mapGroupsToRole(groups: Schema$Group[]): Role {
  const roleMap: Record<string, Role> = {
    'administratie@belarusians.nl': Role.Admin,
    'editors@belarusians.nl': Role.Editor,
  };

  const roleHierarchy = [Role.Admin, Role.Editor, Role.Member];
  let highestRole = Role.Member;

  for (const group of groups) {
    if (!group.email) continue;
    const mappedRole = roleMap[group.email];
    if (mappedRole && roleHierarchy.indexOf(mappedRole) < roleHierarchy.indexOf(highestRole)) {
      highestRole = mappedRole;
    }
  }

  return highestRole;
}
