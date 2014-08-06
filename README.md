## Irvine

Irvine, DMonkey, Dorothy2

各サイト用のスクリプトは Dorothy2 version 0.31 以降で動作するように
作ってあるので、Dorothy2R を入れる必要はありません。


### Dorothy2R でスクリプトが正常動作しない場合の切り分け

![img](https://raw.githubusercontent.com/rentan/images/master/Dorothy2R_bug_check.png)


### Dorothy2/Dorothy2R とスクリプトの組み合わせ

|               |rentan製スクリプト  |他の方のスクリプト              |
|---------------|--------------------|--------------------------------|
|Dorothy2 0.31～|**推奨**：動作する  |                                |
|Dorothy2 旧ver |動作しない          |                                |
|Dorothy2R      |**非推奨**：動作する|**非推奨**：動作しないものがある|

Dorothy2R で意図的に削除している機能(changeFileName など)を除き、
Dorothy2 用スクリプトが Dorothy2R で動作しなければ Dorothy2R 側のバグです。


### 改行コードの扱いについて

ほとんどのファイルは CRLF 改行で作成し、変換せず CRLF 改行のまま
リポジトリにコミットしています(autocrlf = false)。

これにより ZIP ファイルの中身が CRLF 改行になり、そのままパッケージ
として扱えるようになっています。

※実際に Dorothy2 のパッケージインストール機能で使用できるかは未確認です。
試した人がいたら教えて下さい。


[EOF]
