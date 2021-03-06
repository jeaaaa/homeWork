const uaMathList = [
  {
    name: "iphone",
    matchList: [/iPhone/i],
  },
  {
    name: "华为",
    matchList: [
      /HUAWEI/i,
      /SPN-AL00/i,
      /GLK-AL00/i,
      /Huawei/i,
      /HMSCore/i,
      /HW/,
    ],
  },
  {
    name: "荣耀",
    matchList: [/HONOR/i],
  },
  {
    name: "oppo",
    matchList: [
      /PCAM10/i,
      /OPPO/i,
      /PCH/,
      /PBAM00/,
      /PBEM00/,
      /HeyTapBrowser/,
      /PADT00/,
      /PCDM10/,
    ],
  },
  {
    name: "vivo",
    matchList: [/V1981A/i, /vivo/i, /V1818A/, /V1838A/, /V19/, /VivoBrowser/],
  },
  {
    name: "小米",
    matchList: [/Redmi/i, /HM/, /MIX/i, /MI/, /XiaoMi/],
  },
  {
    name: "金利",
    matchList: [/GN708T/i],
  },
  {
    name: "oneplus",
    matchList: [/GM1910/i, /ONEPLUS/i],
  },
  {
    name: "sony",
    matchList: [/SOV/i, /LT29i/, /Xperia/],
  },
  {
    name: "三星",
    matchList: [/SAMSUNG/i, /SM-/, /GT/, /SCH-I939I/],
  },
  {
    name: "魅族",
    matchList: [/MZ-/, /MX4/i, /M355/, /M353/, /M351/, /M811/, /PRO 7-H/],
  },
  {
    name: "华硕",
    matchList: [/ASUS/],
  },
  {
    name: "美图",
    matchList: [/MP/],
  },
  {
    name: "天语",
    matchList: [/K-Touch/],
  },
  {
    name: "联想",
    matchList: [/Lenovo/i],
  },
  {
    name: "宇飞来",
    matchList: [/YU FLY/i],
  },
  {
    name: "糖果",
    matchList: [/SUGAR/i],
  },
  {
    name: "酷派",
    matchList: [/Coolpad/i],
  },
  {
    name: "ecell",
    matchList: [/ecell/i],
  },
  {
    name: "詹姆士",
    matchList: [/A99A/i],
  },
  {
    name: "tcl",
    matchList: [/TCL/i],
  },
  {
    name: "捷语",
    matchList: [/6000/i, /V1813A/],
  },
  {
    name: "8848",
    matchList: [/8848/i],
  },
  {
    name: "H6",
    matchList: [/H6/],
  },
  {
    name: "中兴",
    matchList: [/ZTE/i],
  },
  {
    name: "努比亚",
    matchList: [/NX/],
  },
  {
    name: "努比亚",
    matchList: [/NX/],
  },
  {
    name: "海信",
    matchList: [/HS/],
  },
  {
    name: "HTC",
    matchList: [/HTC/],
  },
];

export let BrandUa = {
  getBrand: function (ua) {
    for (let i = 0; i < uaMathList.length; i++) {
      let uaDetail = uaMathList[i];
      for (let j = 0; j < uaDetail.matchList.length; j++) {
        let re = uaDetail.matchList[j];
        if (re.test(ua)) {
          return uaDetail.name;
        }
      }
    }
    let brandMatch = /; ([^;]+) Build/.exec(ua);
    if (brandMatch) {
      return brandMatch[1];
    } else {
      return false;
    }
  },
};
export default BrandUa;
