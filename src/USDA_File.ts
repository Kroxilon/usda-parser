// noinspection JSUnusedGlobalSymbols

export interface USDA_File {
    version: number;
    descriptor: USDA_Descriptor | null;
    statements: USDA_Statement[];
}

export interface USDA_Descriptor {
    description: string;
    assignments: USDA_Assignment<any>[];
}

export type USDA_ValueTypes =
    | string
    | boolean
    | number
    | USDA_Array<any>
    | Readonly<USDA_Array<any>>
    | USDA_ExternalReferenceImport
    | USDA_ExternalReference
    | USDA_ObjectValue<any>
    | null
    | undefined

export type USDA_ObjectDeclarationList<T extends USDA_ValueTypes> = {
    type: 'objectDeclarationList',
    values: {
        index: number,
        value: T
    }[],
};

export type USDA_TypeReference = string;
export type USDA_Reference = string;

export type USDA_ObjectDeclaration<T extends USDA_ValueTypes> = {
    keyword: USDA_DeclarationKeyword | null;
    defineType: USDA_TypeReference;
    reference: USDA_Reference;
    value: T;
};

export type USDA_ObjectDeclarationEntries<T extends USDA_ValueTypes> = {
    type: 'objectDeclarationEntries',
    values: USDA_ObjectDeclaration<T>[],
};

type PotentialObjectDeclarationList<T extends USDA_ValueTypes, TArrayItem extends USDA_ValueTypes | any> =
    TArrayItem extends USDA_ValueTypes ?
        USDA_ObjectDeclarationList<TArrayItem> :
        SimpleObjectDeclarations<T>;

type SimpleObjectDeclarations<T extends USDA_ValueTypes> = USDA_ObjectDeclarationList<T>
    | USDA_ObjectDeclarationEntries<T>;

export type USDA_ObjectDeclarations<T extends USDA_ValueTypes> =
    T extends (infer TArrayItem)[] ?
        PotentialObjectDeclarationList<T, TArrayItem> :
        SimpleObjectDeclarations<T>

export type USDA_ObjectValue<T extends USDA_ValueTypes> = {
    type: USDA_ValueType.ObjectValue;
    declarations: USDA_ObjectDeclarations<T>;
};

export type USDA_Array<T extends USDA_ValueTypes>
    = T[]

export interface USDA_Assignment<T extends USDA_ValueTypes> {
    type: AssignmentType.Assignment;
    keyword: null | USDA_AssignmentKeyword;
    identifier: string;
    value: T;
}

export interface USDA_ExternalReference {
    type: USDA_ValueType.ExternalReference;
    referenceFile: USDA_ReferenceFile;
    toImport: null | USDA_ExternalReferenceImport;
}

export interface USDA_ReferenceFile {
    type: USDA_ValueType.ExternalReferenceSrc;
    src: string;
}

export interface USDA_VariantDefinition {
    type: USDA_StatementType.VariantDef;
    name: string;
    definition?: USDA_Definition;
}

export interface USDA_VariantSet {
    type: USDA_StatementType.VariantSet;
    name: string;
    definitions: USDA_VariantDefinition[];
}

export type USDA_Statement =
    | USDA_ClassDefinition
    | USDA_Definition
    | USDA_VariantSet

export type USDA_DefinitionStatement =
    | USDA_Statement
    | USDA_Declaration<any>

export interface USDA_ClassDefinition {
    type: USDA_StatementType.ClassDefinition;
    id: null | string;
    name: string;
    descriptor: USDA_Descriptor;
    classDeclarations: USDA_ClassDeclaration[];
}

export type USDA_Typename =
    | string

// noinspection JSUnusedGlobalSymbols
export enum USDA_DefinitionType {
    Def = 'def',
    Over = 'over',
}

export interface USDA_Definition {
    type: USDA_StatementType.Definition;
    subType: USDA_DefinitionType;
    defType: USDA_Typename | null;
    name: string;
    args: USDA_Assignment<any>[];
    statements: USDA_DefinitionStatement[];
}

export type USDA_ClassDeclaration =
    | USDA_Definition
    | USDA_Declaration<any>

export interface USDA_Declaration<T extends USDA_ValueTypes> {
    type: USDA_StatementType.Declaration;
    keyword: USDA_DeclarationKeyword | null;
    defineType: USDA_Typename;
    reference: string;
    value: T;
    descriptor: USDA_Descriptor;
}

export interface USDA_ExternalReferenceImport {
    type: USDA_ValueType.ExternalReferenceImport;
    importPath: string;
    field: string | null;
}

export enum AssignmentType {
    Assignment = 'assignment',
}

export enum USDA_ValueType {
    ExternalReference = 'externalReference',
    ExternalReferenceImport = 'externalReferenceImport',
    ExternalReferenceSrc = 'externalReferenceSrc',
    ObjectValue = 'objectValue',
}

export enum USDA_StatementType {
    Declaration = 'declaration',
    ClassDefinition = 'classDefinition',
    Definition = 'definition',
    VariantSet = 'variantSet',
    VariantDef = 'variantDef',
}


// noinspection JSUnusedGlobalSymbols
export enum USDA_AssignmentKeyword {
    /**
     * https://graphics.pixar.com/usd/release/tut_xforms.html
     *
     *
     *
     * Why prepend?
     *
     * You may have noticed the prepend operation in the reference statement above. Prepend means that, when this layer
     * is composed with others to populate the stage, the reference will be inserted before any references that might
     * exist in weaker sublayers. This ensures that the contents of the reference will contribute stronger opinions
     * than any reference arcs that might exist in other, weaker layers.
     *
     * In other words, prepend gives the intuitive result you’d expect when you apply one layer on top of another.
     * This is what the UsdReferences API https://graphics.pixar.com/usd/release/api/class_usd_references.html will create by default. You can specify other options with the position
     * parameter, but this should rarely be necessary.
     *
     *
     */
    Prepend = 'prepend',
    Add = 'add',
}

// noinspection JSUnusedGlobalSymbols
export enum USDA_DeclarationKeyword {
    Uniform = 'uniform',
    Custom = 'custom',
}
