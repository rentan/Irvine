/*
caption=changeFileName
version=20160228
hint=JScript ファイル名を変更します
author=wan
*/

/*
Copyright (C) 2016 wan <thewanwan111@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/**
 * 使用例:
 * wscript //E:JScript changeFileName.js filePath b64 charset queue url date
 *   filePath: ファイル名を変更するファイルの絶対パス
 *   b64: 新しいファイル名 Base64でエンコードした文字列を渡してください 例: abc.txt (ファイル名) → YWJjLnR4dA== (Base64)
 *   charset: ファイル名の文字エンコード 例: shift_jis, utf-8等
 *   queue: オプション Irvineのアイテムのキューフォルダ
 *   url: オプション IrvineのアイテムのURL
 *   date: オプション Irvineの今現在のアイテムの成功日時
 *
 * queue, url, dateが指定された場合はIrvineのアイテムの名前(item.DownloadedFilename)も変更します
 * queueとurlはそのアイテムにアクセスする為に必要です。 dateはそのアイテムの終了を確認する為に使用しています
 */

var adTypeBinary = 1;
var adTypeText = 2;

function ado(value, typeA, charsetA, typeB, charsetB){
  var stream = new ActiveXObject("ADODB.Stream");
  stream.open();
  stream.type = typeA;
  if(charsetA != null) stream.charset = charsetA;
  if(typeA == adTypeText){
    stream.writeText(value);
  }else{
    stream.write(value);
  }
  stream.position = 0;
  stream.type = typeB;
  if(charsetB != null) stream.charset = charsetB;
  if(typeB == adTypeText){
    var r = stream.readText();
  }else{
    var r = stream.read();
  }
  stream.close();
  return r;
}

//Base64デコード
function base64decode(b64, charset){
  var xml = new ActiveXObject('Microsoft.XMLDOM');
  var element = xml.createElement('element');
  element.dataType = 'bin.base64';
  element.text = b64;
  var binary = element.nodeTypedValue;

  return ado(binary, adTypeBinary, null, adTypeText, charset);
}

//ファイル名正規化
function normalizeFileName(filename){
  var map = {
    '\\': '￥',
    '/': '／',
    ':': '：',
    '*': '＊',
    '?': '？',
    '"': '”',
    '<': '＜',
    '>': '＞',
    '|': '｜'
  };
  filename = filename.replace(/[\\\/:*?"<>|]/g, function(a){return map[a];});
  return filename;
}

//Irvineのアイテムにファイル名を設定する
function setIrvineItemFilename(queue, url, filename, date){
  var irvine = new ActiveXObject('Irvine.Api');
  var item = new ActiveXObject('Irvine.Item');
  var count = 0;
  for(var i = 0; i < 10; i++){
    irvine.Current.Path = queue;
    count = irvine.ItemCount;
    for(var index = 0; index < count; index++){
      item.data = irvine.GetItemData(index);
      if(item.url == url){
        item.DownloadedFilename = filename;
        if(item.SuccessDate < date){
          WScript.Sleep(1000);//アイテムの終了待ち
          break;
        }
        irvine.SetItemData(index, item.data);
        return;
      }
    }
  }
  WScript.Echo('changeFileName: タイムアウト Irvineのアイテムのファイル名を設定出来ませんでした');
}

//ファイルの名前を変更する
function changeFileName(filePath, b64, charset, queue, url, date){
  var newFileName = normalizeFileName(base64decode(b64, charset));
  var folder = filePath.replace(/[^\\]+$/, '');
  var newPath = folder + newFileName;
  var name = newFileName.replace(/(\.[^\.]+)$/, '');
  var ext = RegExp.$1;
  var fs = new ActiveXObject( "Scripting.FileSystemObject" );
  if(fs.FileExists(filePath)){
    var file = fs.GetFile(filePath);
    for(var i = 0; fs.FileExists(newPath); i++){
      newFileName = name + '[' + i + ']' + ext;
      newPath = folder + newFileName;
    }
    //ファイル名変更
    file.Name = newFileName;
    if(queue && url && date){
      setIrvineItemFilename(queue, url, newPath, date);
    }
  }
}


var args = WScript.Arguments;
var filePath = args(0);
var b64 = args(1);
var charset = args(2);
var queue = args(3);
var url = args(4);
var date = args(5);
changeFileName(filePath, b64, charset, queue, url, date);
