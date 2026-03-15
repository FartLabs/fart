import { parse, Message, Service } from "protoc_parser/mod.ts";

const file = await Deno.open("./lib/proto_parser/my-file.proto");
try {
  const proto = await parse(file, {});
  proto.accept({
    visitMessage(messageNode: Message) {
      // Do stuff with message node
      console.log({ messageNode });
    },
    visitService(serviceNode: Service) {
      // Do stuff with service node
      console.log({ serviceNode });
    },
    // etc
  });
} finally {
  await file.close();
}
