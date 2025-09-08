export const generateCode = () => {
  const getRandomDigit = () => Math.floor(Math.random() * 10);
  const getRandomLetter = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const digits = Array.from({ length: 4 }, getRandomDigit).join('');
  const letters = Array.from({ length: 2 }, getRandomLetter).join('');
  const code = digits + letters;

  return code;
};
