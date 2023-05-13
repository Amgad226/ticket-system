//install express generator

```shell
npm install express-generator -g
```

//install nodemon for dev mode

```shell
npm install nodemon -g
```

// add script to package.json for nodemon in dev mode

```javascript
"scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
    }
```

//create express app

```shell
express --view=pug myapp
```
