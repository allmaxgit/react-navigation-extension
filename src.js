/**
 * Created by Bardiaswift
 *
 * @flow
 */

/* eslint-disable no-underscore-dangle, camelcase */

import type { ElementRef } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import type {
  NavigationState,
  NavigationDispatch,
  NavigationContainer,
  NavigationScreenProp,
  NavigationParams,
  NavigationNavigateAction,
  NavigationResetAction,
  NavigationPopToTopAction,
} from 'react-navigation';

type Navigator = NavigationContainer<NavigationState, {}, {}> & {
  state: { nav: NavigationState },
  dispatch: NavigationDispatch,
};

const navigatorsByName: { [routeName: string]: ?Navigator } = {};

export const createNavigatiorSetter = (
  navigationName: string,
  needRemoveSubs?: true,
) => (navigator: ElementRef<*>) => {
  if (navigator && navigatorsByName[navigationName] == null) {
    if (needRemoveSubs) {
      const { subs } = navigator;
      if (subs) {
        subs.remove();
      }
    }
    navigatorsByName[navigationName] = navigator;
  }
}

export const createNavigation = (navigationRouteName: string) => ({
  navigate: (
    routeName: string,
    params?: NavigationParams,
    action?: ?NavigationNavigateAction,
    key?: string,
  ) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator) {
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
    if (navigator) {
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
  goBack: (key?: ?string) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator) {
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
    if (navigator) {
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
    if (navigator) {
      const action = StackActions.pop({ n });
      navigator.dispatch(action);
    }
  },
  reset: (routeName?: string | string[], params?: Object) => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator) {
      const {
        state: {
          nav: {
            routes,
            index,
          },
        },
      } = navigator;
      let action: NavigationResetAction | NavigationPopToTopAction;
      if (routeName) {
        const actions: Array<NavigationNavigateAction> = [];
        let index: number;
        if (Array.isArray(routeName)) {
          index = routeName.length - 1;
          routeName.forEach((rn, i) => {
            const payload: {
              routeName: string,
              params?: ?NavigationParams,
              action?: ?NavigationNavigateAction,
              key?: string,
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
    if (navigator) {
      const {
        state: {
          nav: {
            routes,
            index,
          },
        },
      } = navigator;
      return index > 0;
    }
    return false;
  },
  getCurrentRouteName: (): ?string => {
    const navigator = navigatorsByName[navigationRouteName];
    if (navigator) {
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
