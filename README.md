# ancestor-listmaker
Ancestor Listmaker app for use with WikiTree

App was created in VSCode Studio using Javascript and React.

Brief description of the files:
- App.js is the file that renders the main screen and pulls in the other elements.
- appstyles.module.css contains the CSS for App.js
- ancestors.js contains the code that pulls the Descendant's ancestors for X generations
- categoryPages.js contains that code that pulls the WikiTree category/template pages for the categories that are based on those kinds of pages
- filters.js contains the code that filters the ancestors for the applicable category
- index.js is a stub file created by React that calls App.js
- sort.js contains the functions that do the sorting of the lists by name, locations or date
- Table.js is a React component to create the output list/table
- tablestyles.module.css contains the cSS for Table.js
