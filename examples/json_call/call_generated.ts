function greet(name = "0") {
  return `Hello, ${name}!`;
}
function add(a: number, b: number) {
return a + b;
}
function main() {
console.log(greet(add(60, 9).toString()));
}

if (import.meta.main) {
  main();
}
