export const shuffle = (arr: any[]) => {
  const shuffledArr = [...arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const randIdx = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[randIdx]] = [
      shuffledArr[randIdx],
      shuffledArr[i],
    ];
  }
  return shuffledArr;
};
