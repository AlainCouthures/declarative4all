# Fleur: XQuery Engine

## About

Fleur is an XQuery engine. It uses its own DOM engine.

Fleur aims to directly process all structured data, such as JSON, CSV, ... like XML.

This is a pure Javascript solution for browsers and nodeJS without any dependency (library or module).
Features such as file management, process execution, ... are, of course, unavailable for browsers.

Execution is performed asynchronously which meanings that, for example,
calling the doc() function within an XPath expression will not block global execution but will be resumed when corresponding data will be effectively available.

## Current Status

The DOM engine is at DOM Level 2 with DOM Level 3 features.

The XQuery engine is currently in Alpha version because of partial support for XPath operators and functions and for XQuery instructions.

## Specific features

Before execution, source expressions are compiled by the parser into an internal format which can be rendered as XQueryX.

The XQuery engine is always processing nodes, whether in a document or not.
Therefore, atomic values are internally stored as orphan TEXT nodes with an associated schema type.
Errors are also implemented are as TEXT nodes.

As a consequence, there is a divergence with XPath/XQuery 3.1 about maps and arrays which are supported using extra nodes types: ARRAY, MAP, ENTRY.

Functions are also stored with an extra node type.

For sequences, yet another node type is used but child nodes are not altered when added for axes to continue to be usable.

For debug purposes, a serialization in XQuery syntax is available.
It renders a constant expression which would be evaluated equally, with a type constructor for atomic values,
with the sequence notation and with element contructors eventually.

A HANDLER data type is used for storing handlers from the operating system.

## In Browser Execution

The In Browser Mode has been implemented to be very similar to what the xqib.org project proposed, using the SCRIPT tag with type="application/xquery".

The "b" namespace for browser functions defines those functions:

- addEventListener($elt as node()?, $evtname as xs:string, $func as function(*))
- alert($message as xs:string?)
- dom() as node()
- getProperty($elt as node()?, $propname as xs:string) as xs:string
- getStyle($elt as node()?, $stylename as xs:string) as xs:string
- js-eval($code as xs:string?)
- setStyle($elt as node()?, $stylename as xs:string, $stylevalue as xs:string)

## Server Pages Execution

Regular .xqy files can be executed by the manager.js HTTP server. The mediatype is calculated from the result. Partial support for BaseX modules is provided.

Embedding XQuery within files of different types is to be implemented. It will be based on a declaration at the beginning of each file in <? format. The embedding separators should be <{ and }>.

## Command Line Interface

Command line parameters are supported as follows:
- -s:     XML input file (optional)
- -o:     output file (optional)
- -q:     query file
- -qs:    query string
- params  name=value as externals
