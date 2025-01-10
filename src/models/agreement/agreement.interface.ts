export default interface IAgreement {
  readonly _id: any
  kind: AgreementKind
  key: string
  label: string
  htmlContent: string
  isRequired: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export enum AgreementKind {
  PrivacyPolicy = 'privacyPolicy',
  TermsOfService = 'termsOfService',
}
