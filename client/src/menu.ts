// 메뉴 4 뎁스
// 2 뎁스는 필수
// 3,4 뎁스는 옵션
// 3뎁스가 있으면 4뎁스도 필수

export interface IMenuItem {
    name: string;
    key: string;
    children?: IMenuItemD2[];
    link?: string;
}

export interface IMenuItemD2 {
    name: string;
    key: string;
    children?: IMenuItemD3[];
    link?: string;
    component?: ()=> Promise<typeof import("*.vue")>;
}

export interface IMenuItemD3 {
    name: string;
    key: string;
    children: IMenuItemD4[];
}

export interface IMenuItemD4 {
    name: string;
    link: string;
    component: () => Promise<typeof import("*.vue")>;
}

export const menu: IMenuItem[] = [
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
                            { name: "서브조회1", link: "m1", component: () => import("./views/Home.vue") },
                            { name: "서브조회2", link: "m2", component: () => import("./views/Home.vue") },
                            { name: "서브조회3", link: "m3", component: () => import("./views/Home.vue") },
                        ],
                    },
                ],
            },
        ],
    },
];

export class MenuMan {    
    static makeRoutes() {
        return [{ path: "/", name: "", component: () => import("./views/Home.vue") }];
    }
}