switch (true) {
  case process.env.REACT_APP_IS_TESTNET == null:
    throw new Error("REACT_APP_IS_TESTNET env variable is not set");
  case process.env.REACT_APP_NODE_ADDRESS == null:
    throw new Error("REACT_APP_NODE_ADDRESS env variable is not set");
  case process.env.REACT_APP_GRAPHQL_API_URL == null:
    throw new Error("GRAPHQL_API_URL env variable is not set");

  default:
    break;
}

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: "account",
};

export const GRAPHQL_API_URL = process.env.REACT_APP_GRAPHQL_API_URL as string;
console.log("GRAPHQL_API_URL", GRAPHQL_API_URL);

export const IS_TESTNET = process.env.REACT_APP_IS_TESTNET === "true";
console.log("IS_TESTNET", IS_TESTNET);

export const APP_ROUTER_BASENAME = "/Vara-Arena";

/**
 *
 */

// ARENA contract
export const ARENA_METADATA = `000200010000000000010300000001050000000113000000000000000115000000691b580010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000401205b75383b2033325d0000040000032000000008000800000503000c08206172656e615f696f2c4172656e61416374696f6e0001102c4372656174654c6f626279040120636170616369747908010875380000002052656769737465720801206c6f6262795f6964100110753132380001206f776e65725f696400011c4163746f72496400010010506c61790401206c6f6262795f69641001107531323800020028526573657276654761730401206c6f6262795f696410011075313238000300001000000507001408206172656e615f696f284172656e614576656e74000114304c6f626279437265617465640801206c6f6262795f6964100110753132380001206361706163697479080108753800000040506c61796572526567697374657265640c01206c6f6262795f696410011075313238000124706c617965725f6964100110753132380001107469657208010875380001002c47617352657365727665640401206c6f6262795f69641001107531323800020034426174746c65537461727465640401206c6f6262795f696410011075313238000300384c6f626279426174746c654c6f670c01206c6f6262795f69641001107531323800012477696e6e65725f6964100110753132380001106c6f67731801385665633c426174746c654c6f673e00040000180000021c001c08206172656e615f696f24426174746c654c6f6700000c01286368617261637465723120013028753132382c20626f6f6c290001286368617261637465723220013028753132382c20626f6f6c290001147475726e732801445665633c5665633c5475726e4c6f673e3e00002000000408102400240000050000280000022c002c00000230003008206172656e615f696f1c5475726e4c6f67000008012463686172616374657210011075313238000118616374696f6e3401245475726e4576656e7400003408206172656e615f696f245475726e4576656e740001203c4e6f74456e6f756768456e65726779040118616374696f6e380130426174746c65416374696f6e0000001841747461636b0801106b696e643c012841747461636b4b696e64000118726573756c7444013041747461636b526573756c74000100104d6f7665040120706f736974696f6e08010875380002001052657374040118656e657267790801087538000300145061727279000400284775617264627265616b04011c73756363657373240110626f6f6c00050024436173745370656c6c040118726573756c7448013c436173745370656c6c526573756c74000600204669726557616c6c04011864616d6167650801087538000700003808206172656e615f696f30426174746c65416374696f6e00011c1841747461636b0401106b696e643c012841747461636b4b696e64000000244d6f76655269676874000100204d6f76654c6566740002001052657374000300145061727279000400284775617264627265616b00050024436173745370656c6c0401147370656c6c4001145370656c6c000600003c08206172656e615f696f2841747461636b4b696e6400010c14517569636b0000001c50726563697365000100144865617679000200004008206172656e615f696f145370656c6c000120204669726557616c6c000000244561727468536b696e000100405761746572526573746f726174696f6e000200204669726562616c6c0003002857617465724275727374000400244669726548617374650005002c4561727468536d69746573000600344368696c6c696e67546f756368000700004408206172656e615f696f3041747461636b526573756c7400010c1844616d61676504000801087538000000145061727279000100104d697373000200004808206172656e615f696f3c436173745370656c6c526573756c74000124204669726557616c6c000000244561727468536b696e04011c646566656e63650801087538000100405761746572526573746f726174696f6e0401106865616c0801087538000200204669726562616c6c04011864616d61676508010875380003003445617274684361746170756c7408011864616d6167650801087538000138656e656d795f706f736974696f6e0801087538000400285761746572427572737404011864616d6167650801087538000500244669726548617374650006002c4561727468536d6974657304011864616d6167650801087538000700344368696c6c696e67546f756368000800004c000004085050005000000400005408206172656e615f696f284172656e61537461746500000801106d696e7400011c4163746f72496400012c6c6f6262795f636f756e74100110753132380000`;
export const ARENA_PROGRAM_ID =
  "0xe2aa664e81202c9ae6d0a59dbfc52951e26ca0992ad354f3533eb3d63873d2f0";
// MINT contract
export const MINT_METADATA =
  "00020001000000000001060000000113000000011a00000000000000011c0000001d288000081c6d696e745f696f18436f6e666967000024012c6c697665735f636f756e7404010875380001686761735f666f725f6461696c795f646973747269627574696f6e08010c7536340001486d696e696d756d5f6761735f616d6f756e7408010c7536340001647570646174655f696e74657276616c5f696e5f626c6f636b730c010c7533320001487265736572766174696f6e5f616d6f756e7408010c7536340001507265736572766174696f6e5f6475726174696f6e0c010c7533320001246d696e745f636f73741001304f7074696f6e3c753132383e000140676f6c645f706f6f6c5f616d6f756e741401107531323800015c736561736f6e5f6475726174696f6e5f696e5f646179731401107531323800000400000503000800000506000c00000505001004184f7074696f6e04045401140108104e6f6e6500000010536f6d65040014000001000014000005070018081c6d696e745f696f284d696e74416374696f6e0001402041646441646d696e04011461646d696e1c011c4163746f7249640000002c52656d6f766541646d696e04011461646d696e1c011c4163746f7249640001003c4372656174654368617261637465720c011c636f64655f6964240118436f646549640001106e616d65280118537472696e67000128617474726962757465732c0144496e697469616c417474726962757465730002003c55706461746543686172616374657208011c636f64655f69643001384f7074696f6e3c436f646549643e00011c6164647265737334013c4f7074696f6e3c4163746f7249643e00030034436861726163746572496e666f0401206f776e65725f69641c011c4163746f72496400040030426174746c65526573756c741001206f776e65725f69641c011c4163746f7249640001306368617261637465725f6964140110753132380001186c6f736572733801305665633c4163746f7249643e0001207265706c795f746f1c011c4163746f724964000500205365744172656e610401206172656e615f69641c011c4163746f7249640006001c4c6576656c5570040110617474723c013c41747472696275746543686f6963650007003c4d616b655265736572766174696f6e0008006853746172744461696c79476f6c64446973747269627574696f6e0009004c446973747269627574654461696c79506f6f6c000a006453746f704461696c79476f6c64446973747269627574696f6e000b0030557064617465436f6e6669671c01686761735f666f725f6461696c795f646973747269627574696f6e40012c4f7074696f6e3c7536343e0001486d696e696d756d5f6761735f616d6f756e7440012c4f7074696f6e3c7536343e0001647570646174655f696e74657276616c5f696e5f626c6f636b7344012c4f7074696f6e3c7533323e0001487265736572766174696f6e5f616d6f756e7440012c4f7074696f6e3c7536343e0001507265736572766174696f6e5f6475726174696f6e44012c4f7074696f6e3c7533323e0001246d696e745f636f73741001304f7074696f6e3c753132383e000140676f6c645f706f6f6c5f616d6f756e741001304f7074696f6e3c753132383e000c002c4465706f73697456617261000d004446696e616c446973747269627574696f6e040144616d6f756e745f6f665f706c617965727348010c753136000e0024436c61696d56617261000f00001c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004002001205b75383b2033325d0000200000032000000004002410106773746418636f6d6d6f6e287072696d69746976657318436f64654964000004002001205b75383b2033325d00002800000502002c081c6d696e745f696f44496e697469616c417474726962757465730000100120737472656e677468040108753800011c6167696c697479040108753800011c7374616d696e610401087538000130696e74656c6c6967656e6365040108753800003004184f7074696f6e04045401240108104e6f6e6500000010536f6d6504002400000100003404184f7074696f6e040454011c0108104e6f6e6500000010536f6d6504001c0000010000380000021c003c081c6d696e745f696f3c41747472696275746543686f69636500011020537472656e6774680000001c4167696c6974790001001c5374616d696e6100020030496e74656c6c6967656e6365000300004004184f7074696f6e04045401080108104e6f6e6500000010536f6d6504000800000100004404184f7074696f6e040454010c0108104e6f6e6500000010536f6d6504000c00000100004800000504004c081c6d696e745f696f244d696e744576656e7400011440436861726163746572437265617465640401386368617261637465725f696e666f500134436861726163746572496e666f000000304c6576656c557064617465640801306368617261637465725f696414011075313238000110617474723c013c41747472696275746543686f69636500010040436861726163746572557064617465640801306368617261637465725f696414011075313238000130616c676f726974686d5f69641c011c4163746f7249640002004c426174746c65526573756c7448616e646c656410012477696e6e65725f69641401107531323800012477696e6e65725f78700c010c75333200013477696e6e65725f726174696e67140110753132380001186c6f736572735801245665633c753132383e0003003c476f6c644469737472696275746564040130646973747269627574696f6e5c015042547265654d61703c753132382c20753132383e0004000050081c6d696e745f696f34436861726163746572496e666f0000180108696414011075313238000130616c676f726974686d5f69641c011c4163746f7249640001106e616d65280118537472696e670001286174747269627574657354014c436861726163746572417474726962757465730001146c6576656c0401087538000128657870657269656e63650c010c753332000054081c6d696e745f696f4c436861726163746572417474726962757465730000200120737472656e677468040108753800011c6167696c697479040108753800011c7374616d696e610401087538000130696e74656c6c6967656e6365040108753800012c6c697665735f636f756e74040108753800012c746965725f726174696e671401107531323800011c62616c616e636514011075313238000130766172615f62616c616e63651401107531323800005800000214005c042042547265654d617008044b01140456011400040060000000600000026400640000040814140068000004086c6c006c000004000070081c6d696e745f696f244d696e74537461746500000401286368617261637465727374018042547265654d61703c4163746f7249642c20436861726163746572496e666f3e000074042042547265654d617008044b011c0456015000040078000000780000027c007c000004081c5000";
export const MINT_PROGRAM_ID =
  "0x4367a287b400b2c061714b31615649dcd61853a859fdf2c77f956b1a8cb2c779";

// STRATEGY

export type Specialization = "knight" | "rogue" | "mage" | "custom";

export const HARDCODED_CHARACTERS: Array<{
  key: Specialization;
  name: string;
  codeId?: HexString;
  stats: Attributes;
}> = [
  {
    key: "knight",
    name: "Knight",
    codeId:
      "0x2c8ce5125e04a4c8177320810f362ee48a11c3b093167cfc4b56b7ea3a8e227a",
    stats: {
      strength: 6,
      agility: 1,
      stamina: 2,
      intelligence: 1,
    },
  },
  {
    key: "rogue",
    name: "Rogue",
    codeId:
      "0xa8a679a2ccd4ba10948d733461a145d3e2e41cf44c2cbf99681e628b6ed7bcc6",
    stats: {
      strength: 3,
      agility: 5,
      stamina: 1,
      intelligence: 1,
    },
  },
  {
    key: "mage",
    name: "Fire Mage",
    codeId:
      "0x95136f3cd4d5b7b6d10a5debea1bd4395421e5d44a43ade3d2faae6cf3d653f6",
    stats: {
      strength: 1,
      agility: 1,
      stamina: 2,
      intelligence: 6,
    },
  },
];

const defaultStats = {
  strength: 1,
  agility: 1,
  stamina: 1,
  intelligence: 1,
};

export const getSpecializationOptions = (specialization?: Specialization) => {
  const character = HARDCODED_CHARACTERS.find(
    (char) => char.key === specialization
  );
  return {
    initialStats: character?.stats ?? defaultStats,
    codeId: character?.codeId,
  };
};

export const getInitialStats = (specialization?: Specialization) => {
  const character = HARDCODED_CHARACTERS.find(
    (char) => char.key === specialization
  );
  return character?.stats ?? defaultStats;
};

// OLD ! OLD ! OLD strategy code id. We shoould keep track of it
export const OLD_STRATEGIES_CODE_IDS_HARDCODED = [
  "0x60a2e174175bdfee6cb59411c3f1a440c9b9f3e5065766994e625857456f7d1e",
  "0x6d5dbdcb194f16fe1c7dbbe9c406f4b3fe656a88c1052375f8be3e68668231bd",
];

/**
 *
 */

export const MAX_GAS_LIMIT = 750_000_000_000;
export const LIFES_INITIAL_QUANTITY = 5;

export const PLAYERS_TO_RESERVATIONS_NEEDED_MAP = {
  2: 0,
  4: 2,
};

export const XP_NEEDED_FOR_LEVEL_UP_MAP = {
  2: 300,
  3: 600,
  4: 1800,
  5: 5400,
  6: 16200,
  7: 48600,
  8: 145800,
  9: 437400,
  10: 1_312_200,
};

export const POINTS_WHEN_MINTING_TOTAL = 10;

/**
 * Calculations
 */

const BASE_HP = 90;
const HP_MULTIPLIER = 15;
const ENERGY_MULTIPLIER = 10;
const BASE_ENERGY = 20;

export const getFullHp = (level: number) => {
  return BASE_HP + level * HP_MULTIPLIER;
};

export const getFullEnergy = (stamina: number) => {
  return BASE_ENERGY + stamina * ENERGY_MULTIPLIER;
};

/**
 *
 */

export { ADDRESS, LOCAL_STORAGE };
