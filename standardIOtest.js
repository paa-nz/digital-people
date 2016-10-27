#!/usr/bin/env node

for (var i = 3; i < process.argv.length; i++) {
  console.log('Arguement: ', process.argv[i]);
}
var third = process.argv[2]

console.log("and third ", third);
// process.argv.forEach((val, index) => {
// });
//




// var stdin = process.stdin,
//     stdout = process.stdout,
//     inputChunks = 'hi';
//
// stdin.resume();
// stdin.setEncoding('utf8');
//
// stdin.on('data', function (chunk) {
//     inputChunks += chunks;
// });
//
// stdin.on('end', function () {
//     var output = inputChunks,
//     stdout.write(output);
//     stdout.write('\n');
// });
