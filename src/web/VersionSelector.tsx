import { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Box } from "@yamada-ui/react"
import { BoxIcon } from "@yamada-ui/lucide";

const { myAPI } = window;


export const VersionSelector = () => {

  const [list, setList]: [AutocompleteItem, Function] = useState([]);
  const [SelectedVertion, setSelected]: [string, Function] = useState("");

  var appdata_dir: string = ""
  var all_versions: string[] = []
  var major_versions: string[] = []
  var snapshot_versions: string[] = []
  var pre_versions: string[] = []
  var rc_versions: string[] = []


  const get_mcVersions = async () => {
    appdata_dir = await myAPI.appdata()
    all_versions = await myAPI.readdirSync(appdata_dir + '\\.minecraft\\versions')
    // console.log(appdata_dir + '\\.minecraft\\versions')
  }

  const version_filter = () => {
    // 特定の正規表現に当てはまらなければ除外する
    // (マインクラフト公式から発行されたバージョンでないものを除く)

    // メジャーバージョン
    major_versions = all_versions.filter((item) => {
      return /(^\d+)(\.)(\d+)(\.?)(\d)??((?![^\-])$)/.test(item)
    })
    // スナショ(00w00a)
    snapshot_versions = all_versions.filter((item) => {
      return /(^\d+)w(\d+)a/.test(item)
    })
    // pre-release
    pre_versions = all_versions.filter((item) => {
      return /(^\d+)\.(\d+)(\.?)(\d)??-((pre)\d+$)/.test(item)
    })
    // release-candidate
    rc_versions = all_versions.filter((item) => {
      return /(^\d+)\.(\d+)(\.?)(\d)??-((rc)\d+$)/.test(item)
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
    all_versions.sort((a: string, b: string) => {
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
    all_versions.sort((a: string, b: string) => {
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

  const make_data = () => {

    const feMM = (list: string[]) => {
      var fe_list: AutocompleteItem = [];
      list.forEach((fe_value) => { fe_list.push({ label: fe_value, value: fe_value }) })
      return fe_list
    }


    var tmp: AutocompleteItem = [
      { label: "MajorVersion", items: feMM(major_versions) },
      { label: "ReleaseCandidate", items: feMM(rc_versions) },
      { label: "Pre-Release", items: feMM(pre_versions) },
      { label: "Snapshot", items: feMM(snapshot_versions) }
    ]
    return tmp
  }

  useEffect(() => {
    const f = async () => {
      try {
        await get_mcVersions();
        // all_versions = ["1.21", "1.21.2", "1.42.3", "1.19", "1.21.4", "Ffff-1.3.421.21", "22.31.321", "22...31.321", "1.19.3-rc3", "1.19.3-pre2", "", "1.13.1-pre2", "1.13.1-pre1", "23w44a", "12w3421a", "1.1232-foa", "a-tr-test-1.32116.325-1.21", "23w13a_or_b", "1.19.2-AAA_DSA_GA_H2", "3.28.1-aaaasd21.3.3-41.5555.3.32118-3.3.3"]
        // all_versions = ["1.21", "1.21.2", "1.42.3", "1.19"]
        version_sort();
        version_filter();
        setList(make_data());
        setSelected(major_versions[major_versions.length - 1]);
      } catch (e) {
        alert(e);
      }
    };
    f();
  }, []);

  const SelectVersion = (value: any) => {
    setSelected(value)
    console.log(value)
  }

  return (
    <>
      <Autocomplete
        placeholder="バージョンを選択"
        emptyMessage="該当バージョンなし"
        closeOnSelect={false}
        variant="filled"
        items={list}
        // defaultValue="1.21.4"
        // value={SelectedVertion}
        onChange={SelectVersion}
        maxW="xs"
        animation="top"
        listProps={{padding:0}}
      />
    </>
  );
};