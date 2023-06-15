// project import

import { IconChartArcs, IconClipboardList, IconChartInfographic } from '@tabler/icons';
import { NavItemType } from 'types';
import useRouteStore from 'store/router';
import { AppCustomRouteRecordRaw } from 'types/router';
import { useMemo } from 'react';

const icons = {
    widget: IconChartArcs,
    statistics: IconChartArcs,
    data: IconClipboardList,
    chart: IconChartInfographic
};
// ==============================|| MENU ITEMS - API ||============================== //

export const RuoyiMenu = () => {
    const routes = useRouteStore((store) => store.routes);

    const ruoyiMenu = useMemo(() => {
        const convertToNavItemType = (routeObj: AppCustomRouteRecordRaw, isTopLevel: boolean = false): NavItemType => {
            let navItem: NavItemType = {
                id: routeObj?.id.toString(),
                //@ts-ignore
                icon: icons[routeObj?.icon],
                url: routeObj?.path,
                title: routeObj?.name,
                type: routeObj?.children ? 'collapse' : 'item',
                ...(isTopLevel && { color: 'primary', type: 'group' }) // Only add color if it's a top-level item
            };

            if (routeObj.children) {
                navItem = { ...navItem, children: routeObj.children.map((childRouteObj) => convertToNavItemType(childRouteObj)) };
            }

            return navItem;
        };
        const convertRouteList = (routeList: AppCustomRouteRecordRaw[]) => {
            return routeList.map((routeObj) => convertToNavItemType(routeObj, true)); // setting isTopLevel as true for all items in routeList
        };
        if (routes) {
            const convertedMenuList = convertRouteList(routes);
            return convertedMenuList; // 返回数组而非对象
        }
    }, [routes]); // 仅当 routes 变化时重新计算 getMenu 的值

    return ruoyiMenu;
};
