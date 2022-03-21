# Configuration Documentation

`ignoreJarEntries` - Files to exclude in the form of the final jar.

`validObfPackages` - Packages that are allowed to be obfuscated. 

`excludeObfClasses` - Classes that will not get obfuscated. 

`excludeObfAnnotations` - Annotations that mark classes to be ignored by the obfuscation process.

`obfPackage` - The package name where to put obfuscated classes.

`obfPackageMapping` - Keeps the name of the classes in the directory specified during the obfuscation process. 

`enableClassObf` - Enables obfuscating class names.

`enableFieldObf` - Enables obfuscating field names.

`enableMethodObf` - Enables obfuscating method names.

`enableLocalObf` - Enables obfuscating local variables.

`obfNameFormat` - The format of obfuscated names.

`removeKotlinMetaData` - Removes additional information added by Kotlin. 

`removeSignatures` - Removes extended type information for example List<Int> becomes List<Object>. 

`removeSourceInfo` - Removes the name of the original source file for the class. In Stacktraces this is shows "Unknown source". 

`hideClassMembers` - Mark classes as synthetic to hide them from bad decompilers.

`eventAnnotations` - Annotations for methods with event handlers, they need special metadata to work. 

`removeLineNumbers` - Removes line number instructions.

`stringMangling` - Hides the contents of strings.

`fieldValueOverrides` - Map class => (field => value). Allows to override a field value on obfuscation.

`addFunctionIndirections` - Remove normal function calls to new functions that call the original function, this is to avoid non-obfuscated names mixed with obfuscated names.

`criticalPerformanceClasses` - Classes where the performance is important, to avoid increasing the computation cost. 
