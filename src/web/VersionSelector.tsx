import { useEffect, useMemo, useState } from "react";
import { Autocomplete } from "@yamada-ui/react"
import { useAddDispatch, useAppSelector } from '../store/_store';
import { Sound, updateSoundList, updateTargetVersion } from "../store/fetchSlice";
import { VersionInfoType, compareReleaseVersionInfo, compareSnapshotVersionInfo, comparePreReleaseVersionInfo, compareReleaseCandidateVersionInfo, parseVersion } from "../types/VersionInfo";

const { myAPI } = window;

export const VersionSelector = () => {

  const dispatch = useAddDispatch();

  const [versions, setVersions] = useState<VersionInfoType[]>([]);

  useEffect(() => {
    (async () => {
      const get_mcVersions = (versions: string[]): VersionInfoType[] => {
        return versions.map(parseVersion).filter((v): v is VersionInfoType => !!v)
      }
      try {
        const versions = await myAPI.get_versions();
        // const versions = ["1.21", "1.21.2", "1.42.3", "1.19", "1.21.4", "Ffff-1.3.421.21", "22.31.321", "22...31.321", "1.19.3-rc3", "1.19.3-pre2", "", "1.13.1-pre2", "1.13.1-pre1", "23w44a", "12w3421a", "1.1232-foa", "a-tr-test-1.32116.325-1.21", "23w13a_or_b", "1.19.2-AAA_DSA_GA_H2", "3.28.1-aaaasd21.3.3-41.5555.3.32118-3.3.3"]
        setVersions(get_mcVersions(versions));
      } catch (e: unknown) {
        alert(e);
      }
    })();
  }, []);

  const versionList = useMemo(() => {
    const major_versions = versions.filter(v => v.kind === 'release').sort(compareReleaseVersionInfo).reverse().map(v => v.raw)
    const snapshot_versions = versions.filter(v => v.kind === 'snapshot').sort(compareSnapshotVersionInfo).reverse().map(v => v.raw)
    const pre_versions = versions.filter(v => v.kind === 'pre-release').sort(comparePreReleaseVersionInfo).reverse().map(v => v.raw)
    const rc_versions = versions.filter(v => v.kind === 'rc-release').sort(compareReleaseCandidateVersionInfo).reverse().map(v => v.raw)

    return [
      { label: "正式", items: major_versions.map(v => ({ label: v, value: v })) },
      { label: "スナップショット", items: [...rc_versions, ...pre_versions, ...snapshot_versions].map(v => ({ label: v, value: v })) }
    ]
  }, [versions])


  const onChangeVersion = async (version: string) => {
    // console.log(version)
    dispatch(updateTargetVersion({ version: version }));

    const sounds: Sound[] = await myAPI.get_mcSounds(version)
    // console.log(oggs)
    dispatch(updateSoundList({ sounds }));
  }

  return (
    <>
      <Autocomplete
        placeholder="バージョンを選択"
        emptyMessage="該当バージョンなし"
        // closeOnSelect={false}
        variant="filled"
        items={versionList}
        onChange={onChangeVersion}
        maxW="xs"
        animation="top"
        // value={targetVersion}
        gutter={0}
        listProps={{ padding: 0, margin: 0 }}
      // contentProps={{ h: "lg" }}
      />
    </>
  );
};