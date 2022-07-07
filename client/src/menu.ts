// 메뉴 4 뎁스
// 2 뎁스는 필수
// 3,4 뎁스는 옵션
// 3뎁스가 있으면 4뎁스도 필수

import { RouteRecordRaw, RouteComponent } from "vue-router";
import Lv1Route from './views/Lv1Route.vue'
import SubRoute from './views/SubRoute.vue'

export interface IMenuItem {
    name: string;
    key: string;
    children?: IMenuItemD2[];
    childrenLv3?: IMenuItemD3[];
    component?: RouteComponent | (() => Promise<RouteComponent>);
}

export interface IMenuItemD2 {
    name: string;
    key: string;
    children?: IMenuItemD3[];
    component?: RouteComponent | (() => Promise<RouteComponent>);
}

export interface IMenuItemD3 {
    name: string;
    key: string;
    children: IMenuItemD4[];
}

export interface IMenuItemD4 {
    name: string;
    key: string;
    component?: RouteComponent | (() => Promise<RouteComponent>);
}

export const menu: IMenuItem[] = [
    {
        name: "홈",
        key: "home",
        component: () => import("./views/Home.vue"),
    },
    {
        name: "조회",
        key: "search",
        children: [
            {
                name: "계정",
                key: "account",
                children: [
                    {
                        name: "조회1",
                        key: "search1",
                        children: [
                            { name: "서브조회1", key: "m1", component: () => import("./views/search/account/search1/SubSearch1.vue") },
                            { name: "서브조회2", key: "m2", component: () => import("./views/Home.vue") },
                            { name: "서브조회3", key: "m3", component: () => import("./views/Home.vue") }
                        ],
                    },
                    {
                        name: "조회2",
                        key: "search2",
                        children: [
                            { name: "서브조회2-1", key: "m1", component: () => import("./views/search/account/search1/SubSearch1.vue") },
                            { name: "서브조회2-2", key: "m2", component: () => import("./views/Home.vue") },
                            { name: "서브조회2-3", key: "m3", component: () => import("./views/Home.vue") }
                        ],
                    },
                ],
            },
            {
                name: "캐릭터",
                key: "character",
                children: [
                    {
                        name: "조회1",
                        key: "search1",
                        children: [
                            { name: "서브조회1", key: "m1", component: () => import("./views/Home.vue") },
                            { name: "서브조회2", key: "m2", component: () => import("./views/Home.vue") },
                            { name: "서브조회3", key: "m3", component: () => import("./views/Home.vue") }
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "로그",
        key: "log",
        childrenLv3:[
            {
                name: "조회1",
                key: "search1",
                children: [
                    { name: "서브로그조회1", key: "m1", component: () => import("./views/search/account/search1/SubSearch1.vue") },
                    { name: "서브로그조회2", key: "m2", component: () => import("./views/Home.vue") },
                    { name: "서브로그조회3", key: "m3", component: () => import("./views/Home.vue") }
                ],
            }
        ]
    },
    {
        name: "일괄 작업",
        key: "groupjob",
        component: () => import("./views/approve/Approve.vue"),
    },
    {
        name: "신고 처리",
        key: "claim",
        component: () => import("./views/approve/Approve.vue"),
    },
    {
        name: "해킹 처리",
        key: "hacking",
        component: () => import("./views/approve/Approve.vue"),
    },
    {
        name: "승인",
        key: "approve",
        component: () => import("./views/approve/Approve.vue"),
    },
    {
        name: "통계",
        key: "stat",
        component: () => import("./views/approve/Approve.vue"),
    },
    {
        name: "운영자",
        key: "operate",
        component: () => import("./views/approve/Approve.vue"),
    },
    {
        name: "관리자",
        key: "admin",
        component: () => import("./views/approve/Approve.vue"),
    },
];

export class MenuMan {
    static getMenu() {
        return menu;
    }
    static getLv3(path: string) {
        const p = path.split("/");
        p.shift();
        if (p.length < 2) return undefined;

        const m1Finded = menu.find((m1) => m1.key == p[0]);
        if (!m1Finded) return undefined;
        if (m1Finded.children) {
            const m2Finded = m1Finded.children.find((m2) => m2.key == p[1]);
            if (!m2Finded) return undefined;
            return m2Finded.children;
        }
        else if(m1Finded.childrenLv3) {
            return m1Finded.childrenLv3;
        }
        return undefined;
    }

    static getLv4(path: string) {
        const lv3 = MenuMan.getLv3(path)
        if( !lv3 ) return undefined
        const p = path.split("/");
        p.shift();
        const lv3Key = p.length == 4 ? p[2] : p[1]
        return lv3.find(m=>m.key==lv3Key)?.children
    }

    static makeRoutes(): RouteRecordRaw[] {
        const routes: RouteRecordRaw[] = [];
        for (const m1 of menu) {
            const setRedirectOrigin: Set<string> = new Set();
            if (!m1.children && !m1.childrenLv3) {                
                routes.push({ path: `/`, component: Lv1Route, children: [
                    { path: `/${m1.key}`, component: m1.component! }
                ] });
                continue;
            }

            if (m1.children ) {
                for (const m2 of m1.children) {
                    if (!m2.children) {
                        routes.push({ path: `/`, component: Lv1Route, children: [
                            { path: `/${m1.key}/${m2.key}`, component: m2.component! }
                        ] });
                        continue;
                    }

                    const subRouterKey = `/${m1.key}/${m2.key}`;
                    if (!routes.find((r) => r.path == subRouterKey)) {
                        routes.push({ path: subRouterKey, component: SubRoute, children: [] });
                    }

                    const subRoute = routes.find((r) => r.path == subRouterKey);
                    if (!subRoute) continue;

                    for (const m3 of m2.children) {
                        for (const m4 of m3.children) {
                            const linkURI = `/${m1.key}/${m2.key}/${m3.key}/${m4.key}`;
                            const redirectOrigin = `/${m1.key}/${m2.key}`;
                            if (!setRedirectOrigin.has(redirectOrigin)) {
                                subRoute.children!.push({ path: redirectOrigin, redirect: linkURI });
                                setRedirectOrigin.add(redirectOrigin);
                            }

                            subRoute.children!.push({ path: linkURI, component: m4.component! });
                        }
                    }
                }
            }
            else if( m1.childrenLv3 ) {
                const subRouterKey = `/${m1.key}`;
                if (!routes.find((r) => r.path == subRouterKey)) {
                    routes.push({ path: subRouterKey, component: SubRoute, children: [] });
                }

                const subRoute = routes.find((r) => r.path == subRouterKey);
                if (!subRoute) continue;                

                for( const m3 of m1.childrenLv3 ) {
                    for (const m4 of m3.children) {
                        const linkURI = `/${m1.key}/${m3.key}/${m4.key}`;
                        const redirectOrigin = `/${m1.key}`;
                        if (!setRedirectOrigin.has(redirectOrigin)) {
                            subRoute.children!.push({ path: redirectOrigin, redirect: linkURI });
                            setRedirectOrigin.add(redirectOrigin);
                        }

                        subRoute.children!.push({ path: linkURI, component: m4.component! });
                    }
                }
            }
                
        }

        return routes;
    }
}