# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.4](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.4.3...@jfront/core-redux-saga@0.4.4) (2021-06-03)

**Note:** Version bump only for package @jfront/core-redux-saga





## [0.4.3](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.4.2...@jfront/core-redux-saga@0.4.3) (2021-05-26)


### Bug Fixes

* search with array params ([46c069f](https://github.com/Jepria/jfront-core/commit/46c069fe755121d300d914b0cb0114441979d25e))





## [0.4.2](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.4.1...@jfront/core-redux-saga@0.4.2) (2021-04-01)


### Bug Fixes

* search type ([b6be2c7](https://github.com/Jepria/jfront-core/commit/b6be2c7cec95feb9cf7ddd10118d62d10278702a))





## [0.4.1](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.4.0...@jfront/core-redux-saga@0.4.1) (2021-04-01)


### Bug Fixes

* null and undefined query params were added to query string ([6cbc5f4](https://github.com/Jepria/jfront-core/commit/6cbc5f454b8cf08ef16be2d925572509d9ab2c15))





# [0.4.0](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.3.0...@jfront/core-redux-saga@0.4.0) (2021-03-22)


### Bug Fixes

* create event not working in React 17 without cancelable and bubbles properties ([4de1314](https://github.com/Jepria/jfront-core/commit/4de13140b7fe94dddb4a71f71113b0e9c03ec3b0))
* remove unused ([67623d3](https://github.com/Jepria/jfront-core/commit/67623d324671fa8e44f36f988668768abf994f8c))
* remove unused functions ([166de4d](https://github.com/Jepria/jfront-core/commit/166de4d85ae354313e8669ec9eac39f8280ece41))


### Features

* add SearchSlice ([f14e8c2](https://github.com/Jepria/jfront-core/commit/f14e8c2134ace07c02b33d6a96d1d936b65f3b36))





# [0.3.0](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.2.2...@jfront/core-redux-saga@0.3.0) (2021-03-17)


### Code Refactoring

* dependencies updated ([2911f41](https://github.com/Jepria/jfront-core/commit/2911f419f59a32c538d8fdfce4788aaf90f5b676))


### Features

* search with query string and http get method ([4286229](https://github.com/Jepria/jfront-core/commit/4286229a56a4313fbe9ed55f886f03f09924a0d2))


### BREAKING CHANGES

* react 17.0.1





## [0.2.2](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.2.1...@jfront/core-redux-saga@0.2.2) (2021-02-03)


### Bug Fixes

* created record added to selectedRecords after create success ([34e7dca](https://github.com/Jepria/jfront-core/commit/34e7dcafa876e11863ac208eeef06282bf1c410b))





## [0.2.1](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.2.0...@jfront/core-redux-saga@0.2.1) (2021-01-26)


### Bug Fixes

* createOptionSlice Promise ([e26ad0d](https://github.com/Jepria/jfront-core/commit/e26ad0d83b8dd79641d580922bbac93bc5521c9a))
* error has any type and is optional ([8dcb783](https://github.com/Jepria/jfront-core/commit/8dcb783bc1616df591b33003f9abf7e213bea8ed))





# [0.2.0](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.1.1...@jfront/core-redux-saga@0.2.0) (2021-01-21)


### Bug Fixes

* change name searchTemplate -> searchRequest in SearchState. Added pageSize, pageNumber ([be56b36](https://github.com/Jepria/jfront-core/commit/be56b36a33847dd947fc6e954b38bf72567a0753))


### Features

* selected records are filled with record found in getRecordById ([c391c2b](https://github.com/Jepria/jfront-core/commit/c391c2b0f9a692d1e78d0b3241b69704f14a84b9))





## [0.1.1](https://github.com/Jepria/jfront-core/compare/@jfront/core-redux-saga@0.1.0...@jfront/core-redux-saga@0.1.1) (2021-01-18)


### Bug Fixes

* delete success action set isLoading to false ([e5e360e](https://github.com/Jepria/jfront-core/commit/e5e360e90fe3838ddca8234730d8efd8dbb1d5b5))





# 0.1.0 (2021-01-18)


### Bug Fixes

* failure action type ([bdb6b04](https://github.com/Jepria/jfront-core/commit/bdb6b043c269a2056ded836547aa8cc91073564a))


### Features

* generic primary key for rest connectors ([da9d27d](https://github.com/Jepria/jfront-core/commit/da9d27daa4be402a1cda9c58b4ec27b1ffe656a0))
* option slice with filter parameters ([215bda9](https://github.com/Jepria/jfront-core/commit/215bda920f29760f5a5b6d29d189b50a6922a307))
* redux splitted in two modules thunk/saga ([141ab4b](https://github.com/Jepria/jfront-core/commit/141ab4b870b019fff734dc3e1a341a3ec0abf965))
