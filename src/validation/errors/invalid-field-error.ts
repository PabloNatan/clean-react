export class InvalidFieldError extends Error {
  constructor(fieldLabel: string) {
    super(`O campo ${fieldLabel} inválido`)
  }
}
