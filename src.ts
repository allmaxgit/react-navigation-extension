import {
  RefObject,
} from 'react';
import {
  NavigationState,
  NavigationParams,
  NavigationContainerComponent,
  NavigationNavigateAction,
  NavigationResetAction,
  NavigationPopToTopAction,
  NavigationActions,
  StackActions,
} from 'react-navigation';

interface Navigator extends NavigationContainerComponent {
  state: {
    nav: NavigationState;
  };
  subs: {
    remove: () => void;
  };
}

const navigatorsByName: {
  [routeName: string]: Navigator | undefined;
} = {};

export const setNavigationContainer = (
  navigationName: string,
  {
    current: navigationContainerNode,
  }: RefObject<NavigationContainerComponent>,
  needRemoveSubs?: boolean,
) => {
  if (navigationContainerNode != null) {
    const navigator = (navigationContainerNode as Navigator);
    if (needRemoveSubs) {
      const { subs } = navigator;
      if (subs != null) {
        subs.remove();
      }
    }
    navigatorsByName[navigationName] = navigator;
  }
};

export const createNavigation = (navigationRouteName: string) => ({
  navigate: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction,
    key?: string,
  ) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const navigationAction = NavigationActions.navigate({
        routeName,
        params,
        action,
        key,
      });
      navigator.dispatch(navigationAction);
    }
  },
  setParams: (params: NavigationParams, key?: string) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const {
        state: {
          nav: {
            routes,
            index,
          },
        },
      } = navigator;
      const action = NavigationActions.setParams({
        key: key || routes[index].key,
        params,
      });
      navigator.dispatch(action);
    }
  },
  goBack: (key?: string | null) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const action = NavigationActions.back({ key });
      navigator.dispatch(action);
    }
  },
  push: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction,
    key?: string,
  ) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const pushAction = StackActions.push({
        routeName,
        params,
        action,
        key,
      });
      navigator.dispatch(pushAction);
    }
  },
  pop: (n?: number) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const action = StackActions.pop({ n });
      navigator.dispatch(action);
    }
  },
  reset: (routeName?: string | string[], params?: NavigationParams) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      let action: NavigationResetAction | NavigationPopToTopAction;
      if (routeName) {
        const actions: NavigationNavigateAction[] = [];
        let index: number;
        if (Array.isArray(routeName)) {
          index = routeName.length - 1;
          routeName.forEach((rn, i) => {
            const payload: {
              routeName: string;
              params?: NavigationParams;
              action?: NavigationNavigateAction;
              key?: string;
            } = { routeName: rn };
            if (i === index && params) {
              payload.params = params;
            }
            actions.push(NavigationActions.navigate(payload));
          });
        } else {
          actions.push(NavigationActions.navigate({ routeName, params }));
          index = 0;
        }
        action = StackActions.reset({ actions, index });
      } else {
        action = StackActions.popToTop({});
      }
      navigator.dispatch(action);
    }
  },
  getCanNavigateBack: () => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const {
        state: {
          nav: {
            index,
          },
        },
      } = navigator;
      return index > 0;
    }
    return false;
  },
  getCurrentRouteName: (): string | null => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator != null) {
      const {
        state: {
          nav: {
            routes,
            index,
          },
        },
      } = navigator;
      const { routeName } = routes[index];
      return routeName;
    }
    return null;
  },
});
