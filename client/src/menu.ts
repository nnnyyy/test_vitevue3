// 메뉴 4 뎁스
// 2 뎁스는 필수
// 3,4 뎁스는 옵션
// 3뎁스가 있으면 4뎁스도 필수

import { RouteRecordRaw, RouteComponent } from "vue-router";

export interface IMenuItem {
    name: string;
    key: string;
    children?: IMenuItemD2[];
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
                            { name: "서브조회1", key: "m1", component: () => import("./views/Home.vue") },
                            { name: "서브조회2", key: "m2", component: () => import("./views/Home.vue") },
                            { name: "서브조회3", key: "m3", component: () => import("./views/Home.vue") },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "로그",
        key: "log",
        component: () => import("./views/approve/Approve.vue"),
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
        component: () => import("./views/approve/Approve.vue")
    }
];

export class MenuMan {
    static getMenu() { return menu }
    static makeRoutes() : RouteRecordRaw[] {
        const routes: RouteRecordRaw[] = [];
        for( const m1 of menu ) {
            if( !m1.children ) {
                routes.push({ path: `/${m1.key}`, component: m1.component! });
                continue;
            }

            for( const m2 of m1.children ) {
                if( !m2.children ) {
                    routes.push({ path: `/${m1.key}/${m2.key}`, component: m2.component! });
                    continue
                }

                for( const m3 of m2.children ) {
                    for( const m4 of m3.children ) {
                        routes.push({ path: `/${m1.key}/${m2.key}/${m3.key}/${m4.key}`, component: m2.component! });
                    }
                }
            }
        }

        return routes
    }
}