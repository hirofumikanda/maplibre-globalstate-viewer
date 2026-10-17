# MapLibre GlobalState Viewer

MapLibre GL JS の **Global State**（`global-state` 式）を使って、国名ラベルの表示言語を切り替えるサンプルです。

言語を切り替えても、スタイルの再設定（`setStyle()`）やタイルの再取得は行いません。`map.setGlobalStateProperty()` で状態を 1 つ書き換えるだけで、ラベルが再描画されます。

## 特徴

- Natural Earth の国境データを PMTiles 形式で配信
- 26 言語の国名ラベルをドロップダウンで切り替え
- 初期表示は日本語（`JA`）
- URL ハッシュに地図の表示位置を保存（`hash: true`）

## ファイル構成

```
viewer/
├── index.html         # 地図コンテナと言語選択パネル
├── main.js            # MapLibre の初期化とスタイル定義
└── countries.pmtiles  # 国ポリゴンと国名ラベルのベクトルタイル
```

## 仕組み

### 1. スタイルで状態を宣言する

スタイルの `state` に `language` を定義し、デフォルト値を `EN` にします。

```js
state: {
    language: { default: 'EN' }
}
```

### 2. 式の中で状態を参照する

`['global-state', 'language']` で現在の言語コードを取り出します。`NAME_` と連結して、参照する属性名（例: `NAME_JA`）を組み立てます。

```js
'text-field': [
    'coalesce',
    ['get', ['concat', 'NAME_', ['global-state', 'language']]],
    ['get', 'NAME_EN'],
    ['get', 'ADMIN']
]
```

指定した言語の名称がない地物は、`NAME_EN`、`ADMIN` の順にフォールバックします。

### 3. 初期値を上書きする

`Map` コンストラクタの `globalState` オプションで、初回描画時の値を指定します（MapLibre GL JS v6.14.0 以降）。

```js
globalState: {
    language: 'JA'
}
```

### 4. 実行時に状態を変更する

```js
map.setGlobalStateProperty('language', language);
console.log(map.getGlobalState());
```

## 対応言語

| コード | 言語 | コード | 言語 |
|---|---|---|---|
| AR | アラビア語 | KO | 韓国語 |
| BN | ベンガル語 | NL | オランダ語 |
| DE | ドイツ語 | PL | ポーランド語 |
| EN | 英語 | PT | ポルトガル語 |
| ES | スペイン語 | RU | ロシア語 |
| FA | ペルシア語 | SV | スウェーデン語 |
| FR | フランス語 | TR | トルコ語 |
| EL | ギリシャ語 | UK | ウクライナ語 |
| HE | ヘブライ語 | UR | ウルドゥー語 |
| HI | ヒンディー語 | VI | ベトナム語 |
| HU | ハンガリー語 | ZH | 中国語（簡体字） |
| ID | インドネシア語 | ZHT | 中国語（繁体字） |
| IT | イタリア語 | JA | 日本語 |

## タイルデータ

`countries.pmtiles` には次の 2 つのソースレイヤーが入っています。ズームレベルは 0〜5 です。

| ソースレイヤー | ジオメトリ | 用途 |
|---|---|---|
| `countries` | ポリゴン | 国の塗りと境界線 |
| `country_labels` | ポイント | 国名ラベル（`ADMIN`、`NAME_*` 属性） |

## クレジット

- 地図データ: [Natural Earth](https://www.naturalearthdata.com/)（パブリックドメイン）
