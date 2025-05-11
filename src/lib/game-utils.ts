// Basic Math Problem Generation
export type MathProblem = {
  text: string;
  answer: number;
  options?: number[]; // For multiple choice
};

export function generateMathProblem(difficulty: number): MathProblem {
  const num1 = Math.floor(Math.random() * difficulty * 5) + 1;
  const num2 = Math.floor(Math.random() * difficulty * 5) + 1;
  let operation = '+';
  let answer = num1 + num2;

  if (difficulty > 2) {
    const ops = ['+', '-', '*', '/'];
    operation = ops[Math.floor(Math.random() * Math.min(difficulty -1 , ops.length))];
  }
  
  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      // Ensure positive result for simplicity, or adjust problem
      if (num1 < num2 && difficulty < 5) { // Simpler subtraction for lower levels
        answer = num2 - num1;
        return { text: `${num2} - ${num1} = ?`, answer };
      }
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    case '/':
      // Ensure whole number division for simplicity
      answer = num1; // Temporarily set answer to num1
      const product = num1 * num2; // product will be divisible by num1 and num2
      return { text: `${product} ÷ ${num1} = ?`, answer: num2 };
  }

  return { text: `${num1} ${operation} ${num2} = ?`, answer };
}

// Basic Reading Passage Generation
const readingPassagesByLevel: { [key: number]: string[] } = {
  1: [
    "A red cat sat.",
    "The big dog ran.",
    "A bug is on the rug.",
    "See the sun.",
    "My toy is fun."
  ],
  2: [
    "The fluffy cat sleeps on the mat.",
    "A small bird sings a sweet song.",
    "Frogs jump in the green pond.",
    "The yellow bus goes to school.",
    "I like to read my new book."
  ],
  3: [
    "Colorful fish swim in the clear blue water.",
    "A friendly squirrel gathers nuts for the winter.",
    "The tall oak tree has many green leaves.",
    "Children play happily in the sunny park.",
    "We went to the zoo and saw a lion."
  ],
  // Add more levels and passages as needed
};

export function generateReadingPassage(difficulty: number): string {
  const level = Math.max(1, Math.min(difficulty, Object.keys(readingPassagesByLevel).length));
  const passages = readingPassagesByLevel[level];
  return passages[Math.floor(Math.random() * passages.length)];
}
