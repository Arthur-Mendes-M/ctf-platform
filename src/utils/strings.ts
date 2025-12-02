export function passwordIsFormatted(password: string) {
  const hasNumber = /\d/.test(password);
  const hasLetter = /[A-Za-z]/.test(password);
  const hasSpecialChar = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password);
  return hasNumber && hasLetter && hasSpecialChar;
}

export function passwordsAreEqual(a: string, b: string) {
  return a === b;
}