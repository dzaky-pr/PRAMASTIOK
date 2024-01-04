enum PermissionEnum {
  'user',
  'praktikan',
  'asisten',
  'admin',
  'all',
  'authed',
}

export type PermissionList = Array<keyof typeof PermissionEnum>;
