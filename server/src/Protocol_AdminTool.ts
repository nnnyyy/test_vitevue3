export enum ADMIN_PACKET {
	ASP_UserReportReqForCenter = 0,
	ASP_BlockFlush = 1,
	ASP_Flush = 2,
	ASP_Unblock = 3,
	ASP_Notice = 4,
	ASP_UserReportReqForLogin = 5,
	ASP_NoticeServerCheckUp = 6,
	ASP_SetEXPRate = 7,
	ASP_SetIncDropRate = 8,
	ASP_SetWorldInfo = 9,
	ASP_RefreshProcessList = 10,
	ASP_SetQuestTime = 11,		// 퀘스트 블록 기능
	ASP_SetQuestClear = 12,
	ASP_SvrStatusReq = 13,
	ASP_SetClaimSvrAvailableTime = 14,
	ASP_BanLoginSvrUser = 15,
	ASP_ChangeLaunchingMode = 16,
	ASP_GetClaimSvrAvailableTime = 17,
	ASP_EntrustedShopBlock = 18,	// deprecated
	ASP_LocateEntrustedShop = 19,	// deprecated
	ASP_SetRegionalBonusRate = 20,	// 운영툴에 보내는 부분이 없음. deprecated
	ASP_SetLimitGoodsCount = 21,
	ASP_SetEventTime = 22,	// 사용 안하도록 변경
	ASP_SetWorldSpecificEventInfo = 23,	// 운영툴에 보내는 부분이 없음. deprecated
	ASP_SetWorldMobBonusEventTime = 24,
	ASP_SetWorldMobBonusEventRate = 25,
	ASP_SetNpcScript = 26,
	ASP_SetWeekEventMessage = 27,
	ASP_SetDayByDayEvent = 28,
	ASP_CloseEntrustedShop = 29,	// deprecated
	ASP_ReloadIPListRequest = 30,
	ASP_SetCharacterMoney = 31,
	ASP_IgnoreSPW = 32,
	ASP_IgnoreSSNOnCreateNewCharacter = 33,
	ASP_SetWeddingBonusRate = 34,
	ASP_SetWorldSpecificEventType = 35,	// 운영툴에 보내는 부분이 없음. deprecated
	ASP_SetBalloon = 36,
	ASP_IgnoreOTP = 37,
	ASP_SetNotifier = 38, // 사용하지 않도록 변경
	ASP_EnforceRemoveLoginEntry = 39,
	ASP_StopPrizeEvent = 40,
	ASP_SetGrowTreeEvent = 41,
	ASP_MateOnOff = 42,
	ASP_MiniMapOnOff = 43,
	ASP_StopAllWorldEvent = 44,
	ASP_InitAdminShopCommodity = 45,
	ASP_CashTradeOnOff = 46,
	ASP_AddDeniedCashTradingItem = 47,
	ASP_RemoveDeniedCashTradingItem = 48,
	ASP_RemoveCharacterRank = 49,
	ASP_UpdateRecommendMessage = 50,
	//ASP_PriceLogAllItemSet = 51, 
	ASP_UserMoneyLogSet = 52,
	ASP_ResetNewCharacterChecksum = 53,
	ASP_ReloadQuantityLimitEvent = 54,
	ASP_FamilyUnregisterAll = 55,
	ASP_ReloadRewardTable = 56,
	ASP_ChangeGuildName = 57,
	ASP_ChangeGuildMaster = 58,
	ASP_KickUser = 59,
	ASP_SetPvPOpenTime = 60,
	ASP_AntiMacroBomb = 61,
	ASP_SetServerValue = 62,
	ASP_KickUsers = 63,
	ASP_SetCenterValue = 64,
	ASP_SetAdDisplayStatus = 65,
	ASP_SetRelaxExpBonus = 66,
	ASP_CreateDummyIndun = 67,
	ASP_SerLimitTotalIndun = 68,
	ASP_LoadMobDifficulty = 69,
	ASP_SetCashItemNotice = 70,
	ASP_AdminDelivery = 71,
	ASP_SetMiracleTime = 74,
	ASP_PacketDumpTime = 75,
	ASP_SetGachaponTime = 76,
	ASP_ShowEventNotice = 77,
	ASP_KickUsersWithFlush = 78,
	ASP_LoadItemMixer = 79,
	//ASP_SetAutoAntiMacroTime = 80,
	ASP_ReloadScriptFile = 81,
	ASP_ReloadLotteryScheduleFile = 82,
	ASP_CheckTradeRestraintItem = 83,
	ASP_ZeroMeso = 84,
	ASP_CheckCharacterProcess = 85,
	ASP_SetGachaponFeverTime = 86,
	ASP_ReloadCashData = 87,
	ASP_SpecialCashItem = 88,
	ASP_TowerRankRemove = 89,
	ASP_CharacterRecoveryReady = 90,
	ASP_CharacterRecoveryFinish = 91,
	ASP_SummonNpc = 92,
	ASP_SetBlockFlushHackClear = 93,
	ASP_RemoveNpc = 94,
	ASP_PatchExtendedReward = 95,
	ASP_SetTimeMoveQuestInfo = 96,
	ASP_SetPacketDump = 97,
	ASP_LimitGoodsNoticeOnOff = 98,
	ASP_ReloadMesoExchangeInvigoration = 99,
	ASP_SetMiniDumpType = 100,
	ASP_SetHubValue = 101,
	ASP_SetCharacterMoneyLevel = 102,
	ASP_AbleEliteMonster = 103,
	ASP_ServerRestriction = 104,
	ASP_SetMapleTVShowTime = 105,

	ASP_SlideNotice = 106,
	ASP_SetUserSurveyProbabilty = 107,
	ASP_FPSLog = 108,
	ASP_LongTimePacketLog = 109,
	ASP_ReloadMacroCondition = 110,
	ASP_ClientLoadSingleThread = 111,

	ASP_UserReportReqForHub = 112,

	ASP_SetBlockedHubSvr = 113,

	ASP_FlushUserData = 114,
	ASP_SetIsTryConnectCenterT = 116,
	ASP_ReloadIPCheckImg = 117,
	ASP_SetHubMobileValue = 118,
	ASP_AssOnOff = 120,
	ASP_MarketTempBlock = 121,
	ASP_HubMobileEvent = 122,
	ASP_MailServerConnectReset = 123,
	ASP_ModifyCrucialItem = 124,
	ASP_ModifyProhibitedItem = 125,
	ASP_BlockToadsHammer = 126,
	ASP_BlockSPWChange = 127,
	ASP_StarCoinEvent = 128,
	ASP_ReloadEventList = 129,
	ASP_EntrustedShopDBFailCount = 130,	// deprecated

	ASP_SetMacroDetectBlockTime = 131,
	ASP_SetMacroDetectInfoLevelLimit = 132,
	ASP_MVPService_OnOff = 133,
	ASP_ReloadNPCShopList = 134,
	ASP_SetRecordUserPacketDump = 135,
	ASP_BlockReviveMaplePoint = 136,
	ASP_BlockReserveExpBuff = 137,
	ASP_SetOnOffQuestIDExLog = 138, // 안.씀
	ASP_NewHandsServerPacket = 139,
	ASP_SetPacketDumpRecordingCondition = 140,
	ASP_AntiFailDump_Medication = 141,
	ASP_ChatBlock = 142,
	ASP_SetGameServerMemoryViolationMiniDump = 143,
	ASP_AvatarLoadInAccount = 144,
	ASP_UserLimitCount = 145,
	ASP_ServerFlushLimit = 146,
	ASP_ServerFlushSleepTime = 147,
	ASP_OnlineUserLimitCount = 148,
	ASP_FlushUserAbleTime = 149,
	ASP_ServerRestirctUserCnt = 150,
	ASP_ReloadClientCRC = 151,
	ASP_DoneNewClientUpload = 152,
	ASP_MapleMMileageEvent = 153,
	ASP_ReloadActSimilarity = 154,  // 안 써유
	ASP_SetCharacterCopyMode = 156,
	ASP_BridgeSrvInitSignalDB = 157,
	ASP_ReloadCashRandomChanceData = 158,
	ASP_BlockWebDifferIP = 159,
	ASP_InterruptEventContents = 160,
	ASP_ParticleOnOff = 161,
	ASP_DestroyZombieUserAuto = 163,
	ASP_SetClientInfoLog = 164,	
	ASP_LogByTypeOnOff_GameSvr = 165,
	//ASP_SetCallStackLog = 166,
	ASP_SetServerTime = 167,
	//ASP_SetSusepctMacroSystem = 168,
	ASP_ErrorLogStats = 170,
	ASP_SetActiveLiveAnalysisLog = 171,
	ASP_SetFieldMobHuntStats = 172,
	ASP_Auction_CancelItem = 173,
	ASP_Auction_DeleteHistory = 174,
	ASP_AdminLog = 175,
	ASP_SendAccountCabinet = 176,
	//ASP_SetAccountReliability = 177,
	ASP_SetPetMovePathStats = 178,
	//ASP_RegistSuspectMacroCharacter = 179,
	ASP_Refresh_HackLogControl = 180,
	ASP_HackUserChase = 181,
	ASP_SetNGSSuspectLog = 182,
	ASP_ModifyProbTableItem = 183,
	ASP_BlockAchievement = 184,
	ASP_BlockLoginLimit = 185,
	ASP_ModifyClientInfoLoginLimit = 186,
	ASP_ReloadRecordableQuestInHub = 187,
	ASP_HandsPlus_Push_Notification = 188,
	ASP_PvpApcUserReload = 190,
	ASP_GIDBUpdate = 191,
	ASP_ReloadIPCheckFromDB = 192,
	ASP_SetNGSRecordState = 193,
	ASP_SetWorldGaugeInfo = 194,
	ASP_ModifyMachineBlackList = 195,
	/*ASP_RestrictConnectNewUser = 196, // 월드 내 캐릭터가 없는 계정의 경우 접속 제한*/
	ASP_BridgeSrvWaitQueueOnOff = 197,
	ASP_BridgeSrvWaitQueueMaxUsers = 198,

	ASP_SetQuestRecordEx = 199,
	ASP_SetWorldShareRecord = 200,
	ASP_ReloadSKillAttackControl = 201,
	ASP_ServerStatus = 202,
	ASP_AddCriminal = 203,
	// ASP_LogoutPatternUser = 204, 제거
	ASP_PrisonerControl = 206,
	ASP_LimitIndividualMobPoolUserCount = 207,
	ASP_LiveActionSystem = 208,
	ASP_OpToolJob = 209,
	ASP_ResetAllGuildDungeonEntry = 210,
	ASP_BlockGuildMark = 211,
	ASP_FlushCachedGuildRecommendList = 212,
	ASP_RequestGuildRecommendList = 213,
	ASP_SetLimitedUserTradeBlock = 214,
	ASP_ModifyGuildNotice = 215,
	ASP_MatchMakingRequest = 216,
	ASP_FlushCachedMatchMaking = 217,
	ASP_HubGameRankManReload = 218,
	ASP_CopyCharacter = 219,
	ASP_ReloadInternalAccount = 220,
	ASP_ReloadPetIndividualFieldList = 221,
	ASP_ReloadScriptField = 222,
	ASP_ReloadEventListImg = 223,
	ASP_PresetKickUsersWithFlush = 224,
	ASP_NewHandsProbLogSearch = 225,   // 핸즈 로그 조회 부하 테스트용
	// 간단한 ON / OFF 기능이나 INT 형을 쓰는 경우에는
	// Center Server Value Key  (CSV_포맷 애들) 에 추가해 주세요 --ideatype
}

export enum ADMIN_TOOL_PACKET {
	ATP_AdminPacketRequest = 0,
	ATP_GetServerInfo,
	ATP_CheckUserConnection
}

export enum CENTER_TO_ADMIN_TOOL {
	CTA_AdminPacketRet = 0,
	CTA_GetServerInfoRet,
	CTA_CheckUserConnectionRet,
	CTA_ServerStatus
}