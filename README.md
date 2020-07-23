# jfront-core
JFront library core packages

Библиотека включает в себя общий функционал. Содержимое в первую очередь нацелено на платформонезависимые решения. Поэтому подразумевает, по возможности, использование полифиллов для React, React Native сред.

Код не содержит обращений к платформозависимым сущностям (например, DOM).

### Installing from github

Using master.
```
npm i https://github.com/Jepria/jfront-core.git
```
Using branch/tag.
```
npm i https://github.com/Jepria/jfront-core.git#branch

```
### Использование компонентов из локальной сборки в прикладном проекте:
- `jfront-core>npm run build` —
    *ts* и *js* файлы из папки *src* компилируются и попадают в папку *dist*
- `jfront-core>npm link` —
    создаётся [npm-link](https://docs.npmjs.com/cli/link.html) для работы с *jfront-core* как с npm-модулем в другом проекте
- `another-app>npm link jfront-core` —
    *jfront-core* подтягивается в этот проект как npm-модуль (команда `npm install` аннулирует созданный прежде *npm link* в этом проекте, поэтому `npm link front-core` нужно повторно выполнять всякий раз после `npm install`)
    
### Добавление нового функционала:
- Написать *ts*, *js* код в подходящем файле (например, *src/feature/feature.js*)
- `jfront-core>npm run build` —
    *ts* и *js* файлы из папки *src* компилируются и попадают в папку *dist*
- Добавить экспорт в файл *./src/index.ts* из добавленных исходных файлов: 
    ```
    export * from './feature/feature.js';
    ```
### Подключение сторонних библиотек
- Если предполагается, что библиотека не будет повторно использована в коде потребителя, то следует объявить ее в `devDependencies` в `package.json`
- Если возможно, что библиотека будет использована в прикладном коде, то нужно объявить ее в  `devDependencies` и `peerDependencies` в `package.json`и добавить исключение в сборку `webpack` (блок externals):

    ```
    module.exports = {
      ...
      module: {
      ...
      externals: {
        //'имя библиотеки' : 'имя библиотеки'
        'lib-name': 'lib-name',
      },
      ...
    };
    ```
### Тестирование
Код, по стандарту, должен покрываться *Unit*-тестами. Для запуска тестов используется `Jest`. Тесты находятся в папке `./test` и должны иметь имя `*.test.js`.
