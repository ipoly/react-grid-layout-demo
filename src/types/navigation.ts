export interface NavigationState {
  /** 导航类型：主导航或右侧图标导航 */
  type: 'main' | 'icon';
  /** 导航路径数组，按层级顺序排列 */
  path: string[];
  /** 可选的来源标识符，用于标识特定的图标或特殊情况 */
  source?: string;
}

/** 导航变更回调函数类型 */
export type NavigationChangeHandler = (navigation: NavigationState) => void;

/** 向后兼容的导航回调函数类型 */
export type LegacyNavChangeHandler = (
  mainNav: string,
  subNav?: string,
  thirdNav?: string
) => void;

/** 向后兼容的右侧图标回调函数类型 */
export type LegacyRightIconChangeHandler = (
  iconId: string,
  subNav?: string
) => void;

/** 导航状态工具函数 */
export const NavigationUtils = {
  /** 从统一导航状态创建主导航状态 */
  toMainNavigation: (
    navigation: NavigationState
  ): [string, string?, string?] => {
    if (navigation.type === 'main') {
      return [navigation.path[0] || '', navigation.path[1], navigation.path[2]];
    }
    return ['', '', ''];
  },

  /** 从统一导航状态创建右侧图标导航状态 */
  toRightIconNavigation: (navigation: NavigationState): [string, string?] => {
    if (navigation.type === 'icon' && navigation.source) {
      return [navigation.source, navigation.path[0]];
    }
    return ['', ''];
  },

  /** 从主导航参数创建统一导航状态 */
  fromMainNavigation: (
    mainNav: string,
    subNav?: string,
    thirdNav?: string,
    source?: string
  ): NavigationState => {
    const path = [mainNav, subNav, thirdNav].filter(Boolean) as string[];
    return {
      type: 'main',
      path,
      source,
    };
  },

  /** 从右侧图标参数创建统一导航状态 */
  fromRightIconNavigation: (
    iconId: string,
    subNav?: string
  ): NavigationState => {
    const path = subNav ? [subNav] : [];
    return {
      type: 'icon',
      path,
      source: iconId,
    };
  },

  /** 判断两个导航状态是否相等 */
  isEqual: (a: NavigationState, b: NavigationState): boolean => {
    return (
      a.type === b.type &&
      a.source === b.source &&
      a.path.length === b.path.length &&
      a.path.every((item, index) => item === b.path[index])
    );
  },
};
