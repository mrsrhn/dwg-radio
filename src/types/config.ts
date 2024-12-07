export interface Config {
  configBase: ConfigBase;
  configStrings: ConfigStrings;
}

interface Link {
  name: string;
  url: string;
  urlAndroid?: string;
  icon: string;
  iconAndroid?: string;
}

interface ConfigBase {
  urlRadio: string;
  showProgramForRadio: boolean;
  urlProgram: string;
  urlPur: string;
  urlLyra: string;
  urlNotifications: string;
  urlHistoryRadio: string;
  urlHistoryPur: string;
  urlHistoryLyra: string;
  urlPaypal: string;
  urlBankTransfer: string;
  contactMail: string;
  additionalInfosLinks: { radio: Link[]; pur: Link[]; lyra: Link[] };
  additionalContactLinks: Link[];
}

interface ConfigStrings {
  lastPlayedString: string;
  sleepTimer: string;
  minutes: string;
  off: string;
  mailButton: string;
  contact: string;
  additionalLinks: string;
  donation: string;
  infoStringRadio: string;
  infoStringLyra: string;
  infoStringPur: string;
  radio: string;
  pur: string;
  lyra: string;
  paypal: string;
  bankTransfer: string;
  noConnectionMessage: string;
  accessCurrentTitle: string;
  accessFrom: string;
  accessPlayedAt: string;
  accessClock: string;
  accessOpenInfoMenu: string;
  accessContinue: string;
  accessPause: string;
  accessSwitchChannelForward: string;
  accessSwitchChannelBackward: string;
  accessOpenInDwgLoad: string;
  accessShowProgramOfDay: string;
  openInDwgLoad: string;
  openInDwgLoadButton: string;
  cancel: string;
  today: string;
}
