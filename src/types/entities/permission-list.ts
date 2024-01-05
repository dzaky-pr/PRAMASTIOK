enum PermissionEnum {
  'user',
  'praktikan',
  'asisten',
  'dosen',
  'koordinator',
  'admin',
  'all',
  'authed',
}

export type PermissionList = Array<keyof typeof PermissionEnum>;
