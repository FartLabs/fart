interface ParameterDescriptor {
  name: string;
  type: string;
  description: string;
  // defaultValue: any;
  required: boolean;
}

enum FileContentType {
  TEXT = "file_content_text",
  STORED = "file_content_stored",
}

interface TextFileContent {
  type: FileContentType.TEXT;
  content: string;
}

interface StoredFileContent {
  type: FileContentType.STORED;
  path: string;
}

type FileContent = TextFileContent | StoredFileContent;

enum GeneratorType {
  COMMAND = "generator_type_command",
  TEXT_TEMPLATE = "generator_type_text_template",
}

interface CommandGenerator {
  type: GeneratorType.COMMAND;
  command: string;
  args: string[];
}

const TEMPLATE_ENGINE_TYPES = ["eta"] as const;

type TemplateEngineType = typeof TEMPLATE_ENGINE_TYPES[number];

interface TextTemplateGenerator {
  type: GeneratorType.TEXT_TEMPLATE;
  engineType: TemplateEngineType;
  template: FileContent;
}

// Command generator instances are reduced into a single nix-shell expression to ensure that
// all dependencies are available in the shell environment via dry-run or subcommand.
// Since text templates are embedded, they are not dependencies in the nix-shell expression.
//
// It's possible that a single primitive is could be used to represent communication with external
// (not embedded) dependencies, but that would require a more complex type system.
//
// We might need to add a system in place for switching between different file systems virtual or
// local/remote. This would be useful for supporting remote file systems like S3, but the process
// of virtualizing a remote file system is an inefficient process. It would be better to have a
// separate generator type for remote file systems, however we would need to be able to switch
// between local and remote file systems.

type Generator = CommandGenerator | TextTemplateGenerator;

/**
 * Component is the interface for all components.
 */
interface Component {
  /**
   * name is the name of the component.
   */
  name: string;

  /**
   * composition is the composition of the component.
   */
  composition: Composition;

  /**
   * generators is the list of generators used to generate the component.
   */
  generators: Generator[];

  // /**
  //  * useCases is the list of supported use case names.
  //  */
  // useCases: string[];

  // /**
  //  * files is the list of template files from which the component is generated.
  //  */
  // files: string[];

  // /**
  //  * templateEngine is the template engine used to generate the component.
  //  */
  // templateEngine: string;

  /**
   * parameterDescriptors is the list of parameters supported by the component.
   */
  parameterDescriptors: ParameterDescriptor[];
}

type CompositionParameter =
  | string
  | number
  | boolean
  | { componentName: string }
  | CompositionParameter[];

// type PositionalParameters = CompositionParameter[];
type NamedParameters = { [id: string]: CompositionParameter };

/**
 * Composition is the interface for all compositions.
 */
interface Composition {
  /**
   * using is the name of the component used in the composition.
   */
  using: string;

  /**
   * parameters are the parameters passed to the component at composition time.
   */
  parameters: NamedParameters;
}

export function greetEthan() {
}
