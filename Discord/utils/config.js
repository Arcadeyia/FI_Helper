const process = require('node:process')

const prodConfig = {
  baseUrl: 'https://service.viona24.com/stpusnl/daten/US_IT_2023_Sommer_Aug_',
  guild: '1176992766002200586',

  klassen: {
    FIAE_A: {
      rollenId: '1126107038657810513',
      berichtsheftChannelId: '1136207446273179760',
      stundenplanChannelId: '1136207481475960914',
    },
    FIAE_B: {
      rollenId: '1136209520381657110',
      berichtsheftChannelId: '1125803107675283487',
      stundenplanChannelId: '1125797133325451304',
    },
    FIAE_C: {
      rollenId: '1143065481222303784',
      berichtsheftChannelId: '1150736984805998592',
      stundenplanChannelId: '1150737060395761686',
    },
    FIAE_D: {
      rollenId: '1151937349996007455',
      berichtsheftChannelId: '1151938291365580874',
      stundenplanChannelId: '1151938348236148756',
    },
    FISI_A_1: {
      rollenId: '1126106908210770010',
      berichtsheftChannelId: '1136994959111770182',
      stundenplanChannelId: '1136995021627867207',
      urlPath: 'FISI_A.1',
    },
    FISI_A_2: {
      rollenId: '1141275856115875891',
      berichtsheftChannelId: '1141629991549927534',
      stundenplanChannelId: '1141630027402854442',
      urlPath: 'FISI_A.2',
    },
    FISI_B: {
      rollenId: '1136209669392699483',
      berichtsheftChannelId: '1125796045838876743',
      stundenplanChannelId: '1125802200044687480',
    },
    FISI_C: {
      rollenId: '1173944751775547452',
      berichtsheftChannelId: '1173987349634490448',
      stundenplanChannelId: '1173987507873001502',
    },
    FISI_D: {
      rollenId: '1173944880335171595',
      berichtsheftChannelId: '1173981517207322657',
      stundenplanChannelId: '1173981648098971668',
    },
    FISI_E: {
      rollenId: '1173944617192919040',
      berichtsheftChannelId: '1173985878155202590',
      stundenplanChannelId: '1173985913701937173',
    },
  },
}

const testConfig = {
  baseUrl: 'https://service.viona24.com/stpusnl/daten/US_IT_2023_Sommer_Aug_',
  guild: '1176992766002200586',

  klassen: {
    FIAE_A: {
      rollenId: '1176992766023188504',
      berichtsheftChannelId: '1176992770750165140',
      stundenplanChannelId: '1176992770750165141',
    },
    FIAE_B: {
      rollenId: '1176992766023188503',
      berichtsheftChannelId: '1176992771198943387',
      stundenplanChannelId: '1176992771198943389',
    },
    FIAE_C: {
      rollenId: '1176992766023188502',
      berichtsheftChannelId: '1176992771630972986',
      stundenplanChannelId: '1176992772025233597',
    },
    FIAE_D: {
      rollenId: '1176992766023188501',
      berichtsheftChannelId: '1176992772025233596',
      stundenplanChannelId: '1176992772025233597',
    },
    FISI_A_1: {
      rollenId: '1176992766023188500',
      berichtsheftChannelId: '1176992772364959793',
      stundenplanChannelId: '1176992772843126834',
      urlPath: 'FISI_A.1',
    },
    FISI_A_2: {
      rollenId: '1176992766002200595',
      berichtsheftChannelId: '1176992773203832995',
      stundenplanChannelId: '1176992773203832996',
      urlPath: 'FISI_A.2',
    },
    FISI_B: {
      rollenId: '1176992766002200594',
      berichtsheftChannelId: '1176992773753274439',
      stundenplanChannelId: '1176992773753274440',
    },
    FISI_C: {
      rollenId: '1176992766002200593',
      berichtsheftChannelId: '1176992774172721213',
      stundenplanChannelId: '1176992774172721214',
    },
    FISI_D: {
      rollenId: '1176992766002200592',
      berichtsheftChannelId: '1176992774621507585',
      stundenplanChannelId: '1176992774621507586',
    },
    FISI_E: {
      rollenId: '1176992766002200591',
      berichtsheftChannelId: '1176992775116423251',
      stundenplanChannelId: '1176992775116423252',
    },
  },
}

module.exports = process.env.PROD === 'true' ? prodConfig : testConfig
