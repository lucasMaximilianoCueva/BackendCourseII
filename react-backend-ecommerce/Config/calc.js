function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let arr = [];

const calculate = (n) => {
  //cicle
  let i = 0;
  while (i < n) {
    arr.push(getRandomInt(1, 1000));
    i = i + 1;
  }

  let repeated = {};

  arr.forEach(function (num) {
    repeated[num] = (repeated[num] || 0) + 1;
  });

  return repeated;
};

process.on("message", msg => {
    console.log(`father messsage: ${msg}`)
    const calc = calculate(msg);
    process.send(calc)
})
