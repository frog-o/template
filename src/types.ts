
/* MAIN */

type VariableBoolean = {
  type: 'boolean',
  default?: boolean
};

type VariableString = {
  type: 'string',
  default?: string
};

type Variable = (
  VariableBoolean |
  VariableString
);

type MetadataGlobal = {
  templates?: Record<string, MetadataLocal>
};

type MetadataLocal = {
  variables?: Record<string, Variable>
};
export type PackageJSON = {version:string}

/* EXPORT */

export type {MetadataGlobal, MetadataLocal};
