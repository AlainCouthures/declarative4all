module namespace m = "http://www.xqib.org/module";

declare function m:sayHello($name as xs:string) {
    concat(concat("Hello, ", $name), "!")
};