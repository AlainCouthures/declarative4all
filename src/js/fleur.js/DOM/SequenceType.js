"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.SequenceType = function(nodeType, schemaTypeInfo, occurrence) {
  this.nodeType = nodeType;
  this.schemaTypeInfo = schemaTypeInfo;
  this.occurrence = occurrence;
};
Fleur.SequenceType.occurrenceastable = {
  "00": true,
  "0?": true,
  "01": false,
  "0*": true,
  "0+": false,
  "?0": false,
  "??": true,
  "?1": false,
  "?*": true,
  "?+": false,
  "10": false,
  "1?": true,
  "11": true,
  "1*": true,
  "1+": true,
  "*0": false,
  "*?": false,
  "*1": false,
  "**": true,
  "*+": false,
  "+0": false,
  "+?": false,
  "+1": false,
  "+*": true,
  "++": true
};
Fleur.SequenceType.prototype.as = function(sequenceType) {
  if (!sequenceType) {
    return true;
  }
  if (this.occurrence === "0") {
    return Fleur.SequenceType.occurrenceastable["0" + sequenceType.occurrence];
  }
  const nodeTypeTest = this.nodeType === sequenceType.nodeType ||
    sequenceType.nodeType === Fleur.Node.ANY_NODE ||
    ((this.nodeType === Fleur.Node.ATTRIBUTE_NODE || this.nodeType === Fleur.Node.ELEMENT_NODE || this.nodeType === Fleur.Node.ENTRY_NODE) && sequenceType.nodeType === Fleur.Node.ATOMIC_NODE);
  return nodeTypeTest && Fleur.SequenceType.occurrenceastable[this.occurrence + sequenceType.occurrence] && this.schemaTypeInfo.as(sequenceType.schemaTypeInfo);
};
Fleur.SequenceType.occurrenceortable = {
  "00": "0",
  "0?": "?",
  "01": "?",
  "0*": "*",
  "0+": "*",
  "?0": "?",
  "??": "?",
  "?1": "?",
  "?*": "*",
  "?+": "*",
  "10": "?",
  "1?": "?",
  "11": "1",
  "1*": "*",
  "1+": "+",
  "*0": "*",
  "*?": "*",
  "*1": "*",
  "**": "*",
  "*+": "*",
  "+0": "*",
  "+?": "*",
  "+1": "+",
  "+*": "*",
  "++": "+"
};
Fleur.SequenceType.or = function(sequenceType1, sequenceType2) {
  if (!sequenceType1) {
    return sequenceType2;
  }
  if (!sequenceType2) {
    return sequenceType1;
  }
  const nodeType = sequenceType1.nodeType === sequenceType2.nodeType ? sequenceType1.nodeType : Fleur.Node.ANY_NODE;
  const schemaTypeInfo = sequenceType1.schemaTypeInfo === sequenceType2.schemaTypeInfo ? sequenceType1.schemaTypeInfo :
    sequenceType1.schemaTypeInfo.as(Fleur.Type_numeric) && sequenceType2.schemaTypeInfo.as(Fleur.Type_numeric) ? Fleur.Type_numeric :
    new Fleur.TypeInfo(null, null, [
      [Fleur.TypeInfo.DERIVATION_UNION, sequenceType1.schemaTypeInfo],
      [Fleur.TypeInfo.DERIVATION_UNION, sequenceType2.schemaTypeInfo]
    ]);
  const occurrence = Fleur.SequenceType.occurrenceortable[sequenceType1.occurrence + sequenceType2.occurrence];
  return new Fleur.SequenceType(nodeType, schemaTypeInfo, occurrence);
};

Fleur.SequenceType_anyAtomicType_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_anyAtomicType, "?");
Fleur.SequenceType_anyAtomicType_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_anyAtomicType, "*");
Fleur.SequenceType_anyAtomicType_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_anyAtomicType, "1");
Fleur.SequenceType_anyURI_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_anyURI, "?");
Fleur.SequenceType_attribute_01 = new Fleur.SequenceType(Fleur.Node.ATTRIBUTE_NODE, Fleur.Type_anyType, "?");
Fleur.SequenceType_attribute_1 = new Fleur.SequenceType(Fleur.Node.ATTRIBUTE_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_base64Binary_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_base64Binary, "?");
Fleur.SequenceType_boolean_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_boolean, "?");
Fleur.SequenceType_boolean_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_boolean, "1");
Fleur.SequenceType_byte_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_byte, "?");
Fleur.SequenceType_codepoint_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_codepoint, "*");
Fleur.SequenceType_codepoint_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_codepoint, "?");
Fleur.SequenceType_collation_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_collation, "?");
Fleur.SequenceType_collation_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_collation, "1");
Fleur.SequenceType_comment_01 = new Fleur.SequenceType(Fleur.Node.COMMENT_NODE, Fleur.Type_anyType, "?");
Fleur.SequenceType_date_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_date, "?");
Fleur.SequenceType_date_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_date, "1");
Fleur.SequenceType_dateTime_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_dateTime, "?");
Fleur.SequenceType_dateTime_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_dateTime, "1");
Fleur.SequenceType_dateTimeStamp_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_dateTimeStamp, "?");
Fleur.SequenceType_dayTimeDuration_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_dayTimeDuration, "?");
Fleur.SequenceType_dayTimeDuration_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_dayTimeDuration, "1");
Fleur.SequenceType_decimal_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_decimal, "?");
Fleur.SequenceType_document_01 = new Fleur.SequenceType(Fleur.Node.DOCUMENT_NODE, Fleur.Type_anyType, "?");
Fleur.SequenceType_document_1 = new Fleur.SequenceType(Fleur.Node.DOCUMENT_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_double_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_double, "?");
Fleur.SequenceType_duration_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_duration, "?");
Fleur.SequenceType_element_0n = new Fleur.SequenceType(Fleur.Node.ELEMENT_NODE, Fleur.Type_anyType, "*");
Fleur.SequenceType_element_1 = new Fleur.SequenceType(Fleur.Node.ELEMENT_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_empty_sequence = new Fleur.SequenceType(Fleur.Node.ANY_NODE, Fleur.Type_anyType, "0");
Fleur.SequenceType_ENTITY_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_ENTITY, "?");
Fleur.SequenceType_ENTITY_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_ENTITY, "*");
Fleur.SequenceType_entry_01 = new Fleur.SequenceType(Fleur.Node.ENTRY_NODE, Fleur.Type_anyType, "?");
Fleur.SequenceType_entry_0n = new Fleur.SequenceType(Fleur.Node.ENTRY_NODE, Fleur.Type_anyType, "*");
Fleur.SequenceType_entry_1 = new Fleur.SequenceType(Fleur.Node.ENTRY_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_float_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_float, "?");
Fleur.SequenceType_function_01 = new Fleur.SequenceType(Fleur.Node.FUNCTION_NODE, Fleur.Type_anyType, "?");
Fleur.SequenceType_function_1 = new Fleur.SequenceType(Fleur.Node.FUNCTION_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_gDay_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_gDay, "?");
Fleur.SequenceType_gMonth_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_gMonth, "?");
Fleur.SequenceType_gMonthDay_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_gMonthDay, "?");
Fleur.SequenceType_gYear_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_gYear, "?");
Fleur.SequenceType_gYearMonth_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_gYearMonth, "?");
Fleur.SequenceType_hexBinary_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_hexBinary, "?");
Fleur.SequenceType_ID_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_ID, "?");
Fleur.SequenceType_IDREF_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_IDREF, "?");
Fleur.SequenceType_IDREF_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_IDREF, "*");
Fleur.SequenceType_int_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_int, "?");
Fleur.SequenceType_integer_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_integer, "?");
Fleur.SequenceType_integer_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_integer, "*");
Fleur.SequenceType_integer_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_integer, "1");
Fleur.SequenceType_item_01 = new Fleur.SequenceType(Fleur.Node.ANY_NODE, Fleur.Type_anyType, "?");
Fleur.SequenceType_item_0n = new Fleur.SequenceType(Fleur.Node.ANY_NODE, Fleur.Type_anyType, "*");
Fleur.SequenceType_item_1 = new Fleur.SequenceType(Fleur.Node.ANY_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_item_1n = new Fleur.SequenceType(Fleur.Node.ANY_NODE, Fleur.Type_anyType, "+");
Fleur.SequenceType_language_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_language, "?");
Fleur.SequenceType_language_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_language, "1");
Fleur.SequenceType_long_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_long, "?");
Fleur.SequenceType_map_1 = new Fleur.SequenceType(Fleur.Node.MAP_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_Name_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_Name, "?");
Fleur.SequenceType_NCName_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_NCName, "?");
Fleur.SequenceType_negativeInteger_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_negativeInteger, "?");
Fleur.SequenceType_NMTOKEN_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_NMTOKEN, "?");
Fleur.SequenceType_NMTOKEN_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_NMTOKEN, "*");
Fleur.SequenceType_nonNegativeInteger_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_nonNegativeInteger, "?");
Fleur.SequenceType_nonPositiveInteger_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_nonPositiveInteger, "?");
Fleur.SequenceType_normalizedString_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_normalizedString, "?");
Fleur.SequenceType_numeric_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_numeric, "?");
Fleur.SequenceType_numeric_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_numeric, "1");
Fleur.SequenceType_positiveInteger_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_positiveInteger, "?");
Fleur.SequenceType_processing_instruction_1 = new Fleur.SequenceType(Fleur.Node.PROCESSING_INSTRUCTION_NODE, Fleur.Type_anyType, "1");
Fleur.SequenceType_QName_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_QName, "?");
Fleur.SequenceType_QName_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_QName, "1");
Fleur.SequenceType_short_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_short, "?");
Fleur.SequenceType_string_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_string, "?");
Fleur.SequenceType_string_0n = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_string, "*");
Fleur.SequenceType_string_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_string, "1");
Fleur.SequenceType_time_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_time, "?");
Fleur.SequenceType_time_1 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_time, "1");
Fleur.SequenceType_token_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_token, "?");
Fleur.SequenceType_unsignedByte_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_unsignedByte, "?");
Fleur.SequenceType_unsignedInt_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_unsignedInt, "?");
Fleur.SequenceType_unsignedLong_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_unsignedLong, "?");
Fleur.SequenceType_unsignedShort_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_unsignedShort, "?");
Fleur.SequenceType_untypedAtomic_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_untypedAtomic, "?");
Fleur.SequenceType_yearMonthDuration_01 = new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_yearMonthDuration, "?");