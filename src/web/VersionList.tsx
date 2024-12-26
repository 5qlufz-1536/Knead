import { useEffect, useState } from "react";
import { ComboboxData, Select, rem, Group, Button } from '@mantine/core';
import { IconCube } from "@tabler/icons-react";
import classes from "./VersionList.module.css";

const { myAPI } = window;


export const VersionList = () => {

  const [list, setList]: [ComboboxData, Function] = useState([]);
  const [SelectedVertion, setSelected]: [string, Function] = useState("");

  var appdata_dir: string = ""
  var all_versions: string[] = []
  var major_versions: string[] = []
  var snapshot_versions: string[] = []
  var pre_versions: string[] = []
  var rc_versions: string[] = []

  var MajorVersionTXT = "MajorVersion"
  var SnapshotVersionTXT = "Snapshot"
  var PreReleaseVersionTXT = "Pre-Release"
  var ReleaseCandidateVersionTXT = "ReleaseCandidate"

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
    var tmp: ComboboxData = [
      { group: MajorVersionTXT, items: major_versions },
      { group: ReleaseCandidateVersionTXT, items: rc_versions },
      { group: PreReleaseVersionTXT, items: pre_versions },
      { group: SnapshotVersionTXT, items: snapshot_versions }
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

  const icon = <IconCube style={{ width: rem(16), height: rem(16) }} />

  return (
    <>
      <Group style={{ marginBottom: 5 }} justify="space-between">
        <Group w={200}>
          <Select
            classNames={classes}
            allowDeselect={false}
            leftSection={icon}
            placeholder="バージョンを選択"
            data={list}
            searchable
            value={SelectedVertion}
            checkIconPosition="left"
            comboboxProps={{ dropdownPadding: 2, position: 'bottom', middlewares: { flip: false, shift: false }, offset: 0, transitionProps: { transition: 'scale-y', duration: 150 } }}
            scrollAreaProps={{ type: "auto", scrollbarSize: 10 }}
            onChange={SelectVersion}
          />
        </Group>
        <Group>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
          <Button>5</Button>
          <Button>6</Button>
        </Group>
      </Group>
    </>
  );
};