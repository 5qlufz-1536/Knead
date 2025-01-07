type Conditions = {
  [key: string]: RegExp
}

// 許可された条件キーとその正規表現
const validConditions: Conditions = {
  type: /^(!?[a-zA-Z0-9_]+)$/, // type

  distance: /^(-?\d+(\.\d+)?)?(\.\.)?(-?\d+(\.\d+)?)?$/, // 距離
  rm: /^-?\d+$/, // 旧 min 距離
  r: /^-?\d+$/, // 旧 max 距離

  name: /^(!?[a-zA-Z0-9_]+|"!?[a-zA-Z0-9_]+")$/, // 名前（`!Steve`なども対応）

  level: /^([0-9]+|[0-9]+\.\.[0-9]+)$/, // レベル
  lm: /^\d+$/, // 旧 minレベル
  l: /^\d+$/, // 旧 maxレベル

  gamemode: /^(!?(survival|creative|adventure|spectator))$/, // ゲームモード（`survival`や`!survival`など）
  m: /^(!?((survival|s|0)|(creative|c|1)|(adventure|a|2)|(spectator|sp|3)))$/, // 旧 ゲームモード

  limit: /^\d+$/, // リミット
  c: /^-?\d+$/, // 旧 リミット

  predicate: /^(!?[a-zA-Z0-9_]+)$/, // predicate

  sort: /^(nearest|furthest|random|arbitrary)$/, // sort

  tag: /^(!?[a-zA-Z0-9_]+)$/, // tag

  team: /^(!?[a-zA-Z0-9_]+)$/, // team

  x: /^-?\d+(\.\d+)?$/, // X座標

  y: /^-?\d+(\.\d+)?$/, // Y座標

  z: /^-?\d+(\.\d+)?$/, // Z座標

  dx: /^-?\d+(\.\d+)?$/, // dx

  dy: /^-?\d+(\.\d+)?$/, // dy

  dz: /^-?\d+(\.\d+)?$/, // dz

  x_rotation: /^(-?\d+(\.\d+)?)?(\.\.)?(-?\d+(\.\d+)?)?$/, // x_rotation
  rxm: /^-?\d$/, // 旧 min x_rotation
  rx: /^-?\d$/, // 旧 max x_rotation

  y_rotation: /^(-?\d+(\.\d+)?)?(\.\.)?(-?\d+(\.\d+)?)?$/, // y_rotation
  rym: /^-?\d$/, // 旧 min y_rotation
  ry: /^-?\d$/, // 旧 min y_rotation

  scores: /^\{([a-zA-Z0-9_]+=(-?\d+)?(\.\.)?(-?\d+)?)(,[a-zA-Z0-9_]+=(-?\d+)?(\.\.)?(-?\d+)?)*\}$/, // スコア
  scoresOld: /^(score_[a-zA-Z0-9_]+(_min)?=-?\d+)$/, // 旧 スコア

  advancements: /^\{(([a-zA-Z0-9_]+:)?[a-zA-Z0-9_]+=(true|false))(,([a-zA-Z0-9_]+:)?[a-zA-Z0-9_]+=(true|false))*\}$/, // 進捗

  nbt: /^(!?\{.*\})$/, // nbt（簡易的な検証: `{}` で囲まれた文字列）
}

// セレクター内の条件が正しいかをチェックする関数
export const SelectorCheck = (selector: string, SelectorX0: boolean): [boolean, string] => {
  if (!selector.match(/^@([apensr])(\[.*\])?$/)) return [false, 'is not correct']
  const match = selector.replaceAll(' ', '').match(/^@([apensr])\[(.*)\]$/)
  const noConditionsMatch = selector.match(/^@([apensr])$/)

  if (match) {
    let conditionsString = match[2]
    if (conditionsString === '') return [false, 'there is nothing in the brackets']

    // 波括弧内の,と=を一時的に置き換え
    conditionsString = conditionsString.replaceAll(/\{([^}]+)\}/g, match => match.replaceAll(',', 'もともと半角コンマだった場所だよ').replaceAll('=', 'もともと半角イコールだった場所だよ'))

    // 条件を,で分割 コンマを戻しておく
    const conditions = conditionsString.split(',').map(v => v.replaceAll('もともと半角コンマだった場所だよ', ','))

    let containsCoordinateConditions = false // x, y, z, dx, dy, dz, distance の条件が含まれているか

    for (const condition of conditions) {
      // =で分割 イコールを戻す
      const [key, value] = condition.split('=').map((v, i) => {
        if (i == 1) return v.replaceAll('もともと半角イコールだった場所だよ', '=')
        return v
      })

      // valueの先頭がscore_だった場合はOldで特殊チェックを入れる
      if (key.slice(0, 6) == 'score_') {
        if (!validConditions.scoresOld.test([key, value].join('='))) return [false, 'not match RegExo (old score format)']
        continue
      }

      // ターゲットがaかpのときにtypeが入ったらエラー
      if ((match[1] == 'a' || match[1] == 'p') && key == 'type') return [false, `@${match[1]} is player only`]

      if (!key || !validConditions[key]) return [false, 'not key']

      if (!validConditions[key].test(value)) console.log(value)
      if (!validConditions[key].test(value)) return [false, 'not match RegExp']

      // 座標関連のkeyが存在するかチェック
      if (['x', 'y', 'z', 'dx', 'dy', 'dz', 'distance', 'r', 'rm'].includes(key)) {
        containsCoordinateConditions = true
      }
    }

    // 座標関連のkeyが一切ない、かつ干渉抑制がtrueならx=0を追加
    if (!containsCoordinateConditions && SelectorX0) {
      selector = selector.replace(']', ',x=0]')
    }
  }
  else if (noConditionsMatch) {
    // 干渉抑制がtrueならx=0を追加
    if (SelectorX0) selector += '[x=0]'
  }

  return [true, selector]
}

// // テスト用
// const testSelectors = [
//   '@e[advancements={adventure=true,combat=false}]',
//   '@e[advancements={adventure=true,aaa:combat=false}]',
//   '@e[advancements={adventure=true,aaa:combat=false},scores={G=1..,hakj=..0}]',
//   '@e[scores={ G=1..2, hakj=..0 }]',
//   '@e[scores={ G=1..2 }]',
//   '@e[scores={ Gosakd=2 }, distance=..6]',
//   '@e[nbt={"Health":100, "Name":"Zombie"}]',
//   '@e[nbt=!{"Health":100, "Name":"Zombie"}]',
//   '@e[score_name_min=5]',
//   '@e[score_name_min=5,score_name=5]',
//   '@e[score_s=5]',
//   '@e[y_rotation=5.2..]',
//   '@e[distance=5.2..]',
//   '@e[]',
//   '@e[',
//   '@e]',
//   '@e',
//   '@a[type=player]',
// ]

// testSelectors.forEach((selector) => {
//   const [valid, sele] = SelectorCheck(selector, true)
//   let vvv = 'ERROR'
//   if (valid) vvv = 'SUCCESS'
//   console.log(`${vvv} : ${selector}`)
//   console.log(`Result: ${sele}`)
//   console.log(`===========================`)
// })
