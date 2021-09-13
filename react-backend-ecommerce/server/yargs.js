import yargs from 'yargs';
 let {op, n1, n2} = yargs(process.argv.slice(2)).argv;

 n1 = Number(n1)
 n2 = Number(n2)

 console.log(eval(`${n1}${op}${n2}`))
