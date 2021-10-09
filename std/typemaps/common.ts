// TODO: Create a more _infinite_ algorithm.
export function* genUniqueNames() {
  let count = 0;
  while (count < 26) {
    yield String.fromCharCode(count + 97);
    count++;
  }
}
