function greet(name = "world") {
  return `Hello, ${name}!`;
}

function add(a: number, b: number) {
  return a + b;
  }
function main() {
  console.log(greet(add(9, 10).toString()));
  }
  
  if (import.meta.main) {
    main();
  }
