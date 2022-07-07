/* eslint-disable no-async-promise-executor */
import Logger from './Logger'
import {DBWrapper} from './DB'
import {OutPacket} from './Packet'
import ToolDataServer from './ToolDataServer'
import {TOOL_DATA_SERVER_PACKET, MAPLE_SEARCH_SERVER_PACKET} from './Protocol_ToolDataServer'

const imgList:string[] = [
    `Skill/RidingSkillInfo.img`,
]

const jobcode = [
    { jobcode: 0, subcode: -1, adv: 0, name: '초보자' },
    { jobcode: 100, subcode: -1, adv: 1, name: '검사' },
    { jobcode: 110, subcode: -1, adv: 2, name: '히어로' },
    { jobcode: 111, subcode: -1, adv: 3, name: '히어로' },
    { jobcode: 112, subcode: -1, adv: 4, name: '히어로' },
    { jobcode: 113, subcode: -1, adv: 5, name: '히어로' },
    { jobcode: 120, subcode: -1, adv: 2, name: '팔라딘' },
    { jobcode: 121, subcode: -1, adv: 3, name: '팔라딘' },
    { jobcode: 122, subcode: -1, adv: 4, name: '팔라딘' },
    { jobcode: 123, subcode: -1, adv: 5, name: '팔라딘' },
    { jobcode: 130, subcode: -1, adv: 2, name: '다크나이트' },
    { jobcode: 131, subcode: -1, adv: 3, name: '다크나이트' },
    { jobcode: 132, subcode: -1, adv: 4, name: '다크나이트' },
    { jobcode: 133, subcode: -1, adv: 5, name: '다크나이트' },
    { jobcode: 200, subcode: -1, adv: 1, name: '매지션' },
    { jobcode: 210, subcode: -1, adv: 2, name: '불독' },
    { jobcode: 211, subcode: -1, adv: 3, name: '불독' },
    { jobcode: 212, subcode: -1, adv: 4, name: '불독' },
    { jobcode: 213, subcode: -1, adv: 5, name: '불독' },
    { jobcode: 220, subcode: -1, adv: 2, name: '썬콜' },
    { jobcode: 221, subcode: -1, adv: 3, name: '썬콜' },
    { jobcode: 222, subcode: -1, adv: 4, name: '썬콜' },
    { jobcode: 223, subcode: -1, adv: 5, name: '썬콜' },
    { jobcode: 230, subcode: -1, adv: 2, name: '비숍' },
    { jobcode: 231, subcode: -1, adv: 3, name: '비숍' },
    { jobcode: 232, subcode: -1, adv: 4, name: '비숍' },
    { jobcode: 233, subcode: -1, adv: 5, name: '비숍' },
    { jobcode: 300, subcode: -1, adv: 1, name: '아처' },
    { jobcode: 310, subcode: -1, adv: 2, name: '보우마스터' },
    { jobcode: 311, subcode: -1, adv: 3, name: '보우마스터' },
    { jobcode: 312, subcode: -1, adv: 4, name: '보우마스터' },
    { jobcode: 313, subcode: -1, adv: 5, name: '보우마스터' },
    { jobcode: 320, subcode: -1, adv: 2, name: '신궁' },
    { jobcode: 321, subcode: -1, adv: 3, name: '신궁' },
    { jobcode: 322, subcode: -1, adv: 4, name: '신궁' },
    { jobcode: 323, subcode: -1, adv: 5, name: '신궁' },
    { jobcode: 0, subcode: 3, adv: 0, name: '패스파인더' },
    { jobcode: 301, subcode: 3, adv: 1, name: '패스파인더' },
    { jobcode: 330, subcode: 3, adv: 2, name: '패스파인더' },
    { jobcode: 331, subcode: 3, adv: 3, name: '패스파인더' },
    { jobcode: 332, subcode: 3, adv: 4, name: '패스파인더' },
    { jobcode: 333, subcode: 3, adv: 5, name: '패스파인더' },
    { jobcode: 400, subcode: -1, adv: 1, name: '로그' },
    { jobcode: 410, subcode: -1, adv: 2, name: '나이트로드' },
    { jobcode: 411, subcode: -1, adv: 3, name: '나이트로드' },
    { jobcode: 412, subcode: -1, adv: 4, name: '나이트로드' },
    { jobcode: 413, subcode: -1, adv: 5, name: '나이트로드' },
    { jobcode: 420, subcode: -1, adv: 2, name: '섀도어' },
    { jobcode: 421, subcode: -1, adv: 3, name: '섀도어' },
    { jobcode: 422, subcode: -1, adv: 4, name: '섀도어' },
    { jobcode: 423, subcode: -1, adv: 5, name: '섀도어' },
    { jobcode: 0, subcode: 1, adv: 0, name: '듀얼블레이드' },
    { jobcode: 400, subcode: 1, adv: 1, name: '듀얼블레이드' },
    { jobcode: 430, subcode: 1, adv: 1.5, name: '듀얼블레이드' },
    { jobcode: 431, subcode: 1, adv: 2, name: '듀얼블레이드' },
    { jobcode: 432, subcode: 1, adv: 2.5, name: '듀얼블레이드' },
    { jobcode: 433, subcode: 1, adv: 3, name: '듀얼블레이드' },
    { jobcode: 434, subcode: 1, adv: 4, name: '듀얼블레이드' },
    { jobcode: 435, subcode: 1, adv: 5, name: '듀얼블레이드' },
    { jobcode: 500, subcode: -1, adv: 1, name: '해적' },
    { jobcode: 510, subcode: -1, adv: 2, name: '바이퍼' },
    { jobcode: 511, subcode: -1, adv: 3, name: '바이퍼' },
    { jobcode: 512, subcode: -1, adv: 4, name: '바이퍼' },
    { jobcode: 513, subcode: -1, adv: 5, name: '바이퍼' },
    { jobcode: 520, subcode: -1, adv: 2, name: '캡틴' },
    { jobcode: 521, subcode: -1, adv: 3, name: '캡틴' },
    { jobcode: 522, subcode: -1, adv: 4, name: '캡틴' },
    { jobcode: 523, subcode: -1, adv: 5, name: '캡틴' },
    { jobcode: 0, subcode: 2, adv: 0, name: '캐논슈터' },
    { jobcode: 501, subcode: 2, adv: 1, name: '캐논슈터' },
    { jobcode: 530, subcode: 2, adv: 2, name: '캐논슈터' },
    { jobcode: 531, subcode: 2, adv: 3, name: '캐논슈터' },
    { jobcode: 532, subcode: 2, adv: 4, name: '캐논슈터' },
    { jobcode: 533, subcode: 2, adv: 5, name: '캐논슈터' },
    { jobcode: 800, subcode: -1, adv: 0, name: '매니저' },
    { jobcode: 900, subcode: -1, adv: 0, name: '운영자' },
    { jobcode: 1000, subcode: -1, adv: 0, name: '노블레스' },
    { jobcode: 1100, subcode: -1, adv: 1, name: '소울마스터' },
    { jobcode: 1110, subcode: -1, adv: 2, name: '소울마스터' },
    { jobcode: 1111, subcode: -1, adv: 3, name: '소울마스터' },
    { jobcode: 1112, subcode: -1, adv: 4, name: '소울마스터' },
    { jobcode: 1113, subcode: -1, adv: 5, name: '소울마스터' },
    { jobcode: 1200, subcode: -1, adv: 1, name: '플레임위자드' },
    { jobcode: 1210, subcode: -1, adv: 2, name: '플레임위자드' },
    { jobcode: 1211, subcode: -1, adv: 3, name: '플레임위자드' },
    { jobcode: 1212, subcode: -1, adv: 4, name: '플레임위자드' },
    { jobcode: 1213, subcode: -1, adv: 5, name: '플레임위자드' },
    { jobcode: 1300, subcode: -1, adv: 1, name: '윈드브레이커' },
    { jobcode: 1310, subcode: -1, adv: 2, name: '윈드브레이커' },
    { jobcode: 1311, subcode: -1, adv: 3, name: '윈드브레이커' },
    { jobcode: 1312, subcode: -1, adv: 4, name: '윈드브레이커' },
    { jobcode: 1313, subcode: -1, adv: 5, name: '윈드브레이커' },
    { jobcode: 1400, subcode: -1, adv: 1, name: '나이트워커' },
    { jobcode: 1410, subcode: -1, adv: 2, name: '나이트워커' },
    { jobcode: 1411, subcode: -1, adv: 3, name: '나이트워커' },
    { jobcode: 1412, subcode: -1, adv: 4, name: '나이트워커' },
    { jobcode: 1413, subcode: -1, adv: 5, name: '나이트워커' },
    { jobcode: 1500, subcode: -1, adv: 1, name: '스트라이커' },
    { jobcode: 1510, subcode: -1, adv: 2, name: '스트라이커' },
    { jobcode: 1511, subcode: -1, adv: 3, name: '스트라이커' },
    { jobcode: 1512, subcode: -1, adv: 4, name: '스트라이커' },
    { jobcode: 1513, subcode: -1, adv: 5, name: '스트라이커' },
    { jobcode: 2000, subcode: -1, adv: 0, name: '아란' },
    { jobcode: 2100, subcode: -1, adv: 1, name: '아란' },
    { jobcode: 2110, subcode: -1, adv: 2, name: '아란' },
    { jobcode: 2111, subcode: -1, adv: 3, name: '아란' },
    { jobcode: 2112, subcode: -1, adv: 4, name: '아란' },
    { jobcode: 2113, subcode: -1, adv: 5, name: '아란' },
    { jobcode: 2001, subcode: -1, adv: 0, name: '에반' },
    { jobcode: 2200, subcode: -1, adv: 1, name: '에반' },
    { jobcode: 2211, subcode: -1, adv: 2, name: '에반' },
    { jobcode: 2214, subcode: -1, adv: 3, name: '에반' },
    { jobcode: 2217, subcode: -1, adv: 4, name: '에반' },
    { jobcode: 2219, subcode: -1, adv: 5, name: '에반' },
    { jobcode: 2002, subcode: -1, adv: 0, name: '메르세데스' },
    { jobcode: 2300, subcode: -1, adv: 1, name: '메르세데스' },
    { jobcode: 2310, subcode: -1, adv: 2, name: '메르세데스' },
    { jobcode: 2311, subcode: -1, adv: 3, name: '메르세데스' },
    { jobcode: 2312, subcode: -1, adv: 4, name: '메르세데스' },
    { jobcode: 2313, subcode: -1, adv: 5, name: '메르세데스' },
    { jobcode: 2003, subcode: -1, adv: 0, name: '팬텀' },
    { jobcode: 2400, subcode: -1, adv: 1, name: '팬텀' },
    { jobcode: 2410, subcode: -1, adv: 2, name: '팬텀' },
    { jobcode: 2411, subcode: -1, adv: 3, name: '팬텀' },
    { jobcode: 2412, subcode: -1, adv: 4, name: '팬텀' },
    { jobcode: 2413, subcode: -1, adv: 5, name: '팬텀' },
    { jobcode: 2004, subcode: -1, adv: 0, name: '루미너스' },
    { jobcode: 2700, subcode: -1, adv: 1, name: '루미너스' },
    { jobcode: 2710, subcode: -1, adv: 2, name: '루미너스' },
    { jobcode: 2711, subcode: -1, adv: 3, name: '루미너스' },
    { jobcode: 2712, subcode: -1, adv: 4, name: '루미너스' },
    { jobcode: 2713, subcode: -1, adv: 5, name: '루미너스' },
    { jobcode: 2005, subcode: -1, adv: 0, name: '은월' },
    { jobcode: 2500, subcode: -1, adv: 1, name: '은월' },
    { jobcode: 2510, subcode: -1, adv: 2, name: '은월' },
    { jobcode: 2511, subcode: -1, adv: 3, name: '은월' },
    { jobcode: 2512, subcode: -1, adv: 4, name: '은월' },
    { jobcode: 2513, subcode: -1, adv: 5, name: '은월' },
    { jobcode: 3001, subcode: -1, adv: 0, name: '데몬' },
    { jobcode: 3100, subcode: -1, adv: 1, name: '데몬슬레이어' },
    { jobcode: 3110, subcode: -1, adv: 2, name: '데몬슬레이어' },
    { jobcode: 3111, subcode: -1, adv: 3, name: '데몬슬레이어' },
    { jobcode: 3112, subcode: -1, adv: 4, name: '데몬슬레이어' },
    { jobcode: 3113, subcode: -1, adv: 5, name: '데몬슬레이어' },
    { jobcode: 3101, subcode: -1, adv: 1, name: '데몬어벤져' },
    { jobcode: 3120, subcode: -1, adv: 2, name: '데몬어벤져' },
    { jobcode: 3121, subcode: -1, adv: 3, name: '데몬어벤져' },
    { jobcode: 3122, subcode: -1, adv: 4, name: '데몬어벤져' },
    { jobcode: 3123, subcode: -1, adv: 5, name: '데몬어벤져' },
    { jobcode: 3000, subcode: -1, adv: 0, name: '시티즌' },
    { jobcode: 3200, subcode: -1, adv: 1, name: '배틀메이지' },
    { jobcode: 3210, subcode: -1, adv: 2, name: '배틀메이지' },
    { jobcode: 3211, subcode: -1, adv: 3, name: '배틀메이지' },
    { jobcode: 3212, subcode: -1, adv: 4, name: '배틀메이지' },
    { jobcode: 3213, subcode: -1, adv: 5, name: '배틀메이지' },
    { jobcode: 3300, subcode: -1, adv: 1, name: '와일드헌터' },
    { jobcode: 3310, subcode: -1, adv: 2, name: '와일드헌터' },
    { jobcode: 3311, subcode: -1, adv: 3, name: '와일드헌터' },
    { jobcode: 3312, subcode: -1, adv: 4, name: '와일드헌터' },
    { jobcode: 3313, subcode: -1, adv: 5, name: '와일드헌터' },
    { jobcode: 3500, subcode: -1, adv: 1, name: '메카닉' },
    { jobcode: 3510, subcode: -1, adv: 2, name: '메카닉' },
    { jobcode: 3511, subcode: -1, adv: 3, name: '메카닉' },
    { jobcode: 3512, subcode: -1, adv: 4, name: '메카닉' },
    { jobcode: 3513, subcode: -1, adv: 5, name: '메카닉' },
    { jobcode: 3002, subcode: -1, adv: 0, name: '제논' },
    { jobcode: 3600, subcode: -1, adv: 1, name: '제논' },
    { jobcode: 3610, subcode: -1, adv: 2, name: '제논' },
    { jobcode: 3611, subcode: -1, adv: 3, name: '제논' },
    { jobcode: 3612, subcode: -1, adv: 4, name: '제논' },
    { jobcode: 3613, subcode: -1, adv: 5, name: '제논' },
    { jobcode: 3700, subcode: -1, adv: 1, name: '블래스터' },
    { jobcode: 3710, subcode: -1, adv: 2, name: '블래스터' },
    { jobcode: 3711, subcode: -1, adv: 3, name: '블래스터' },
    { jobcode: 3712, subcode: -1, adv: 4, name: '블래스터' },
    { jobcode: 3713, subcode: -1, adv: 5, name: '블래스터' },
    { jobcode: 5000, subcode: -1, adv: 0, name: '미하일' },
    { jobcode: 5100, subcode: -1, adv: 1, name: '미하일' },
    { jobcode: 5110, subcode: -1, adv: 2, name: '미하일' },
    { jobcode: 5111, subcode: -1, adv: 3, name: '미하일' },
    { jobcode: 5112, subcode: -1, adv: 4, name: '미하일' },
    { jobcode: 5113, subcode: -1, adv: 5, name: '미하일' },
    { jobcode: 6000, subcode: -1, adv: 0, name: '카이저' },
    { jobcode: 6100, subcode: -1, adv: 1, name: '카이저' },
    { jobcode: 6110, subcode: -1, adv: 2, name: '카이저' },
    { jobcode: 6111, subcode: -1, adv: 3, name: '카이저' },
    { jobcode: 6112, subcode: -1, adv: 4, name: '카이저' },
    { jobcode: 6113, subcode: -1, adv: 5, name: '카이저' },
    { jobcode: 6003, subcode: -1, adv: 0, name: '카인' },
    { jobcode: 6300, subcode: -1, adv: 1, name: '카인' },
    { jobcode: 6310, subcode: -1, adv: 2, name: '카인' },
    { jobcode: 6311, subcode: -1, adv: 3, name: '카인' },
    { jobcode: 6312, subcode: -1, adv: 4, name: '카인' },
    { jobcode: 6313, subcode: -1, adv: 5, name: '카인' },
    { jobcode: 6002, subcode: -1, adv: 0, name: '카데나' },
    { jobcode: 6400, subcode: -1, adv: 1, name: '카데나' },
    { jobcode: 6410, subcode: -1, adv: 2, name: '카데나' },
    { jobcode: 6411, subcode: -1, adv: 3, name: '카데나' },
    { jobcode: 6412, subcode: -1, adv: 4, name: '카데나' },
    { jobcode: 6413, subcode: -1, adv: 5, name: '카데나' },
    { jobcode: 6001, subcode: -1, adv: 0, name: '엔젤릭버스터' },
    { jobcode: 6500, subcode: -1, adv: 1, name: '엔젤릭버스터' },
    { jobcode: 6510, subcode: -1, adv: 2, name: '엔젤릭버스터' },
    { jobcode: 6511, subcode: -1, adv: 3, name: '엔젤릭버스터' },
    { jobcode: 6512, subcode: -1, adv: 4, name: '엔젤릭버스터' },
    { jobcode: 6513, subcode: -1, adv: 5, name: '엔젤릭버스터' },
    { jobcode: 10000, subcode: -1, adv: 0, name: '제로' },
    { jobcode: 10100, subcode: -1, adv: 1, name: '제로' },
    { jobcode: 10110, subcode: -1, adv: 2, name: '제로' },
    { jobcode: 10111, subcode: -1, adv: 3, name: '제로' },
    { jobcode: 10112, subcode: -1, adv: 4, name: '제로' },
    { jobcode: 10113, subcode: -1, adv: 5, name: '제로' },
    { jobcode: 13000, subcode: -1, adv: 0, name: '핑크빈' },
    { jobcode: 13100, subcode: -1, adv: 1, name: '핑크빈' },
    { jobcode: 13001, subcode: -1, adv: 0, name: '예티' },
    { jobcode: 13500, subcode: -1, adv: 1, name: '예티' },
    { jobcode: 14000, subcode: -1, adv: 0, name: '키네시스' },
    { jobcode: 14200, subcode: -1, adv: 1, name: '키네시스' },
    { jobcode: 14210, subcode: -1, adv: 2, name: '키네시스' },
    { jobcode: 14211, subcode: -1, adv: 3, name: '키네시스' },
    { jobcode: 14212, subcode: -1, adv: 4, name: '키네시스' },
    { jobcode: 14213, subcode: -1, adv: 5, name: '키네시스' },
    { jobcode: 15002, subcode: -1, adv: 0, name: '아델' },
    { jobcode: 15100, subcode: -1, adv: 1, name: '아델' },
    { jobcode: 15110, subcode: -1, adv: 2, name: '아델' },
    { jobcode: 15111, subcode: -1, adv: 3, name: '아델' },
    { jobcode: 15112, subcode: -1, adv: 4, name: '아델' },
    { jobcode: 15113, subcode: -1, adv: 5, name: '아델' },
    { jobcode: 15000, subcode: -1, adv: 0, name: '일리움' },
    { jobcode: 15200, subcode: -1, adv: 1, name: '일리움' },
    { jobcode: 15210, subcode: -1, adv: 2, name: '일리움' },
    { jobcode: 15211, subcode: -1, adv: 3, name: '일리움' },
    { jobcode: 15212, subcode: -1, adv: 4, name: '일리움' },
    { jobcode: 15213, subcode: -1, adv: 5, name: '일리움' },
    { jobcode: 15001, subcode: -1, adv: 0, name: '아크' },
    { jobcode: 15500, subcode: -1, adv: 1, name: '아크' },
    { jobcode: 15510, subcode: -1, adv: 2, name: '아크' },
    { jobcode: 15511, subcode: -1, adv: 3, name: '아크' },
    { jobcode: 15512, subcode: -1, adv: 4, name: '아크' },
    { jobcode: 15513, subcode: -1, adv: 5, name: '아크' },
    { jobcode: 16001, subcode: -1, adv: 0, name: '라라' },
    { jobcode: 16200, subcode: -1, adv: 1, name: '라라' },
    { jobcode: 16210, subcode: -1, adv: 2, name: '라라' },
    { jobcode: 16211, subcode: -1, adv: 3, name: '라라' },
    { jobcode: 16212, subcode: -1, adv: 4, name: '라라' },
    { jobcode: 16213, subcode: -1, adv: 5, name: '라라' },
    { jobcode: 16000, subcode: -1, adv: 0, name: '호영' },
    { jobcode: 16400, subcode: -1, adv: 1, name: '호영' },
    { jobcode: 16410, subcode: -1, adv: 2, name: '호영' },
    { jobcode: 16411, subcode: -1, adv: 3, name: '호영' },
    { jobcode: 16412, subcode: -1, adv: 4, name: '호영' },
    { jobcode: 16413, subcode: -1, adv: 5, name: '호영' },
    { jobcode: 30000, subcode: -1, adv: 0, name: '스타플래닛' },
]

const riding_id_list: number[] = [
80001003
,80001004
,80001005
,80001006
,80001007
,80001008
,80001009
,80001010
,80001011
,80001012
,80001013
,80001014
,80001015
,80001016
,80001017
,80001018
,80001019
,80001020
,80001021
,80001022
,80001023
,80001025
,80001026
,80001027
,80001028
,80001029
,80001030
,80001031
,80001032
,80001033
,80001037
,80001038
,80001039
,80001044
,80001082
,80001083
,80001084
,80001090
,80001137
,80001144
,80001148
,80001149
,80001163
,80001173
,80001174
,80001175
,80001183
,80001184
,80001185
,80001186
,80001187
,80001188
,80001189
,80001190
,80001191
,80001192
,80001193
,80001194
,80001195
,80001196
,80001198
,80001199
,80001220
,80001221
,80001222
,80001223
,80001224
,80001228
,80001237
,80001240
,80001241
,80001243
,80001244
,80001245
,80001246
,80001257
,80001258
,80001261
,80001277
,80001278
,80001285
,80001287
,80001288
,80001289
,80001290
,80001291
,80001292
,80001293
,80001294
,80001295
,80001298
,80001300
,80001301
,80001302
,80001303
,80001304
,80001305
,80001306
,80001307
,80001308
,80001309
,80001310
,80001311
,80001312
,80001313
,80001314
,80001315
,80001316
,80001317
,80001318
,80001319
,80001320
,80001324
,80001325
,80001326
,80001327
,80001328
,80001331
,80001333
,80001336
,80001337
,80001338
,80001343
,80001344
,80001345
,80001346
,80001347
,80001348
,80001353
,80001354
,80001355
,80001356
,80001388
,80001397
,80001398
,80001399
,80001400
,80001401
,80001404
,80001411
,80001412
,80001413
,80001414
,80001419
,80001420
,80001421
,80001422
,80001423
,80001424
,80001435
,80001440
,80001441
,80001442
,80001443
,80001444
,80001445
,80001446
,80001447
,80001448
,80001449
,80001450
,80001451
,80001452
,80001453
,80001454
,80001480
,80001481
,80001482
,80001483
,80001484
,80001485
,80001490
,80001491
,80001492
,80001503
,80001504
,80001505
,80001506
,80001507
,80001508
,80001509
,80001510
,80001511
,80001517
,80001531
,80001532
,80001533
,80001534
,80001549
,80001550
,80001551
,80001552
,80001553
,80001554
,80001555
,80001557
,80001558
,80001560
,80001561
,80001562
,80001563
,80001564
,80001565
,80001566
,80001567
,80001568
,80001569
,80001570
,80001571
,80001572
,80001582
,80001583
,80001584
,80001585
,80001586
,80001592
,80001617
,80001618
,80001619
,80001620
,80001621
,80001622
,80001623
,80001624
,80001625
,80001626
,80001627
,80001628
,80001630
,80001631
,80001639
,80001640
,80001641
,80001642
,80001643
,80001644
,80001645
,80001671
,80001672
,80001673
,80001674
,80001701
,80001703
,80001707
,80001708
,80001709
,80001710
,80001711
,80001712
,80001713
,80001714
,80001763
,80001764
,80001765
,80001766
,80001767
,80001769
,80001771
,80001774
,80001775
,80001776
,80001777
,80001778
,80001779
,80001782
,80001783
,80001784
,80001785
,80001786
,80001787
,80001790
,80001791
,80001792
,80001793
,80001796
,80001810
,80001811
,80001812
,80001813
,80001814
,80001866
,80001867
,80001868
,80001870
,80001871
,80001872
,80001876
,80001918
,80001919
,80001920
,80001921
,80001922
,80001923
,80001924
,80001931
,80001932
,80001933
,80001934
,80001935
,80001942
,80001943
,80001949
,80001950
,80001951
,80001952
,80001953
,80001954
,80001955
,80001956
,80001957
,80001958
,80001959
,80001975
,80001976
,80001977
,80001978
,80001980
,80001981
,80001982
,80001983
,80001986
,80001987
,80001988
,80001989
,80001990
,80001991
,80001992
,80001993
,80001994
,80001995
,80001996
,80001997
,80001998
,80002200
,80002201
,80002202
,80002203
,80002204
,80002205
,80002219
,80002220
,80002221
,80002222
,80002223
,80002224
,80002225
,80002226
,80002227
,80002228
,80002229
,80002233
,80002234
,80002235
,80002236
,80002237
,80002238
,80002239
,80002240
,80002241
,80002242
,80002243
,80002244
,80002248
,80002249
,80002250
,80002251
,80002252
,80002253
,80002257
,80002258
,80002259
,80002260
,80002261
,80002262
,80002263
,80002265
,80002266
,80002270
,80002271
,80002272
,80002276
,80002277
,80002278
,80002279
,80002287
,80002288
,80002289
,80002290
,80002294
,80002295
,80002296
,80002297
,80002299
,80002302
,80002304
,80002305
,80002306
,80002307
,80002308
,80002309
,80002313
,80002314
,80002315
,80002316
,80002317
,80002318
,80002319
,80002320
,80002321
,80002322
,80002335
,80002345
,80002346
,80002347
,80002348
,80002349
,80002350
,80002351
,80002352
,80002353
,80002354
,80002355
,80002356
,80002357
,80002358
,80002359
,80002361
,80002366
,80002367
,80002368
,80002369
,80002370
,80002372
,80002373
,80002374
,80002375
,80002382
,80002383
,80002384
,80002385
,80002392
,80002400
,80002401
,80002402
,80002403
,80002417
,80002418
,80002424
,80002425
,80002426
,80002427
,80002429
,80002430
,80002431
,80002432
,80002433
,80002434
,80002435
,80002436
,80002437
,80002438
,80002439
,80002440
,80002441
,80002442
,80002443
,80002446
,80002447
,80002448
,80002449
,80002450
,80002451
,80002454
,80002455
,80002456
,80002457
,80002545
,80002546
,80002547
,80002557
,80002563
,80002564
,80002565
,80002566
,80002569
,80002570
,80002571
,80002572
,80002573
,80002574
,80002585
,80002591
,80002594
,80002595
,80002622
,80002624
,80002626
,80002627
,80002628
,80002629
,80002630
,80002631
,80002648
,80002649
,80002650
,80002651
,80002654
,80002655
,80002656
,80002659
,80002660
,80002661
,80002662
,80002663
,80002664
,80002665
,80002666
,80002667
,80002668
,80002669
,80002698
,80002699
,80002702
,80002712
,80002713
,80002714
,80002715
,80002716
,80002717
,80002718
,80002735
,80002736
,80002738
,80002740
,80002742
,80002743
,80002744
,80002748
,80002752
,80002754
,80002756
,80002757
,80002795
,80002796
,80002797
,80002798
,80002812
,80002824
,80002826
,80002827
,80002828
,80002831
,80002843
,80002844
,80002845
,80002846
,80002853
,80002854
,80002855
,80002856
,80002858
,80002859
,80002860
,80002862
,80002869
,80002870
,80002872
,80002873
,80002874
,80002875
,80002878
,80002881
,80002882
,80002883
,80002884
,80002894
,80002896
,80002920
,80002921
,80002922
,80002936
,80002937
,80002938
,80002944
,80002979
,80002980
,80002981
,80002982
,80002983
,80002984
,80002985
,80002986
,80002987
,80002988
,80002989
,80002990
,80002991
,80002992
,80002993
,80002994
,80002995
,80002996
,80002997
,80002998
,80002999
,80003000
,80003022
,80003024
,80003029
,80003030
,80003031
,80003050
,80003057
,80003066
,80003067
]

const LEVEL_MAX = 300
const EXP_FOR_LEVEL_170 = 138750435; // 공식변경으로 상수화
const EXP_FOR_LEVEL_200 = 2207026470; // 공식변경으로 상수화
const EXP_FOR_LEVEL_220 = 57195934473; // 공식변경으로 상수화
const EXP_FOR_LEVEL_225 = 93854721366; // 공식변경으로 상수화
const EXP_FOR_LEVEL_230 = 174296620999; // 공식변경으로 상수화
const EXP_FOR_LEVEL_235 = 271970512164; // 공식변경으로 상수화
const EXP_FOR_LEVEL_250 = 1313764762354; // 공식변경으로 상수화

class NEXTLEVEL {
    public n:any = new Array(LEVEL_MAX)
    _FillNextLevel( nBeginLev: number, nEndLev: number, fRate:number =  1.0, fFirtItemRate = 1.0 ) {
        this.n[ nBeginLev ] = this.n[ nBeginLev-1 ] * fRate * fFirtItemRate
        for(  let i = nBeginLev + 1 ; i <= nEndLev ; ++i ) {
            this.n[i] = this.n[i-1] * fRate
        }
    }

    constructor() {
        for ( let i = 1; i <= 5; ++i ) this.n[i] = i * ( 15 + i * i / 2 );
		for ( let i = 6; i <= 9; ++i ) this.n[i] = ( i * i / 3 ) * ( 19 + i * i / 3 );
        this._FillNextLevel( 10,		14							);
		this._FillNextLevel( 15,		29,				1.2			);
		this._FillNextLevel( 30,		34							);
		this._FillNextLevel( 35,		39,				1.2			);
		this._FillNextLevel( 40,		59,				1.08		);
		this._FillNextLevel( 60,		64							);
		this._FillNextLevel( 65,		74,				1.075		);
		this._FillNextLevel( 75,		89,				1.07		);
		this._FillNextLevel( 90,		99,				1.065		);
		this._FillNextLevel( 100,	104							);
		this._FillNextLevel( 105,	139,			1.065		);
		this._FillNextLevel( 140,	169,			1.0625		);
		this.n[ 170 ] = EXP_FOR_LEVEL_170;
		this._FillNextLevel( 171,	199,			1.05		);
		this.n[ 200 ] = EXP_FOR_LEVEL_200;
		this._FillNextLevel( 201,	209,			1.12		);
		this._FillNextLevel( 210,	210,			1.6			);	// 기획자가 준 수치가 기존 상수와 안 나눠 떨어져서, 따로 곱함
		this._FillNextLevel( 211,	214,			1.11		);
		this._FillNextLevel( 215,	215,			1.3			);
		this._FillNextLevel( 216,	219,			1.09		);
		this._FillNextLevel( 220,	220,			1.6			);
		this._FillNextLevel( 221,	224,			1.07		);
		this._FillNextLevel( 225,	225,			1.3			);
		this._FillNextLevel( 226,	229,			1.05		);
		this._FillNextLevel( 230,	230,			1.6			);
		this._FillNextLevel( 231,	234,			1.03		);
		this._FillNextLevel( 235,	235,			1.3			);
		this._FillNextLevel( 236,	239,			1.03		);
		this._FillNextLevel( 240,	240,			1.6			);
		this._FillNextLevel( 241,	244,			1.03		);
		this._FillNextLevel( 245,	245,			1.3			);
		this._FillNextLevel( 246,	249,			1.03		);
		this.n[ 250 ] = EXP_FOR_LEVEL_250;
		this._FillNextLevel( 251,	259,			1.01		);
		this._FillNextLevel( 260,	269,			1.01,	2.	);
		this._FillNextLevel( 270,	274,			1.01,	2.	);
		this._FillNextLevel( 275,	275,			2.02		);
		this._FillNextLevel( 276,	279,			1.1			);
		this._FillNextLevel( 280,	280,			2.02		);
		this._FillNextLevel( 281,	284,			1.1			);
		this._FillNextLevel( 285,	285,			2.02		);
		this._FillNextLevel( 286,	289,			1.1			);
		this._FillNextLevel( 290,	290,			2.02		);
		this._FillNextLevel( 291,	294,			1.1			);
		this._FillNextLevel( 295,	295,			2.02		);
		this._FillNextLevel( 296,	298,			1.1			);
		this._FillNextLevel( 299,	299,			1.5			);
		this.n[ LEVEL_MAX ] = 0;
    }

    GetNextLevelExp( nLevel:number ) { return nLevel <= LEVEL_MAX ? this.n[ Math.max( 1, nLevel ) ] : ~0>>1; }
}


export const GUILD_LEVEL_TABLE = [
    { name: '티어1 Lv0', point: 0 },
    { name: '티어1 Lv1', point: 15000 },
    { name: '티어1 Lv2', point: 60000 },
    { name: '티어1 Lv3', point: 135000 },
    { name: '티어1 Lv4', point: 240000 },
    { name: '티어1 Lv5', point: 375000 },
    { name: '티어1 Lv6', point: 540000 },
    { name: '티어1 Lv7', point: 735000 },
    { name: '티어1 Lv8', point: 960000 },
    { name: '티어1 Lv9', point: 1215000 },
    { name: '티어1 Lv10', point: 1500000 },
    { name: '티어1 Lv11', point: 1815000 },
    { name: '티어1 Lv12', point: 2160000 },
    { name: '티어1 Lv13', point: 2535000 },
    { name: '티어1 Lv14', point: 2940000 },
    { name: '티어1 Lv15', point: 3375000 },
    { name: '티어1 Lv16', point: 3840000 },
    { name: '티어1 Lv17', point: 4335000 },
    { name: '티어1 Lv18', point: 4860000 },
    { name: '티어1 Lv19', point: 5415000 },
    { name: '티어1 Lv20', point: 6000000 },
    { name: '티어1 Lv21', point: 6615000 },
    { name: '티어1 Lv22', point: 7260000 },
    { name: '티어1 Lv23', point: 7935000 },
    { name: '티어1 Lv24', point: 8640000 },
    { name: '티어1 Lv25', point: 12528000 },
    { name: '티어1 Lv26', point: 18165600 },
    { name: '티어1 Lv27', point: 26340120 },
    { name: '티어1 Lv28', point: 38193170 },
    { name: '티어1 Lv29', point: 68747700 }
]

class GameData {
    mAdminInfo: Map<number, any> = new Map()
    mWorldInfo: Map<number, any> = new Map()
    mItemInfo: Map<number, any> = new Map()
    mJobInfo: Map<number, any> = new Map()
    mSkillInfo: Map<number, any> = new Map()
    mSkillInfoDetail: Map<number, any> = new Map()
    mEquipInfoDetail: Map<number, any> = new Map()
    mBundleItemInfoDetail: Map<number, any> = new Map()
    mQuestDataDetail: Map<number, any> = new Map()
    mMapInfo: Map<number, any> = new Map()
    mQuestInfo: Map<number, any> = new Map()
    mVCoreInfo: Map<number, any> = new Map()
    mMobInfo: Map<number, any> = new Map()
    SpecialMobList: any[] = []
    mItemOptionCode: Map< number/* code */, Map< number, string> > = new Map()
    nextLevel: NEXTLEVEL = new NEXTLEVEL()
    mRidingInfo: Map<number, any> = new Map()
    mInstanceTables: Map< string, any> = new Map()
    mImgList: Map<string, any> = new Map()
    mImgLoaded:string[] = []
    mDamageSkinSaveInfo: Map<number, any> = new Map()
    mAchieveData:Map<number, any> = new Map()

    constructor() {}

    public load() {
        return new Promise<void>( async (res,rej)=>{
            try {
                //  어드민 이름 맵
                Logger.addLog('Load Admin Name Map');
                let p = await DBWrapper.query_ot(`SELECT AdminID, Name FROM Admin WITH(NOLOCK) ORDER BY AdminID`, []);
                this.mAdminInfo = new Map();
                p.forEach((item: { AdminID: number; Name: any; })=> { this.mAdminInfo.set(item.AdminID, item.Name) });

                //  월드 이름 맵
                Logger.addLog("Load WorldName Map");
                p = await DBWrapper.query_ga(`select GameWorldID, GameWorldName from GameWorld with(nolock) order by GameWorldID`, [], '');
                this.mWorldInfo = new Map();
                p.forEach((item: { GameWorldID: any; GameWorldName: any; })=> { this.mWorldInfo.set(item.GameWorldID, {id: item.GameWorldID, name: item.GameWorldName}) });

                //  아이템 이름 맵
                Logger.addLog("Load ItemInfo Map");
                p = await DBWrapper.query_gi(`SELECT ItemID, replace(ItemName,'\"','') as ItemName FROM ItemInfo ORDER BY ItemID`, []);
                this.mItemInfo = new Map();
                p.forEach((item: { ItemID: any; ItemName: any; })=> { this.mItemInfo.set(item.ItemID, item.ItemName) });

                //  직업 이름 맵
                Logger.addLog("Load JobInfo Map");
                p = await DBWrapper.query_gi(`SELECT JobID, Description FROM Job WITH(NOLOCK) ORDER BY JobID`, []);
                this.mJobInfo = new Map();
                p.forEach((item: { JobID: any; Description: any; })=> { this.mJobInfo.set(item.JobID, item.Description) });
                for( var it of jobcode ) {
                    if( it.jobcode == 0 && it.subcode != -1 ) continue
                    this.mJobInfo.set(it.jobcode, it.adv > 0 ? `${it.adv}차 / ${it.name}` : it.name)
                }

                //  스킬 이름 맵
                Logger.addLog("Load SkillInfo Map");
                p = await DBWrapper.query_gi(`SELECT SkillID, SkillName FROM SkillInfo WITH(NOLOCK) ORDER BY SkillID`, []);
                this.mSkillInfo = new Map();
                p.forEach((item: { SkillID: any; SkillName: any; })=> {
                    this.mSkillInfo.set(item.SkillID, item.SkillName) 
                });

                //  라이딩 스킬 맵
                Logger.addLog("Load Riding Skill Map");
                for( const riding of riding_id_list ) {                    
                    this.mRidingInfo.set(riding, this.mSkillInfo.get(riding))
                }

                //  필드 타입 맵
                Logger.addLog("Load Field Info Map");
                p = await DBWrapper.query_gi(`SELECT FieldID, FieldName FROM MapInfo WITH(NOLOCK) ORDER BY FieldID`, []);
                this.mMapInfo = new Map();
                p.forEach((item: { FieldID: any; FieldName: any; })=> { this.mMapInfo.set(item.FieldID, item.FieldName) });

                //  퀘스트 이름 맵
                Logger.addLog("Load Quest Map");
                p = await DBWrapper.query_gi(`SELECT QRKey, Name, Parent FROM QuestInfo WITH(NOLOCK) ORDER BY QRKey`, []);
                this.mQuestInfo = new Map();
                p.forEach((item: { QRKey: number; Name: any })=> { this.mQuestInfo.set(item.QRKey, item.Name) });

                //  VCore 맵
                Logger.addLog("Load VCore Map");
                p = await DBWrapper.query_gi(`SELECT ID, CoreName FROM VCoreInfo WITH(NOLOCK) ORDER BY ID`, []);
                this.mVCoreInfo = new Map();
                p.forEach((item: { ID: number; CoreName: any })=> { this.mVCoreInfo.set(item.ID, item.CoreName) });

                //  몹 맵
                Logger.addLog("Load Mob Map");
                p = await DBWrapper.query_gi(`SELECT MobID, MobName FROM MobInfo WITH(NOLOCK) ORDER BY MobID`, []);
                this.mMobInfo = new Map();
                p.forEach((item: { MobID: number; MobName: any })=> { this.mMobInfo.set(item.MobID, item.MobName) });

                //  스페셜 몹 리스트
                Logger.addLog(`Load Special Mob List`);
                p = await DBWrapper.query_mstat(`SELECT GroupID, GroupName, GroupOrder, MobID, Phase, MobMode, IsLastMob, MobName, Priority, ClearMail, LimitShareID FROM SpecialMobInfo`, []);
                p.forEach((item:any)=>this.SpecialMobList.push(item))
                //console.log(this.SpecialMobList)

                //  아이템 옵션 코드 맵
                Logger.addLog("Load ItemOptionCode Map");
                p = await DBWrapper.query_gi(`select c.ID, REPLACE(s.STRING,'#',c.val) option_string, c.level_section from ItemOptionCode c WITH(NOLOCK) inner join ItemOptionCodeStr s WITH(NOLOCK) on c.ID = s.ID`, []);
                for( const _it of p ) {
                    if( !this.mItemOptionCode.has(_it.ID) ) this.mItemOptionCode.set(_it.ID, new Map() )
                    const _mSection = this.mItemOptionCode.get(_it.ID)
                    _mSection!.set(_it.level_section, _it.option_string)
                }

                //  인스턴스 테이블 데이터 임시 처리
                this.mInstanceTables.set("ADIndexVar", [
                    [ 1000, 1100, 1100, 1100, 1100 ],
                    [ 1000, 1100, 1100, 1100, 1100 ]
                ])

                this.mInstanceTables.set("dropArmorOptionValue", [
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                        3,  30,  60,  90, 120, 150,
                    180, 210, 240, 270, 300, 330,
                    360, 390, 420, 450, 480, 510,
                    540, 570, 600
                    ],
                    [
                        3,  30,  60,  90, 120, 150,
                    180, 210, 240, 270, 300, 330,
                    360, 390, 420, 450, 480, 510,
                    540, 570, 600
                    ],
                    [
                    5, 5, 5, 5, 5, 5, 5,
                    5, 5, 5, 5, 5, 5, 5,
                    5, 5, 5, 5, 5, 5, 5
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1,  3,  6,  8, 11, 13, 16,
                    18, 21, 23, 26, 28, 31, 33,
                    36, 38, 41, 43, 46, 48, 51
                    ],
                    [
                    1,  3,  6,  8, 11, 13, 16,
                    18, 21, 23, 26, 28, 31, 33,
                    36, 38, 41, 43, 46, 48, 51
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0
                    ],
                    [
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0
                    ],
                    [
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ]
                ])

                this.mInstanceTables.set("dropWeaponOptionValue", [
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                        3,  30,  60,  90, 120, 150,
                    180, 210, 240, 270, 300, 330,
                    360, 390, 420, 450, 480, 510,
                    540, 570, 600
                    ],
                    [
                        3,  30,  60,  90, 120, 150,
                    180, 210, 240, 270, 300, 330,
                    360, 390, 420, 450, 480, 510,
                    540, 570, 600
                    ],
                    [
                    5, 5, 5, 5, 5, 5, 5,
                    5, 5, 5, 5, 5, 5, 5,
                    5, 5, 5, 5, 5, 5, 5
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1, 1, 2, 2,  3,  3,  4,
                    4, 5, 5, 6,  6,  7,  7,
                    8, 8, 9, 9, 10, 10, 11
                    ],
                    [
                    1,  3,  6,  8, 11, 13, 16,
                    18, 21, 23, 26, 28, 31, 33,
                    36, 38, 41, 43, 46, 48, 51
                    ],
                    [
                    1,  3,  6,  8, 11, 13, 16,
                    18, 21, 23, 26, 28, 31, 33,
                    36, 38, 41, 43, 46, 48, 51
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 2, 2, 2,
                    2, 3, 3, 3, 3, 4, 4,
                    4, 4, 5, 5, 5, 5, 6
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    2, 2, 2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2, 2, 2
                    ],
                    [
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ],
                    [
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1
                    ]
                ])

                res();

            } catch (e) {
                rej(e)                
            }
        })
    }

    async loadFromToolDataSvr() {
        const skillKeyList = Array.from(this.mSkillInfo.keys())

        console.log('load start', skillKeyList.length, new Date())
        for( const skillid of skillKeyList ) {
            const oPacket = new OutPacket(10)
            oPacket.Encode4(skillid)                    
            ToolDataServer.sendPacket(oPacket);
            await this.sleep(0)
        }        
        console.log('load end', new Date())
    }

    sleep(ms:number) {
        return new Promise((r) => setTimeout(r, ms));
    }

    /*
    async getJobName(worldId:number, characterId:number, jobCode:number, dbmode:string) {
        const is5thJob = await GameDBHelper.is5thJob(worldId, characterId, dbmode)
        return this.mJobInfo.get(is5thJob ? jobCode + 1 : jobCode)
    }
    */

    async getImgData(key:string, tWait:number=1000) : Promise<any> {
        if( !this.mImgLoaded.some(s=>s==key) ) return null
        if( this.mImgList.has(key) ) return this.mImgList.get(key)
        else {
            //  스킬 데이터 딜레이 로딩
            if( !ToolDataServer.isConnecting ) return null
            const oPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetImgData);
            oPacket.EncodeStr(key)
            ToolDataServer.sendPacket(oPacket);
            let isFinded = false
            let tStart = Number(new Date())
            while(!isFinded) {
                await this.sleep(1)
                if( this.mImgList.has(key) ) break;
                if( Number(new Date()) - tStart >= 1000 ) break;
            }
            if( this.mImgList.has(key) ) return this.mImgList.get(key)
            else return null
        }        
    }

    async getSkillInfoDetail(skillID:number) : Promise<any> {
        if( this.mSkillInfoDetail.has(skillID) ) return this.mSkillInfoDetail.get(skillID)
        else {
            //  스킬 데이터 딜레이 로딩
            if( !ToolDataServer.isConnecting ) return null
            const oPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetSkillInfo);
            oPacket.Encode4(skillID)
            ToolDataServer.sendPacket(oPacket);
            let isFinded = false
            let tStart = Number(new Date())
            while(!isFinded) {
                await this.sleep(1)
                if( this.mSkillInfoDetail.has(skillID) ) break;
                if( Number(new Date()) - tStart >= 25 ) break;
            }
            if( this.mSkillInfoDetail.has(skillID) ) return this.mSkillInfoDetail.get(skillID)
            else return null
        }        
    }

    async getEquipInfoDetail(equipID:number) : Promise<any> {
        if( this.mEquipInfoDetail.has(equipID) ) return this.mEquipInfoDetail.get(equipID)
        else {
            //  스킬 데이터 딜레이 로딩
            if( !ToolDataServer.isConnecting ) return null
            const oPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetEquipInfo);
            oPacket.Encode4(equipID)
            ToolDataServer.sendPacket(oPacket);
            let isFinded = false
            let tStart = Number(new Date())
            while(!isFinded) {
                await this.sleep(1)
                if( this.mEquipInfoDetail.has(equipID) ) break;                
                if( Number(new Date()) - tStart >= 25 ) break;
            }
            if( this.mEquipInfoDetail.has(equipID) ) return this.mEquipInfoDetail.get(equipID)
            else return null
        }        
    }

    async getBundleInfoDetail(itemID:number) : Promise<any> {
        if( this.mBundleItemInfoDetail.has(itemID) ) return this.mBundleItemInfoDetail.get(itemID)
        else {
            //  스킬 데이터 딜레이 로딩
            if( !ToolDataServer.isConnecting ) return null
            const oPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetBundleItemInfo);
            oPacket.Encode4(itemID)
            ToolDataServer.sendPacket(oPacket);
            let isFinded = false
            let tStart = Number(new Date())
            while(!isFinded) {
                await this.sleep(1)
                if( this.mBundleItemInfoDetail.has(itemID) ) break;                
                if( Number(new Date()) - tStart >= 25 ) break;
            }
            if( this.mBundleItemInfoDetail.has(itemID) ) return this.mBundleItemInfoDetail.get(itemID)
            else return null
        }        
    }

    async getQuestDataDetail(questID:number) : Promise<any> {
        if( this.mQuestDataDetail.has(questID) ) return this.mQuestDataDetail.get(questID)
        else {
            //  스킬 데이터 딜레이 로딩
            if( !ToolDataServer.isConnecting ) return null
            const oPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetQuestData);
            oPacket.Encode4(questID)
            ToolDataServer.sendPacket(oPacket);
            let isFinded = false
            let tStart = Number(new Date())
            while(!isFinded) {
                await this.sleep(1)
                if( this.mQuestDataDetail.has(questID) ) break;                
                if( Number(new Date()) - tStart >= 25 ) break;
            }
            if( this.mQuestDataDetail.has(questID) ) return this.mQuestDataDetail.get(questID)
            else return null
        }        
    }

    requestInstanceTableData(tableName:string) {
        const oPacket: OutPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetInstanceTable);
        oPacket.EncodeStr(tableName)
        ToolDataServer.sendPacket(oPacket);
    }

    loadImgList() {
        const oPacket: OutPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_LoadImgList);
        oPacket.Encode4(imgList.length)
        for( const uol of imgList ) {
            oPacket.EncodeStr(uol)
        }        
        ToolDataServer.sendPacket(oPacket);                
    }

    async getAchievementData(achievementID:number) {
        const uol = `Etc/Achievement/AchievementData/${achievementID}.img`
        if( this.mImgLoaded.some(s=>s==uol) ) return this.mAchieveData.get(achievementID)

        const oPacket: OutPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_LoadImg);
        oPacket.EncodeStr(uol)
        ToolDataServer.sendPacket(oPacket);                

        let isFinded = false
        let tStart = Number(new Date())
        while(!isFinded) {
            await this.sleep(1)
            if( this.mAchieveData.has(achievementID) ) break;
            if( Number(new Date()) - tStart >= 25 ) break;
        }

        if( this.mAchieveData.has(achievementID) ) return this.mAchieveData.get(achievementID)
        else return null
    }

    async getDamageSkinSaveInfo(skinID:number) : Promise<any> {
        if( this.mDamageSkinSaveInfo.has(skinID) ) return this.mDamageSkinSaveInfo.get(skinID)
        else {
            //  스킬 데이터 딜레이 로딩
            if( !ToolDataServer.isConnecting ) return null
            const oPacket = new OutPacket(TOOL_DATA_SERVER_PACKET.TDSP_GetDamageSkinSaveInfo);
            oPacket.Encode4(skinID)
            ToolDataServer.sendPacket(oPacket);
            let isFinded = false
            let tStart = Number(new Date())
            while(!isFinded) {
                await this.sleep(1)
                if( this.mDamageSkinSaveInfo.has(skinID) ) break;                
                if( Number(new Date()) - tStart >= 25 ) break;
            }
            if( this.mDamageSkinSaveInfo.has(skinID) ) return this.mDamageSkinSaveInfo.get(skinID)
            else return null
        }                
    }
}

const _obj = new GameData();

export default _obj;