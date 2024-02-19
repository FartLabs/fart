// https://www.youtube.com/channel/UCswG6FSbgZjbWtdf_hMLaow/community?lb=Ugkxdjli959KU-RKTIyZZPq0PLkQUMgxPd6T
//

interface UnionBuilder<TData = never> {
  add: <TAdd>() => UnionBuilder<TData | TAdd>;
  value: TData;
}

const result = ({} as UnionBuilder)
  .add<string>()
  .add<number>()
  .add<boolean>().value;

console.log(result); // string | number | boolean
