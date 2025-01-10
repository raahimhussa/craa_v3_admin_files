export type SignupUser = {
  user: {
    email: string
    password: string
    passwordConfirm: string
    profile: {
      lastName: string
      firstName: string
    }
  }
}

export type ISignInUser = {
  usernameOrEmail: string
  password: string
}
