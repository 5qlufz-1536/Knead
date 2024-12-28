type VersionInfo = {
  kind: string
  raw: string
}

export type ReleaseVersionInfo = VersionInfo & {
  kind: 'release';
  major: number;
  minor: number;
  patch: number;
}
export const compareReleaseVersionInfo = (a: ReleaseVersionInfo, b: ReleaseVersionInfo) => {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  return a.patch - b.patch
}

export type SnapshotVersionInfo = VersionInfo & {
  kind: 'snapshot';
  year: number;
  releaseNumber: number;
  letter: string;
}
export const compareSnapshotVersionInfo = (a: SnapshotVersionInfo, b: SnapshotVersionInfo) => {
  if (a.year !== b.year) return a.year - b.year
  if (a.releaseNumber !== b.releaseNumber) return a.releaseNumber - b.releaseNumber
  return a.letter.localeCompare(b.letter)
}

export type PreReleaseVersionInfo = VersionInfo & {
  kind: 'pre-release';
  major: number;
  minor: number;
  patch: number;
  releaseNumber: number;
}
export const comparePreReleaseVersionInfo = (a: PreReleaseVersionInfo, b: PreReleaseVersionInfo) => {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  if (a.patch !== b.patch) return a.patch - b.patch
  return a.releaseNumber - b.releaseNumber
}

export type ReleaseCandidateVersionInfo = VersionInfo & {
  kind: 'rc-release';
  major: number;
  minor: number;
  patch: number;
  releaseNumber: number;
}
export const compareReleaseCandidateVersionInfo = (a: ReleaseCandidateVersionInfo, b: ReleaseCandidateVersionInfo) => {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  if (a.patch !== b.patch) return a.patch - b.patch
  return a.releaseNumber - b.releaseNumber
}

export type VersionInfoType = ReleaseVersionInfo | SnapshotVersionInfo | PreReleaseVersionInfo | ReleaseCandidateVersionInfo;

export const parseVersion = (raw: string) => {
  const major = /^(\d+)\.(\d+)(?:\.(\d+))?$/.exec(raw)
  if (major) {
    return {
      kind: 'release',
      raw,
      major: Number(major[1]),
      minor: Number(major[2]),
      patch: major[3] ? Number(major[3]) : 0,
    } as ReleaseVersionInfo
  }

  const snapshot = /^(\d+)w(\d+)(.+)$/.exec(raw)
  if (snapshot) {
    return {
      kind: 'snapshot',
      raw,
      year: Number(snapshot[1]),
      releaseNumber: Number(snapshot[2]),
      letter: snapshot[3],
    } as SnapshotVersionInfo
  }

  const preRelease = /^(\d+)\.(\d+)(?:\.(\d+))?-pre(\d+)$/.exec(raw)
  if (preRelease) {
    return {
      kind: 'pre-release',
      raw,
      major: Number(preRelease[1]),
      minor: Number(preRelease[2]),
      patch: preRelease[3] ? Number(preRelease[3]) : 0,
      releaseNumber: Number(preRelease[4]),
    } as PreReleaseVersionInfo
  }

  const releaseCandidate = /^(\d+)\.(\d+)(?:\.(\d+))?-rc(\d+)$/.exec(raw)
  if (releaseCandidate) {
    return {
      kind: 'rc-release',
      raw,
      major: Number(releaseCandidate[1]),
      minor: Number(releaseCandidate[2]),
      patch: releaseCandidate[3] ? Number(releaseCandidate[3]) : 0,
      releaseNumber: Number(releaseCandidate[4]),
    } as ReleaseCandidateVersionInfo
  }

  return undefined
}