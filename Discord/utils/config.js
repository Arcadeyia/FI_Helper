const process = require('node:process')

const prodConfig = {
  baseUrl: 'https://service.viona24.com/stpusnl/daten/US_IT_2023_Sommer_Aug_',
  guild: '1176992766002200586',

  classes: {
    FIAE_A: {
      roleId: '1126107038657810513',
      reportChannelId: '1136207446273179760',
      scheduleChannelId: '1136207481475960914',
    },
    FIAE_B: {
      roleId: '1136209520381657110',
      reportChannelId: '1125803107675283487',
      scheduleChannelId: '1125797133325451304',
    },
    FIAE_C: {
      roleId: '1143065481222303784',
      reportChannelId: '1150736984805998592',
      scheduleChannelId: '1150737060395761686',
    },
    FIAE_D: {
      roleId: '1151937349996007455',
      reportChannelId: '1151938291365580874',
      scheduleChannelId: '1151938348236148756',
    },
    FISI_A_1: {
      roleId: '1126106908210770010',
      reportChannelId: '1136994959111770182',
      scheduleChannelId: '1136995021627867207',
    },
    FISI_A_2: {
      roleId: '1141275856115875891',
      reportChannelId: '1141629991549927534',
      scheduleChannelId: '1141630027402854442',
    },
    FISI_B: {
      roleId: '1136209669392699483',
      reportChannelId: '1125796045838876743',
      scheduleChannelId: '1125802200044687480',
    },
    FISI_C: {
      roleId: '1173944751775547452',
      reportChannelId: '1173987349634490448',
      scheduleChannelId: '1173987507873001502',
    },
    FISI_D: {
      roleId: '1173944880335171595',
      reportChannelId: '1173981517207322657',
      scheduleChannelId: '1173981648098971668',
    },
    FISI_E: {
      roleId: '1173944617192919040',
      reportChannelId: '1173985878155202590',
      scheduleChannelId: '1173985913701937173',
    },
  },
}

const testConfig = {
  baseUrl: 'https://service.viona24.com/stpusnl/daten/US_IT_2023_Sommer_Aug_',
  guild: '1176992766002200586',

  classes: {
    FIAE_A: {
      roleId: '1176992766023188504',
      reportChannelId: '1176992770750165140',
      scheduleChannelId: '1176992770750165141',
    },
    FIAE_B: {
      roleId: '1176992766023188503',
      reportChannelId: '1176992771198943387',
      scheduleChannelId: '1176992771198943389',
    },
    FIAE_C: {
      roleId: '1176992766023188502',
      reportChannelId: '1176992771630972986',
      scheduleChannelId: '1176992771630972988',
    },
    FIAE_D: {
      roleId: '1176992766023188501',
      reportChannelId: '1176992772025233596',
      scheduleChannelId: '1176992772364959784',
    },
    FISI_A_1: {
      roleId: '1176992766023188500',
      reportChannelId: '1176992772364959793',
      scheduleChannelId: '1176992772843126834',
    },
    FISI_A_2: {
      roleId: '1176992766002200595',
      reportChannelId: '1176992773203832995',
      scheduleChannelId: '1176992773203832996',
    },
    FISI_B: {
      roleId: '1176992766002200594',
      reportChannelId: '1176992773753274439',
      scheduleChannelId: '1176992773753274440',
    },
    FISI_C: {
      roleId: '1176992766002200593',
      reportChannelId: '1176992774172721213',
      scheduleChannelId: '1176992774172721214',
    },
    FISI_D: {
      roleId: '1176992766002200592',
      reportChannelId: '1176992774621507585',
      scheduleChannelId: '1176992774621507586',
    },
    FISI_E: {
      roleId: '1176992766002200591',
      reportChannelId: '1176992775116423251',
      scheduleChannelId: '1176992775116423252',
    },
  },
}

module.exports = process.env.PROD === 'true' ? prodConfig : testConfig
