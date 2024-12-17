import React, { ReactElement, useEffect, useState } from "react";
import { Select, Option } from "@yamada-ui/react"

const { myAPI } = window;


export const VersionList = () => {

  var [list, setList]: [ReactElement[], Function] = useState([]);

  var appdata_dir: string = ""
  var Versions: string[] = []


  const get_mcVersions = async () => {
    appdata_dir = await myAPI.appdata()
    Versions = await myAPI.readdirSync(appdata_dir + '\\.minecraft\\versions')
    console.log(appdata_dir + '\\.minecraft\\versions')
    console.log(Versions)
  }

  const version_filter = () => {
    // 特定の正規表現に当てはまらなければ除外する
    // (マインクラフト公式から発行されたバージョンでないものを除く)
    Versions = Versions.filter((item) => {
      const patterns: RegExp[] = [
        // メジャーバージョン検知用
        /(^\d+)(\.)(\d+)(\.?)(\d)??((?![^\-])$)/,
        // スナショ(00w00a)検知用
        /(^\d+)w(\d+)a/,
        // pre-release / release-candidate 検知用
        /(^\d+)\.(\d+)(\.?)(\d)??-((pre)|(rc)\d+$)/
      ];
      var flag: boolean = false;
      patterns.forEach((element) => { if (element.test(item)) flag = true })
      return flag;
    })
  }

  const version_sort = () => {
    var aa_append = (str_in: string[], sort_str: string) => {
      var str_re: string[] = []

      str_in.forEach((element) => {
        var str_fe: string[] = element.split(sort_str)
        str_fe.forEach((element) => {
          str_re.push(element)
        })
      })

      return str_re
    }


    // .で区切られたバージョンをソート
    Versions.sort((a: string, b: string) => {
      if (a == b) { return 0; }
      var a_s: string[] = a.split(".");
      var b_s: string[] = b.split(".");
      var a_s: string[] = aa_append(a_s, "-");
      var b_s: string[] = aa_append(b_s, "-");

      var len: number = Math.min(a_s.length, b_s.length);
      for (var i = 0; i < len; i++) {
        if (Number(a_s[i]) > Number(b_s[i])) { return 1; }
        if (Number(a_s[i]) < Number(b_s[i])) { return -1; }
      }
      if (a_s.length > b_s.length) { return 1; }
      if (a_s.length < b_s.length) { return -1; }

      return 0;
    });
    // wとaで区切られたバージョンのソート
    Versions.sort((a: string, b: string) => {
      if (a == b) { return 0; }
      // まずはwで分ける
      var a_s: string[] = a.split("w");
      var b_s: string[] = b.split("w");
      var a_s: string[] = aa_append(a_s, "a");
      var b_s: string[] = aa_append(b_s, "a");

      var len: number = Math.min(a_s.length, b_s.length);
      for (var i = 0; i < len; i++) {
        if (Number(a_s[i]) > Number(b_s[i])) { return 1; }
        if (Number(a_s[i]) < Number(b_s[i])) { return -1; }
      }
      if (a_s.length > b_s.length) { return 1; }
      if (a_s.length < b_s.length) { return -1; }

      return 0;
    });
  }

  const make_html_element = () => {
    var tmp: ReactElement[] = []
    Versions.forEach((element, index) => {
      tmp.push(<Option value={element}>{element}</Option>);
    });
    return tmp
  }

  useEffect(() => {
    const f = async () => {
      Versions = ["loading.."]
      try {
        await get_mcVersions();
        // Versions = ["1.21", "1.21.2", "1.19", "1.21.4", "Ffff-1.3.421.21", "22.31.321", "22...31.321", "1.19.3-rc3", "1.19.3-pre2", "", "1.13.1-pre2", "1.13.1-pre1", "23w44a", "12w3421a", "1.1232-foa", "a-tr-test-1.32116.325-1.21", "23w13a_or_b", "1.19.2-AAA_DSA_GA_H2", "3.28.1-aaaasd21.3.3-41.5555.3.32118-3.3.3"]
        version_filter();
        version_sort();
        setList(make_html_element());
        console.log(Versions)
        console.log("list AWAIT" + String(list))
      } catch (e) {
        alert(e);
      }
    };
    f();
  }, []);


  return (
    // <div style={{ display: "flex" }}>
      <Select id="version_list" placeholder="バージョンを選択" >
        {list}
      </Select>
    // </div>
  );
};