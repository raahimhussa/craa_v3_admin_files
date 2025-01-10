export default interface ISetting {
  kind: string
  domains: ScorerSettingDomain[]
}

export interface ScorerSettingDomain {
  _id: string
  label: string
  minScore: number
}
