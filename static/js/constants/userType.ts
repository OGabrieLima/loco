export enum UserTypeEnum {
  PARTNER = 1, // deprecated
  ADMIN = 3, // deprecated
  VIEWER = 2,
  ORGANIC = 10,
  LEGEND = 20,
  ROOKIE = 30,
  MASTER = 40,
  CHAMPION = 50,
}

const defualtUserType = 'other_streamer'

export const USER_TYPE: { [key: number]: string } = {
  // This values are used in Amplitude events
  [UserTypeEnum.PARTNER]: 'partner', // deprecated
  [UserTypeEnum.ADMIN]: 'admin', // deprecated

  [UserTypeEnum.VIEWER]: 'viewer',
  [UserTypeEnum.ORGANIC]: 'organic',
  [UserTypeEnum.LEGEND]: 'legend',
  [UserTypeEnum.ROOKIE]: 'rookie',
  [UserTypeEnum.MASTER]: 'master',
  [UserTypeEnum.CHAMPION]: 'champion',
}

export const getUserCategoryFromUserType = (user_type?: number) => {
  if (!user_type) return defualtUserType
  return USER_TYPE[user_type] || defualtUserType
}
