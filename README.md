# element_blocker_extension

Chrome browser extension that allows you to hide any html element on a page.
The user can supply a list of css selectors for any given url and the extension will inject the css:

{ 
  display: hidden !important 
}

for each selector provided.

Each url or selector can also be temporarily disabled without the need to delete the rule.

### Project setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```