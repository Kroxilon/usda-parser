// noinspection JSUnusedGlobalSymbols
// noinspection JSUnusedGlobalSymbols
export var USDA_DefinitionType;
(function (USDA_DefinitionType) {
    USDA_DefinitionType["Def"] = "def";
    USDA_DefinitionType["Over"] = "over";
})(USDA_DefinitionType || (USDA_DefinitionType = {}));
export var AssignmentType;
(function (AssignmentType) {
    AssignmentType["Assignment"] = "assignment";
})(AssignmentType || (AssignmentType = {}));
export var USDA_ValueType;
(function (USDA_ValueType) {
    USDA_ValueType["ExternalReference"] = "externalReference";
    USDA_ValueType["ExternalReferenceImport"] = "externalReferenceImport";
    USDA_ValueType["ExternalReferenceSrc"] = "externalReferenceSrc";
    USDA_ValueType["ObjectValue"] = "objectValue";
})(USDA_ValueType || (USDA_ValueType = {}));
export var USDA_StatementType;
(function (USDA_StatementType) {
    USDA_StatementType["Declaration"] = "declaration";
    USDA_StatementType["ClassDefinition"] = "classDefinition";
    USDA_StatementType["Definition"] = "definition";
    USDA_StatementType["VariantSet"] = "variantSet";
    USDA_StatementType["VariantDef"] = "variantDef";
})(USDA_StatementType || (USDA_StatementType = {}));
// noinspection JSUnusedGlobalSymbols
export var USDA_AssignmentKeyword;
(function (USDA_AssignmentKeyword) {
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
    USDA_AssignmentKeyword["Prepend"] = "prepend";
    USDA_AssignmentKeyword["Add"] = "add";
    USDA_AssignmentKeyword["Append"] = "append";
    USDA_AssignmentKeyword["Delete"] = "delete";
})(USDA_AssignmentKeyword || (USDA_AssignmentKeyword = {}));
// "varying" / "uniform" / "custom" / "prepend" / "append" / "delete" / "add"
// noinspection JSUnusedGlobalSymbols
export var USDA_DeclarationKeyword;
(function (USDA_DeclarationKeyword) {
    USDA_DeclarationKeyword["Varying"] = "varying";
    USDA_DeclarationKeyword["Uniform"] = "uniform";
    USDA_DeclarationKeyword["Custom"] = "custom";
    USDA_DeclarationKeyword["Prepend"] = "prepend";
    USDA_DeclarationKeyword["Append"] = "append";
    USDA_DeclarationKeyword["Delete"] = "delete";
    USDA_DeclarationKeyword["Add"] = "add";
})(USDA_DeclarationKeyword || (USDA_DeclarationKeyword = {}));
//# sourceMappingURL=USDA_File.js.map