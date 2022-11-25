// Helpful references:
// https://peggyjs.org/online.html
// https://github.com/redotjs/redot/blob/main/packages/redot-parse/dot.pegjs
// https://github.com/AnimalLogic/AL_usd_vscode_extension/blob/master/syntaxes/usd.tmLanguage.json
FILE
	= WHITESPACE_NON_COMMENT version:VERSION
    WHITESPACE
    descriptor: DESCRIPTOR?
    WHITESPACE
    statements: STATEMENTS?
    WHITESPACE
    {
    	return {
        version,
        descriptor,
        statements: statements ?? [],
      }
    }


VARIANT_DEF
	= name: STRING
	  WHITESPACE '{'
        WHITESPACE
        definitions:DEFINITION_STATEMENTS?
        WHITESPACE
      '}'
	  {
	    return {
	      type: 'variantDef',
          name,
          definitions: definitions ?? [],
	    }
	  }


VARIANT_DEFINITION_LIST
  = head:VARIANT_DEF
    tail:(STATEMENT_SEPARATOR @VARIANT_DEF)*
    {
      return [head].concat(tail);
    }

VARIANT_SET
	= 'variantSet' WHITESPACE name:STRING WHITESPACE '=' WHITESPACE
        '{'
            WHITESPACE
            definitions: VARIANT_DEFINITION_LIST?
            WHITESPACE
        '}'
      {
        return {
          type: 'variantSet',
          name,
          definitions: definitions ?? [],
        }
      }


VERSION
  = "#usda " version: NUMBER NON_LINE_WHITESPACE [\n] {
  		return version
    }

DEFINITION
	= 	subType: ("def" / "over")
    	NON_LINE_WHITESPACE
        identifier: (
          identifier: IDENTIFIER
          NON_LINE_WHITESPACE {return identifier}
        )?
        name:STRING
        WHITESPACE
        descriptor: DESCRIPTOR?
        WHITESPACE
        "{"
          WHITESPACE
            statements: DEFINITION_STATEMENTS?
          WHITESPACE
        "}"
        {return {
          type: 'definition',
          subType,
          defType: identifier,
          name,
          descriptor,
          statements: statements ?? [],
        }}


STATEMENT_SEPARATOR
	= NON_LINE_WHITESPACE [\n] WHITESPACE

ASSIGNMENT_LIST
  = head:ASSIGNMENT
    tail:(STATEMENT_SEPARATOR @ASSIGNMENT)*
    {
      return [head].concat(tail);
    }

STATEMENT
	= (CLASS_DEFINITION/DEFINITION/VARIANT_SET)

STATEMENTS
	= head:STATEMENT
    tail:(STATEMENT_SEPARATOR @STATEMENT)*
    {
      return [head].concat(tail);
    }

DEFINITION_STATEMENT
	= STATEMENT / DECLARATION

DEFINITION_STATEMENTS
	= head:DEFINITION_STATEMENT
    tail:(STATEMENT_SEPARATOR @DEFINITION_STATEMENT)*
    {
      return [head].concat(tail);
    }

DESCRIPTOR
  = (
    "("
      WHITESPACE
      description:STRING?
      WHITESPACE
      assignments: ASSIGNMENT_LIST?
      WHITESPACE
    ")"
    {
      return {
        description,
        assignments:  assignments ?? [],
      }
    }
  )

ASSIGNMENT =
  keyword: ASSIGNMENT_KEYWORDS?
  WHITESPACE identifier: IDENTIFIER
  WHITESPACE "="
  WHITESPACE value: VALUE
  {
    return {
      type: 'assignment',
      keyword,
      identifier,
      value,
    }
  }


ASSIGNMENT_KEYWORDS
	= "prepend" / "add"

DECLARATION
	=
    keyword:(keyword: DECLARATION_KEYWORDS? WHITESPACE {return keyword})
    type: TYPE
    WHITESPACE reference: REFERENCE
    value:(
      WHITESPACE
      "="
      WHITESPACE
      value: VALUE
      {return value}
    )?
    descriptor:(
      WHITESPACE
      desc:DESCRIPTOR
      {return desc}
    )?
    {
      return {
        type: 'declaration',
        keyword,
        defineType: type,
        reference,
        value,
        descriptor,
      }
    }

DECLARATION_KEYWORDS
	= "varying" / "uniform" / "custom"

REFERENCE
	= $((IDENTIFIER ([:.] IDENTIFIER)*)/STRING)

TYPE
	=	$(IDENTIFIER ("[]")?)

CLASS_DEFINITION
	= "class"
    NON_LINE_WHITESPACE
    id:(id:IDENTIFIER NON_LINE_WHITESPACE {return id})?
    name:STRING
    WHITESPACE
    descriptor:(desc:DESCRIPTOR
    WHITESPACE {return desc})?
    classDeclarations: CLASS_DECLARATIONS
    {
    	return {
        	type: 'classDefinition',
          id,
          name,
          descriptor,
          classDeclarations,
        }
    }

CLASS_DECLARATION
  = DEFINITION / DECLARATION

CLASS_DECLARATION_LIST
  = head:CLASS_DECLARATION
    tail:(STATEMENT_SEPARATOR @CLASS_DECLARATION)*
    {
      return [head].concat(tail);
    }

CLASS_DECLARATIONS
	= "{"
	    WHITESPACE
      items:CLASS_DECLARATION_LIST?
      WHITESPACE
    "}"
    {
    	return items ?? []
    }

COMMENT
  = "#" value:$([^\n]*) { return {
    type: 'comment',
    value,
  } }

IDENTIFIER
  = txt:$([a-zA-Z_][_a-zA-Z0-9]*) {return txt}

VALUE
  = val:(
  	STRING
    /BOOLEAN
  	/NUMBER
    /ARRAY_VALUE
    /TUPLE_VALUE
    /EXTERNAL_REFERENCE_IMPORT
    /EXTERNAL_REFERENCE
    /OBJECT_VALUE
    /NONE
  ) {return val}

NONE
	= 'None'i
    {return null}
BOOLEAN
	= value:("true"i {return true}/ "false"i {return false})
	{
    	return value;
    }

INDEXED_OBJECT_DECLARATION
  = index: NUMBER WHITESPACE [:]
    WHITESPACE value:VALUE
    {
      return {
        index,
        value,
      }
    }

OBJECT_DECLARATION_LIST
	= 	head: INDEXED_OBJECT_DECLARATION
    	tail: (WHITESPACE "," WHITESPACE @INDEXED_OBJECT_DECLARATION)*
    		  (WHITESPACE ",")?
    {
      return {
        type: 'objectDeclarationList',
        values: [head].concat(tail),
      };
    }

OBJECT_DECLARATION
	=
    keyword: DECLARATION_KEYWORDS?
    WHITESPACE
    type: TYPE
    WHITESPACE
    reference: REFERENCE
    WHITESPACE
    value:(
      "="
      WHITESPACE
      value: VALUE {return value}
    )?
    {
    	return {
          keyword,
          defineType: type,
          reference,
          value,
        }
    }

OBJECT_DECLARATIONS
  = (
      OBJECT_DECLARATION_LIST
      /  (values:(
            WHITESPACE
            @OBJECT_DECLARATION
          )*
          {
            return {
              type: 'objectDeclarationEntries',
              values,
            };
          })
    )

OBJECT_VALUE
	= "{"
    	WHITESPACE
        declarations: OBJECT_DECLARATIONS
	    WHITESPACE
    "}" {
    	return {
    	  type: 'objectValue',
        declarations,
      }
    }

EXTERNAL_REFERENCE
  = referenceFile:EXTERNAL_REFERENCE_STRING
    toImport:EXTERNAL_REFERENCE_IMPORT? {
  	return {
      type: 'externalReference',
      referenceFile,
      toImport,
    }
  }

EXTERNAL_REFERENCE_STRING
  = "@" src:$[^@]* "@" {return {
    type: 'externalReferenceSrc',
    src,
  }}

EXTERNAL_REFERENCE_IMPORT "REFERENCE"
  = "<"
      NON_LINE_WHITESPACE
      path:$([/] / IDENTIFIER)+
      field:("." @$([.:] / IDENTIFIER)+)?
      NON_LINE_WHITESPACE
    ">" {
      return {
        type: 'externalReferenceImport',
        importPath: path,
        field,
      }
    }

VALUE_LIST
	= head:VALUE
    tail:(WHITESPACE "," WHITESPACE @VALUE)*
    (WHITESPACE ",")?
    {
      return [head].concat(tail);
    }

ARRAY_VALUE
	= "["
    	WHITESPACE
        values: VALUE_LIST?
    	WHITESPACE
    "]"
    {
      return values ?? []
    }

TUPLE_VALUE
	= "("
    	WHITESPACE
        values: VALUE_LIST?
    	WHITESPACE
      ")"
    	{
        	return values
        }

NUMBER
  = number:(
      (
        val:$(
          ([0]([xX])[0-9a-fA-F]*)
          /("-"?(([0-9]+"."?[0-9]*)/("."[0-9]+))(([eE])("+"/"-")?[0-9]+)?)
        )
        {
          return parseFloat(val)
        }
      )
      / ('-inf'i {return -Infinity})
      / ('inf'i {return Infinity})
    ) {
  return number
}

STRING
  = value:(TRIPLESINGLESTRING / TRIPLEDOUBLESTRING / DOUBLESTRING / SINGLESTRING)
  	{
    	return value
    }

DOUBLESTRING_CHAR '"'
	= '"'

DOUBLESTRING
	= (DOUBLESTRING_CHAR contents:$DoubleStringCharacter* DOUBLESTRING_CHAR {
    	return contents
    })

SINGLESTRING_CHAR "'"
	= "'"

SINGLESTRING
	= (SINGLESTRING_CHAR contents:$SingleStringCharacter* SINGLESTRING_CHAR {
    	return contents
    })

SingleStringCharacter "String Character"
  = SingleQuoteEscape
  / !("'" / LineTerminator) SourceCharacter { return text(); }

SingleQuoteEscape
  = v:("\\".) { return v[1] === "'" ? "'" : v[0] + v[1]; }

DoubleStringCharacter  "String Character"
  = QuoteEscape
  / !('"' / LineTerminator) SourceCharacter { return text(); }

QuoteEscape
  = v:("\\".) { return v[1] === '"' ? '"' : v[0] + v[1]; }

TRIPLESINGLESTRING
	= ("'''" contents:$TRIPLESINGLEStringCharacter* "'''" {
    return contents})

TRIPLESINGLEStringCharacter
  = !("'''") SourceCharacter { return text(); }

TRIPLEDOUBLESTRING
	= ('"""' contents:$TRIPLEStringCharacter* '"""' {
    	return contents
    })

TRIPLEStringCharacter
  = !('"""') SourceCharacter { return text(); }


SourceCharacter
	= .

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = '\n'
  / '\r\n'
  / '\r'
  / '\u2028'
  / '\u2029'

WHITESPACE "WHITESPACE"
  = ([ \t\n\r] / COMMENT)*

WHITESPACE_NON_COMMENT "WHITESPACE"
  = ([ \t\n\r])*

NON_LINE_WHITESPACE "NON_LINE_WHITESPACE"
  = ([ \t\r]* / COMMENT)
