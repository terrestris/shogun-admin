## [11.5.0](https://github.com/terrestris/shogun-admin/compare/v11.4.4...v11.5.0) (2023-07-14)


### Features

* make default page size configurable ([cd1c80e](https://github.com/terrestris/shogun-admin/commit/cd1c80e1ecb2aca9785e0a0583905cb1b925c11b))
* make entity tables pageable ([4df31e6](https://github.com/terrestris/shogun-admin/commit/4df31e64f3ebe9240864aa0e7d29f249a63983da))


### Dependencies

* make use of totalElements field ([5ebd4b9](https://github.com/terrestris/shogun-admin/commit/5ebd4b9f9eef87d2a2bcb24de3b1e1485936a3a0))
* update shogun-util ([741871f](https://github.com/terrestris/shogun-admin/commit/741871f111ae9f9715e049100811000bb316ba14))


### Bugfixes

* don't unnecessarily extend HTMLDiv type ([45255f0](https://github.com/terrestris/shogun-admin/commit/45255f00b6b813069c3609adaad56e293f98ff7d))
* dont't request all entities to get the count ([f1a4f68](https://github.com/terrestris/shogun-admin/commit/f1a4f682c48327733e4b928077192e9f0432ce63))

## [11.4.4](https://github.com/terrestris/shogun-admin/compare/v11.4.3...v11.4.4) (2023-06-29)


### Bugfixes

* also check for the extra mime type before uploading ([25a1604](https://github.com/terrestris/shogun-admin/commit/25a1604185600b84a3ae0e6337e1ee5f86fadd59))

## [11.4.3](https://github.com/terrestris/shogun-admin/compare/v11.4.2...v11.4.3) (2023-06-29)


### Bugfixes

* add x-zip-compressed mimetype ([8258b34](https://github.com/terrestris/shogun-admin/commit/8258b348d34f9894bf058b480c207a5548b45e4b))

## [11.4.2](https://github.com/terrestris/shogun-admin/compare/v11.4.1...v11.4.2) (2023-06-27)


### Bugfixes

* fix layer preview via [@terrestris](https://github.com/terrestris) util packages update ([bcfd377](https://github.com/terrestris/shogun-admin/commit/bcfd377c3db1936b8f11eda95f053ca0fc2edac1))

## [11.4.1](https://github.com/terrestris/shogun-admin/compare/v11.4.0...v11.4.1) (2023-06-26)


### Bugfixes

* replace deprecated menu overlay prop by items ([4a9baed](https://github.com/terrestris/shogun-admin/commit/4a9baed687041ffd9d9b941ae108793c3345573f))
* replace deprecated property visible by open ([e5c19d2](https://github.com/terrestris/shogun-admin/commit/e5c19d260ff9afeb777fa2ae69eea493e04ec09d))

## [11.4.0](https://github.com/terrestris/shogun-admin/compare/v11.3.2...v11.4.0) (2023-06-05)


### Features

* update readme and release shoguns layer editable function ([cff9ae5](https://github.com/terrestris/shogun-admin/commit/cff9ae54942b29e30ccf9f03e7089e8981f90d11))


### Dependencies

* updates sohgun-util to version 5.4.1 ([71466d6](https://github.com/terrestris/shogun-admin/commit/71466d6fe58748830fcea4868f99cff227e4299c))
* use next shogun-util version ([667ad0e](https://github.com/terrestris/shogun-admin/commit/667ad0ed3ef5c9d74d2e1c8de7e89a09dbbdc680))


### Changes in configuration

* updates some gh actions ([cc7f96d](https://github.com/terrestris/shogun-admin/commit/cc7f96d1a4c843773360d3c84bc184c7f2020680))

## [11.3.2](https://github.com/terrestris/shogun-admin/compare/v11.3.1...v11.3.2) (2023-04-13)


### Bugfixes

* disable checking login status in iframe ([0a18214](https://github.com/terrestris/shogun-admin/commit/0a1821475f78afcde0c9b9b8e17164d750576984))

## [11.3.1](https://github.com/terrestris/shogun-admin/compare/v11.3.0...v11.3.1) (2023-04-12)


### Dependencies

* **deps-dev:** bump webpack from 5.75.0 to 5.76.0 ([c2fc360](https://github.com/terrestris/shogun-admin/commit/c2fc3602d35516140f697aa54ed3c96daec5246f))


### Bugfixes

* send attributes of the upload layer candidate and set correct nativeName ([8eecea4](https://github.com/terrestris/shogun-admin/commit/8eecea4b5bf7117a19be7caa7d676a9132329cd8))

## [11.3.0](https://github.com/terrestris/shogun-admin/compare/v11.2.1...v11.3.0) (2023-03-08)


### Features

* init playwright ([#152](https://github.com/terrestris/shogun-admin/issues/152)) ([4534961](https://github.com/terrestris/shogun-admin/commit/45349613789780e89de2e33a8a956039307a4c9a))

## [11.2.1](https://github.com/terrestris/shogun-admin/compare/v11.2.0...v11.2.1) (2023-02-20)


### Bugfixes

* upload button translation ([#150](https://github.com/terrestris/shogun-admin/issues/150)) ([22c2446](https://github.com/terrestris/shogun-admin/commit/22c2446e31d065597659323f606d40acd2c66e4a))

## [11.2.0](https://github.com/terrestris/shogun-admin/compare/v11.1.1...v11.2.0) (2023-02-15)


### Features

* add LayerPreview component ([9173344](https://github.com/terrestris/shogun-admin/commit/917334438404592b7d6126f0d4299e7935b012cb))


### Changes in configuration

* add ResizeObserver mock and cleanup imports ([a6e1312](https://github.com/terrestris/shogun-admin/commit/a6e131287d729a6c086e173a0da6350a4ba59b0a))


### Changes in layout

* minor style fixes ([48e4e1c](https://github.com/terrestris/shogun-admin/commit/48e4e1c850d9de13158542b8232ab87dd21d7f75))


### Dependencies

* **release:** 11.1.2 [skip ci] ([aa03392](https://github.com/terrestris/shogun-admin/commit/aa03392c0f6211d8514b35c7ded543a6ac5ed7f0))
* update @terrestris/ol-util and ol ([e6ad6cd](https://github.com/terrestris/shogun-admin/commit/e6ad6cd61ee1d049107e84120c4d4206506354d2))


### Bugfixes

* add loading spinner for the entity form ([b616794](https://github.com/terrestris/shogun-admin/commit/b61679408661645324e4c7ca547b44785b709731))
* check for base classes ([f9c348f](https://github.com/terrestris/shogun-admin/commit/f9c348f9b6f55140a2e2abce3bcf657d89ac131e))
* make use of await ([5b71959](https://github.com/terrestris/shogun-admin/commit/5b71959cc7cf9fd23025a055ce5a3e305890bfe4))
* remove unneeded method ([3992e3a](https://github.com/terrestris/shogun-admin/commit/3992e3ad947b977bff114f760a94da77572d25b1))
* render permission grid if form and entity in sync only ([7cb85f7](https://github.com/terrestris/shogun-admin/commit/7cb85f78a0dfd5922a5708e1a55e26aa6b838e65))
* resets the input form to the initial value ([5e10b5b](https://github.com/terrestris/shogun-admin/commit/5e10b5b0e3b8f9cbe09a5af22d59d0d528525612))
* wrap code in try-catch ([d3c84cd](https://github.com/terrestris/shogun-admin/commit/d3c84cdea6c432b503fd489ad653f683bd867460))

## [11.1.2](https://github.com/terrestris/shogun-admin/compare/v11.1.1...v11.1.2) (2023-02-15)


### Bugfixes

* resets the input form to the initial value ([5e10b5b](https://github.com/terrestris/shogun-admin/commit/5e10b5b0e3b8f9cbe09a5af22d59d0d528525612))

## [11.1.1](https://github.com/terrestris/shogun-admin/compare/v11.1.0...v11.1.1) (2023-01-13)


### Bugfixes

* changes method to ensure undefined values can be passed also ([#147](https://github.com/terrestris/shogun-admin/issues/147)) ([f96539d](https://github.com/terrestris/shogun-admin/commit/f96539df868b7058c12c95549278b56e2aa0fd3d))

## [11.1.0](https://github.com/terrestris/shogun-admin/compare/v11.0.0...v11.1.0) (2023-01-09)


### Features

* show suggestions for layerId fields in the JSON editor ([7aa4194](https://github.com/terrestris/shogun-admin/commit/7aa4194acd4b11e05560acbc676003fd0fa3a48a))


### Dependencies

* **deps:** bump json5 from 2.2.1 to 2.2.3 ([6b93ef9](https://github.com/terrestris/shogun-admin/commit/6b93ef987ea1db6abe3330d178071def4b9791f0))


### Bugfixes

* load monaco-editor from node_modules instead of external CDN ([6aa723c](https://github.com/terrestris/shogun-admin/commit/6aa723c57e3fef653b40802786c4d4056e73d456))
* pin version of semantic release to compatible one ([c374d7f](https://github.com/terrestris/shogun-admin/commit/c374d7f8d54c4efdc57bf74605543b1ed8ab392a))

## [11.0.0](https://github.com/terrestris/shogun-admin/compare/v10.8.0...v11.0.0) (2023-01-05)


### Dependencies

* update to latest shogun-util and add openapi-types ([86f2a2d](https://github.com/terrestris/shogun-admin/commit/86f2a2dd70c188f568a0d20efedd1a9c3e4c97e9))


### Breaking changes

* make use of OpenAPI version 3 (available in the SHOGun versions >= 16) ([8123134](https://github.com/terrestris/shogun-admin/commit/8123134429c6a90b1b7649297f78a64b3a24623d))

## [10.8.0](https://github.com/terrestris/shogun-admin/compare/v10.7.2...v10.8.0) (2022-12-07)


### Features

* add typing for config ([e874a2d](https://github.com/terrestris/shogun-admin/commit/e874a2d1469f1f79769c216d8c866eb0b529d574))


### Bugfixes

* apply suggestions from code review ([ec29587](https://github.com/terrestris/shogun-admin/commit/ec295873c0ec565553eda68e201fb6455be0f724))

## [10.7.2](https://github.com/terrestris/shogun-admin/compare/v10.7.1...v10.7.2) (2022-12-07)


### Dependencies

* **deps:** bump decode-uri-component from 0.2.0 to 0.2.2 ([baf4036](https://github.com/terrestris/shogun-admin/commit/baf403613447216475a9a9d4a1c9ecbf3d549913))

## [10.7.1](https://github.com/terrestris/shogun-admin/compare/v10.7.0...v10.7.1) (2022-11-22)


### Dependencies

* **deps:** bump loader-utils from 2.0.3 to 2.0.4 ([e8d418d](https://github.com/terrestris/shogun-admin/commit/e8d418d43fe592f74d0a1d5de679dfcdd71bd10c))


### Bugfixes

* fix logout for non keycloak setups ([#140](https://github.com/terrestris/shogun-admin/issues/140)) ([52faffb](https://github.com/terrestris/shogun-admin/commit/52faffb9195afe2bd87a83e3d07a16a861696436))

## [10.7.0](https://github.com/terrestris/shogun-admin/compare/v10.6.1...v10.7.0) (2022-11-11)


### Features

* added button to upload new geotiff subject ([65aa6e2](https://github.com/terrestris/shogun-admin/commit/65aa6e237a66b4fb01946b9a51ae4f7b807fc85b))
* support SHAPE-ZIP upload as well ([25a5ed4](https://github.com/terrestris/shogun-admin/commit/25a5ed4d0691b93bc0257845b7cdb6f87a2fea3c))


### Dependencies

* **deps:** bump loader-utils from 2.0.2 to 2.0.3 ([34a4fa6](https://github.com/terrestris/shogun-admin/commit/34a4fa68508d57b74f20d75b939e678f4b54e602))


### Bugfixes

* added space between buttons on left toolbar ([13d7984](https://github.com/terrestris/shogun-admin/commit/13d798466cc27ae575e1e2fcf3c6e5d97bcb3ef2))
* adjust default value ([b9caa33](https://github.com/terrestris/shogun-admin/commit/b9caa33f10452a45149a0b851432ff253b854870))


### Changes in layout

* share function arguments ([176fd8b](https://github.com/terrestris/shogun-admin/commit/176fd8bccc5e9aa0a57ea207185e5c024f7b77cb))

## [10.6.1](https://github.com/terrestris/shogun-admin/compare/v10.6.0...v10.6.1) (2022-10-13)


### Bugfixes

* properly reset the dirty state of the entity form ([fa2636a](https://github.com/terrestris/shogun-admin/commit/fa2636a76e59e8ac61c8ac6b75995212d8d1703c))

## [10.6.0](https://github.com/terrestris/shogun-admin/compare/v10.5.1...v10.6.0) (2022-10-07)


### Features

* allow pagination configuration per entity ([7ac1abd](https://github.com/terrestris/shogun-admin/commit/7ac1abd5073c3d5acfcdd38cc23bb735d6806e91))

## [10.5.1](https://github.com/terrestris/shogun-admin/compare/v10.5.0...v10.5.1) (2022-10-04)


### Bugfixes

* provide an empty string if no mail is present ([5700480](https://github.com/terrestris/shogun-admin/commit/570048042401faf98d9f6eb15270856eaceb8499))

## [10.5.0](https://github.com/terrestris/shogun-admin/compare/v10.4.0...v10.5.0) (2022-09-29)


### Features

* show app only if the current user has an appropriate role ([7e2fb1a](https://github.com/terrestris/shogun-admin/commit/7e2fb1acf57833570f1869dca6c1964ca86238ce))

## [10.4.0](https://github.com/terrestris/shogun-admin/compare/v10.3.0...v10.4.0) (2022-09-28)


### Features

* added admin version to application info ([a703f09](https://github.com/terrestris/shogun-admin/commit/a703f09b0b27b9080afd8a450e0b1f458bc3587b))


### Bugfixes

* added missing translation. fixed test ([0af4192](https://github.com/terrestris/shogun-admin/commit/0af41926e8641b00e7a9692399abeab4b46adce3))
* added tranlation strings to Application Info modal ([0c7db54](https://github.com/terrestris/shogun-admin/commit/0c7db54c0727163acafa00a52df4a6a5d310d31c))
* fixed test. added engines to package.json ([38d43f1](https://github.com/terrestris/shogun-admin/commit/38d43f19c82bcf8377490f5ff94f39b1b36266c5))
* removed unneeded ts-ignore comments ([e188620](https://github.com/terrestris/shogun-admin/commit/e188620ee9021ea42b1608cfc74762072499be9a))
* reverted package-lock.json changes ([2baa360](https://github.com/terrestris/shogun-admin/commit/2baa360763f48d6a0a00222b6f553f2dbc32d7d6))
* updated ApplicationInfo test ([125fdd7](https://github.com/terrestris/shogun-admin/commit/125fdd7158e85cccad2fd13ff6bb1c6550c81c07))

## [10.3.0](https://github.com/terrestris/shogun-admin/compare/v10.2.2...v10.3.0) (2022-09-23)


### Features

* use docker-public.terrestris.de registry ([eed9cdb](https://github.com/terrestris/shogun-admin/commit/eed9cdb05923ccb881394355257fa3d22f0de1cf))

## [10.2.2](https://github.com/terrestris/shogun-admin/compare/v10.2.1...v10.2.2) (2022-08-31)


### Bugfixes

* fix schema validation for array types ([928c2fb](https://github.com/terrestris/shogun-admin/commit/928c2fb0df854110e3f7d3cc6df93b5f0b7f20e5))
* provide unique component keys ([4ca3e08](https://github.com/terrestris/shogun-admin/commit/4ca3e0836204493c8c9e44b42f2105369485e2bc))
* remove unneeded field prop ([cbda0fb](https://github.com/terrestris/shogun-admin/commit/cbda0fb7b5cd50bc8b989bc58097373572316fb1))

## [10.2.1](https://github.com/terrestris/shogun-admin/compare/v10.2.0...v10.2.1) (2022-08-30)


### Changes in configuration

* integrate sonarqube ([#124](https://github.com/terrestris/shogun-admin/issues/124)) ([2364b97](https://github.com/terrestris/shogun-admin/commit/2364b9712402bcb908a668338ea55488bdf84556))


### Bugfixes

* fixing typo ([48acaeb](https://github.com/terrestris/shogun-admin/commit/48acaeb98f7704fc2340ae2cf48ae1a537f587da))

## [10.2.0](https://github.com/terrestris/shogun-admin/compare/v10.1.5...v10.2.0) (2022-08-18)


### Features

* add the UserPermissionGrid to configure the UserInstancePermissions for a given entity ([b5dbb4b](https://github.com/terrestris/shogun-admin/commit/b5dbb4b9e0dd8fe22da77eecb4be0becb235b794))


### Changes in layout

* allow dot and bracket notation ([66ad8fb](https://github.com/terrestris/shogun-admin/commit/66ad8fbd40950a4606192b72fe90aeea78fbb259))
* fix lint warnings ([43120a9](https://github.com/terrestris/shogun-admin/commit/43120a9966b1c4f311a04a9deb5c396127f26d5a))


### Dependencies

* update shogun-util ([a7c3e8c](https://github.com/terrestris/shogun-admin/commit/a7c3e8cb52ebdcd670990f4406581ce1df6389be))


### Bugfixes

* check if name (as string) is available ([a74c34a](https://github.com/terrestris/shogun-admin/commit/a74c34a0a918cb96531d67fe98bca0e482ab7045))
* sort users ascending initially ([5c30c0b](https://github.com/terrestris/shogun-admin/commit/5c30c0b2305b483e9b88a0719c8c9d0d13ad3fca))

## [10.1.5](https://github.com/terrestris/shogun-admin/compare/v10.1.4...v10.1.5) (2022-08-18)


### Bugfixes

* adds missing translation ([#122](https://github.com/terrestris/shogun-admin/issues/122)) ([cea5c88](https://github.com/terrestris/shogun-admin/commit/cea5c88824ab7da00ff2ce702231cf9c6c47738d))

## [10.1.4](https://github.com/terrestris/shogun-admin/compare/v10.1.3...v10.1.4) (2022-08-15)


### Bugfixes

* adds a effect to update the table entries when the entity changes ([cef0e67](https://github.com/terrestris/shogun-admin/commit/cef0e67bdab7202abe7de80015d1d624a94d3ddd))

## [10.1.3](https://github.com/terrestris/shogun-admin/compare/v10.1.2...v10.1.3) (2022-08-15)


### Bugfixes

* fix fullscreen mode again ([3051fb3](https://github.com/terrestris/shogun-admin/commit/3051fb3d25c3322816de648703b1ea44e3067a5c))

## [10.1.2](https://github.com/terrestris/shogun-admin/compare/v10.1.1...v10.1.2) (2022-08-10)


### Bugfixes

* adds fullscreen translation ([e635339](https://github.com/terrestris/shogun-admin/commit/e635339c8de1fe5ffd9911361d6c7dea53d6160b))
* adds missing translation ([f740338](https://github.com/terrestris/shogun-admin/commit/f7403388f26a492ea19403fe082054eeede1eb47))

## [10.1.1](https://github.com/terrestris/shogun-admin/compare/v10.1.0...v10.1.1) (2022-08-10)


### Changes in configuration

* scans the jest coverage and sends a report to sonarqube ([#113](https://github.com/terrestris/shogun-admin/issues/113)) ([910945f](https://github.com/terrestris/shogun-admin/commit/910945fbdb870d9effcf657b1f33cb1a79a59967))


### Bugfixes

* ensures fullscreen for all childs except the first ([cc6c71d](https://github.com/terrestris/shogun-admin/commit/cc6c71d6432474de627e57f4b7f3cac8a2ac7371))

## [10.1.0](https://github.com/terrestris/shogun-admin/compare/v10.0.0...v10.1.0) (2022-08-08)


### Features

* add keyboard shortcut to save configs ([2aaa2d6](https://github.com/terrestris/shogun-admin/commit/2aaa2d62fec898d7c5957a57fff8261fc3d5681e))


### Bugfixes

* also translate success / error messages ([8b577dd](https://github.com/terrestris/shogun-admin/commit/8b577ddc42f00ae7be4bb90e612afb46528647ef))
* code style improvement ([a2dacc1](https://github.com/terrestris/shogun-admin/commit/a2dacc109f26cf1fa72e8abd89a11cff863d1ec1))

## [10.0.0](https://github.com/terrestris/shogun-admin/compare/v9.4.2...v10.0.0) (2022-08-04)


### Breaking changes

* Json translation ([#111](https://github.com/terrestris/shogun-admin/issues/111)) ([e667309](https://github.com/terrestris/shogun-admin/commit/e6673091d560424e4cf0c39051b69bd7cc74e70b))
* trigger major release ([902fdbc](https://github.com/terrestris/shogun-admin/commit/902fdbc49a9be145a0c255a79a4b7748981395c6))

## [9.4.2](https://github.com/terrestris/shogun-admin/compare/v9.4.1...v9.4.2) (2022-08-01)


### Dependencies

* **log-doc-height:** fix display area of status logs ([a4151b0](https://github.com/terrestris/shogun-admin/commit/a4151b071d99419429a178630af94ad4e9c5436e))


### Bugfixes

* adding missing translations ([#112](https://github.com/terrestris/shogun-admin/issues/112)) ([a5f5c25](https://github.com/terrestris/shogun-admin/commit/a5f5c25b27687056e89761ec786a9175ee982d87))

## [9.4.1](https://github.com/terrestris/shogun-admin/compare/v9.4.0...v9.4.1) (2022-07-28)


### Bugfixes

* add semantic-release github plugin ([e9a5fe2](https://github.com/terrestris/shogun-admin/commit/e9a5fe29b8de2f5b1a29f8dd9e905fd8826c5b04))

## [9.4.0](https://github.com/terrestris/shogun-admin/compare/v9.3.1...v9.4.0) (2022-07-28)


### Features

* add loading indicator when saving entities ([4e25e4f](https://github.com/terrestris/shogun-admin/commit/4e25e4f0c5f78fb967e8641acafee4db30e87af1))
* show gravatar in user chip ([64831ba](https://github.com/terrestris/shogun-admin/commit/64831baabd41b201783eb6f46c5a812e71e49fe2))
* translate antd table texts ([a863522](https://github.com/terrestris/shogun-admin/commit/a863522016816337bc5020f287d3c2af46217303))


### Dependencies

* **tool-filtering:** removed tool config from application.json ([bafa211](https://github.com/terrestris/shogun-admin/commit/bafa2112beb106099f08f05329d40a267177f57f))
* **tool-visibility:** added required configs to application.json, to add the tool config ([e8fce01](https://github.com/terrestris/shogun-admin/commit/e8fce01b7738d24bf3a64174f32da08d2fd24a35))
* updated application.json ([9cbc341](https://github.com/terrestris/shogun-admin/commit/9cbc341e5a47b3b184382026ec358f26d58d72f7))


### Bugfixes

* fix package lock file ([cee3923](https://github.com/terrestris/shogun-admin/commit/cee3923067444329efb8557192b92ed824c9b033))
* use npm ci in test pipeline ([6099b0a](https://github.com/terrestris/shogun-admin/commit/6099b0ac51a13dc88d3e25594ae4b7da4485da1a))

## [9.3.1](https://github.com/terrestris/shogun-admin/compare/v9.3.0...v9.3.1) (2022-07-28)


### Bugfixes

* fixes missing translations and a typo ([#106](https://github.com/terrestris/shogun-admin/issues/106)) ([4fd474b](https://github.com/terrestris/shogun-admin/commit/4fd474b9e7b87fac3e4fe57864e6ca296e7f5dd6))

## [9.3.0](https://github.com/terrestris/shogun-admin/compare/v9.2.0...v9.3.0) (2022-07-27)


### Features

* admin client translation ([#104](https://github.com/terrestris/shogun-admin/issues/104)) ([9a63800](https://github.com/terrestris/shogun-admin/commit/9a638000d261c1e767e837f848f1fa1508aedcca))

## [9.2.0](https://github.com/terrestris/shogun-admin/compare/v9.1.0...v9.2.0) (2022-07-27)


### Features

* integrates sonarscanner into builing pipeline ([60279b1](https://github.com/terrestris/shogun-admin/commit/60279b1f5933adda1df18187cef47b2bcee0806e))


### Bugfixes

* uses a absolute image ([04685e1](https://github.com/terrestris/shogun-admin/commit/04685e135c554a1b9a5e3681e0017c6733d46ea6))

## [9.1.0](https://github.com/terrestris/shogun-admin/compare/v9.0.3...v9.1.0) (2022-07-25)


### Features

* add feedback when saving entities ([ea166d0](https://github.com/terrestris/shogun-admin/commit/ea166d06e7096bd1764d6987580a17b2855adfd3))


### Dependencies

* **unit-tests:** added basic unit tests for all components ([8ee1be3](https://github.com/terrestris/shogun-admin/commit/8ee1be3fd623771cb4621270c94d96b9d73e5c18))
* **unit-tests:** fixed imports and names in tests ([55c67a5](https://github.com/terrestris/shogun-admin/commit/55c67a5d3c8675e20c62192c067ed0e1eb66cbb0))
* **unit-tests:** fixed jest config ([56c5888](https://github.com/terrestris/shogun-admin/commit/56c5888e91dc4241703cd6542f7146a2bd97fe3b))

## [9.0.3](https://github.com/terrestris/shogun-admin/compare/v9.0.2...v9.0.3) (2022-07-20)


### Bugfixes

* fixes changeHanlder of JSONEditor ([b123f87](https://github.com/terrestris/shogun-admin/commit/b123f870dcbef6e53946a508b99a245345a20c00))

## [9.0.2](https://github.com/terrestris/shogun-admin/compare/v9.0.1...v9.0.2) (2022-07-19)


### Bugfixes

* allow clearing JSON fields ([c31a1c2](https://github.com/terrestris/shogun-admin/commit/c31a1c299630cb75e11c863526ce5114a02fe333))
* fixes updating of object fields ([c2c8661](https://github.com/terrestris/shogun-admin/commit/c2c8661e0b174cc04821a8b9df72267051679896))
* switch to entity page after creation ([87e7d25](https://github.com/terrestris/shogun-admin/commit/87e7d259f37f8eedc12eb11fc7e2bdb2b214d679))

## [9.0.1](https://github.com/terrestris/shogun-admin/compare/v9.0.0...v9.0.1) (2022-07-18)


### Changes in layout

* adjust styling of markdown and json editors ([6c13b1b](https://github.com/terrestris/shogun-admin/commit/6c13b1b9237d15e2c90e9d29e600eaa89fe249bb))

## [9.0.0](https://github.com/terrestris/shogun-admin/compare/v8.0.0...v9.0.0) (2022-06-28)


### ⚠ BREAKING CHANGES

* Readds the keycloak-js adapter for authentication and removes
all models and services (except the Metric- and Loglevelservice) with the appropriate
ones from the shogun-util

### Changes in layout

* add editorconfig ([0e27655](https://github.com/terrestris/shogun-admin/commit/0e276554b86fcba44b91b6c998d0d293406419de))


### Breaking changes

* readd-keyloak-js adapter and init shogun-util ([2618685](https://github.com/terrestris/shogun-admin/commit/2618685a0daf27e9249ff85d1fc5dfbc80484076))
* remove UserProfileForm and redirect to keycloak account settings instead ([ce83381](https://github.com/terrestris/shogun-admin/commit/ce83381f891a90f53438cfaa1f9c2db0ad58babf))
* update app config and form configs ([7a6db14](https://github.com/terrestris/shogun-admin/commit/7a6db143928cb7e305d99bff0cb51f42b33916a7))


### Bugfixes

* rename keycloak host config ([80625a0](https://github.com/terrestris/shogun-admin/commit/80625a0dc942b15214c429dedb5902e2ce76f1e5))
* update ImageFile root and table work again ([634e45a](https://github.com/terrestris/shogun-admin/commit/634e45ad321383d32ca826fdce2af6ff0a317f53))


### Dependencies

* add shogun-util, keycloak-js and @react-keycloak/web dependencies ([04321e5](https://github.com/terrestris/shogun-admin/commit/04321e57662c077ee113d48728796dad4407361b))
* make default part for the config relative ([25edd9e](https://github.com/terrestris/shogun-admin/commit/25edd9e5c9b23b1c66b1cbf79adda2df303f921e))
* remove @react-keycloak/web dependency, get keycloak client from the SHOGunAPIClient ([940e637](https://github.com/terrestris/shogun-admin/commit/940e6374a89a193624f774d3e62602c5845887b7))
* update shogun-util ([e5a4151](https://github.com/terrestris/shogun-admin/commit/e5a4151e95ec0259c356078a3d7fb8b1c5f1dbc1))
* update to the latest shogun-util ([1da0ba7](https://github.com/terrestris/shogun-admin/commit/1da0ba7fb48188716994770cc234019c23aeb652))

## [8.0.0](https://github.com/terrestris/shogun-admin/compare/v7.5.3...v8.0.0) (2022-06-22)


### Bugfixes

* use username if exists, providerId otherwise ([61e8dd5](https://github.com/terrestris/shogun-admin/commit/61e8dd59a0619519e58cca66825db04ec8dd213c))


### Breaking changes

* remove path.base from logo in Header ([17cd95c](https://github.com/terrestris/shogun-admin/commit/17cd95c6b10343de84f11944068de91a7d161952))
* removes path.base from fallbackConfig ([020cd13](https://github.com/terrestris/shogun-admin/commit/020cd139149fd714f496c43deca8420f4c99dbca))

### [7.5.3](https://github.com/terrestris/shogun-admin/compare/v7.5.2...v7.5.3) (2022-06-02)


### Changes in layout

* remove max-height from FullscreenWrapper ([2d5d96b](https://github.com/terrestris/shogun-admin/commit/2d5d96b5a36eb2e1c0098dd7bd22ffcf73e78b1b))

### [7.5.2](https://github.com/terrestris/shogun-admin/compare/v7.5.1...v7.5.2) (2022-05-19)


### Changes in configuration

* remove dist and nginx from .gitignore ([d77c6ea](https://github.com/terrestris/shogun-admin/commit/d77c6eadd6a1f0a4988e9fa217195034fc27498b))


### Bugfixes

* fix nginx template filename ([a64d737](https://github.com/terrestris/shogun-admin/commit/a64d7374cf095dfef207a4b560374b20ebd0d8f6))

### [7.5.1](https://github.com/terrestris/shogun-admin/compare/v7.5.0...v7.5.1) (2022-05-19)


### Bugfixes

* fix buggy reseting of entity form ([45873b3](https://github.com/terrestris/shogun-admin/commit/45873b32055554c200406aa0234faa81b5bc2f12))
* fix sorting of numbers ([9605fe0](https://github.com/terrestris/shogun-admin/commit/9605fe0a41999275022464161075a2fbb4d774ae))

## [7.5.0](https://github.com/terrestris/shogun-admin/compare/v7.4.2...v7.5.0) (2022-05-16)


### Features

* introduce LinkCell to apply configurable link in the entity table ([b64e475](https://github.com/terrestris/shogun-admin/commit/b64e475c8aff34ab3250e28182fcad35363e028f))


### Bugfixes

* fix typo ([ca119c5](https://github.com/terrestris/shogun-admin/commit/ca119c53019151304905fe90e9b7590f38fcc1d3))
* remove unused imports ([8b0b745](https://github.com/terrestris/shogun-admin/commit/8b0b745c187777c45a9a2d1b73ecee61395214e4))
* set margin for the user menu ([ffc4b7c](https://github.com/terrestris/shogun-admin/commit/ffc4b7cf5fb05f31c651eb999c689af8a9b15321))
* set margin in parent component ([3538886](https://github.com/terrestris/shogun-admin/commit/35388861fef25f270a9befcd478fb1dbda29afd3))
* set padding for the left toolbar ([1c72426](https://github.com/terrestris/shogun-admin/commit/1c7242683b9fde7cb36359c769f09af3378618ad))

### [7.4.2](https://github.com/terrestris/shogun-admin/compare/v7.4.1...v7.4.2) (2022-05-13)


### Dependencies

* remove simple-progress-webpack-plugin ([4e4fe60](https://github.com/terrestris/shogun-admin/commit/4e4fe60a35013b904566cf6cde1a58945a7479eb))


### Changes in configuration

* add Dockerfile for development ([0d097c3](https://github.com/terrestris/shogun-admin/commit/0d097c339c69b953bfb7f8f47b7a8a035f9d5646))
* adjust webpack config for development inside container ([5071062](https://github.com/terrestris/shogun-admin/commit/507106261ad49bdd8dadbbe16ad87d968a3fcad0))
* readd required default nginx config ([b3a7afb](https://github.com/terrestris/shogun-admin/commit/b3a7afb0e476e70474146a71fff346ac22e7418b))
* remove unneeded files ([3225d78](https://github.com/terrestris/shogun-admin/commit/3225d78f2aff457a91861bb03a22a8664a0d8025))


### Bugfixes

* fix fullscreen mode ([c419677](https://github.com/terrestris/shogun-admin/commit/c41967711627607a0aed9eca75486eddb9a527c4))

### [7.4.1](https://github.com/terrestris/shogun-admin/compare/v7.4.0...v7.4.1) (2022-05-11)


### Changes in configuration

* add "style" as commit type-enum ([4b35d62](https://github.com/terrestris/shogun-admin/commit/4b35d6280fba4220edb80b141fe6a3e9b269fbb5))


### Changes in layout

* enhance JSONEditor and MarkdownEditor style ([6002317](https://github.com/terrestris/shogun-admin/commit/6002317dbaa7ee16cfe1177c299b30db450f980c))

## [7.4.0](https://github.com/terrestris/shogun-admin/compare/v7.3.0...v7.4.0) (2022-05-11)


### Features

* enable fullscreen mode for json and markdown editor ([5c354c5](https://github.com/terrestris/shogun-admin/commit/5c354c50a4ffe8c82fce2d8270ebce8fb0384661))
* introduce fullscreen wrapper ([1516015](https://github.com/terrestris/shogun-admin/commit/1516015ac58a23f5a06cde4774bf77039fde02ac))


### Bugfixes

* prevent scrollbar on viewport ([40455d5](https://github.com/terrestris/shogun-admin/commit/40455d54a2eb5aa4510a54cc9e1d7ec0809306c0))

## [7.3.0](https://github.com/terrestris/shogun-admin/compare/v7.2.0...v7.3.0) (2022-05-11)


### Features

* introduces data mapping for table config ([40d4f66](https://github.com/terrestris/shogun-admin/commit/40d4f66967638017a7932f1bd9fab3ba1c4928f2))


### Bugfixes

* clear form on create new click ([737a4ec](https://github.com/terrestris/shogun-admin/commit/737a4ec158f11454aa87916090f8fa4e39fd8fff))
* use navigationTitle for navigation ([5fd549c](https://github.com/terrestris/shogun-admin/commit/5fd549cb69068f6414ba4f01e1c50faac1195e0d))

## [7.2.0](https://github.com/terrestris/shogun-admin/compare/v7.1.1...v7.2.0) (2022-05-04)


### Features

* add delete action ([a6a4bb0](https://github.com/terrestris/shogun-admin/commit/a6a4bb0e8ef1c818ef0da3d6cb203ef79f0338ac))


### Bugfixes

* centered the reload icon ([4d244a5](https://github.com/terrestris/shogun-admin/commit/4d244a52bbbcd73dda4820280a13ac975da13bdc))
* enhance divider style between grid containers ([31c7fa8](https://github.com/terrestris/shogun-admin/commit/31c7fa85cbfba9c753bfedf3e444198ae8e1d9e1))
* use horizontal form layout, break long labels ([073a97b](https://github.com/terrestris/shogun-admin/commit/073a97bd697cededda70e52cea9ec11439735d76))

### [7.1.1](https://github.com/terrestris/shogun-admin/compare/v7.1.0...v7.1.1) (2022-05-03)


### Bugfixes

* properly set markdown value on edit ([e4dc803](https://github.com/terrestris/shogun-admin/commit/e4dc8033d4a50afdd06d8309c44408b2b650e0c9))

## [7.1.0](https://github.com/terrestris/shogun-admin/compare/v7.0.0...v7.1.0) (2022-05-03)


### Features

* introduce markdown editor field ([ff2f6be](https://github.com/terrestris/shogun-admin/commit/ff2f6beed3bf7e6ec07b2be425199c96ab836e45))

## [7.0.0](https://github.com/terrestris/shogun-admin/compare/v6.0.0...v7.0.0) (2022-04-27)


### Features

* redirect to login page on failed initial data load ([6f49375](https://github.com/terrestris/shogun-admin/commit/6f493753e2fcd6a182762aa84e5d65e311452f13))
* show entity statistics in dashboard only ([b58d0c7](https://github.com/terrestris/shogun-admin/commit/b58d0c7abd421c13f0a583cc5d69c1c39c7f95a6))


### Breaking changes

* dynamic form configuration for layers ([30e3a5e](https://github.com/terrestris/shogun-admin/commit/30e3a5e7709646c5c04843bf320c678df40ad734))
* dynamic form configuration for users ([fa5bc9f](https://github.com/terrestris/shogun-admin/commit/fa5bc9f6efdf8e0f9ecdee2cbf7431351ad8ec2b))


### Bugfixes

* add model configs ([8ed329a](https://github.com/terrestris/shogun-admin/commit/8ed329ab06b0d6b3b7aa935cdf03e72d01c57c56))
* enhance check for missing login ([0887c4f](https://github.com/terrestris/shogun-admin/commit/0887c4f312d8b9093a12f50406d92ca97960b459))
* enhance typing ([2dbd705](https://github.com/terrestris/shogun-admin/commit/2dbd7051c8e518237b62053aab3ef2e0ca4f2bf7))
* fix formatting ([e6a2919](https://github.com/terrestris/shogun-admin/commit/e6a2919b6c37ac0e9e330d9b28c9be3502711ab4))
* fix logout ([4393dd7](https://github.com/terrestris/shogun-admin/commit/4393dd7ac4e688667428d61d4128e0a99a252f71))
* fix service instantiation ([a1beab4](https://github.com/terrestris/shogun-admin/commit/a1beab448714b9c165688ccc8c9b202b6abbc3f1))
* remove empty line ([edf62ff](https://github.com/terrestris/shogun-admin/commit/edf62ff623c62a02bfb6a282f136670506befa9d))
* remove obsolete file ([6df7f40](https://github.com/terrestris/shogun-admin/commit/6df7f401b88a9e3910b7c206423a6231d6476224))
* restore properly parsing of json schema ([b7c15fd](https://github.com/terrestris/shogun-admin/commit/b7c15fd9fc9a04a384b9aaf47696eabe95a16985))
* use memorized services ([890cbbb](https://github.com/terrestris/shogun-admin/commit/890cbbb3db4acf1f5cd337a0dbbf360831521931))

## [6.0.0](https://github.com/terrestris/shogun-admin/compare/v5.2.0...v6.0.0) (2022-04-08)


### Breaking changes

* remove access to unknonw providerDetails ([2005cec](https://github.com/terrestris/shogun-admin/commit/2005ceca64fc68bfc37db456c0330ef95fa9faf0))
* remove KeycloakRepresenation ([40d639e](https://github.com/terrestris/shogun-admin/commit/40d639e6a5b08583304c6d6414ad2c453d328d62))
* replace keycloakRepresentation with providerDetails ([77ab3b4](https://github.com/terrestris/shogun-admin/commit/77ab3b4fce4e6cf73f53d1b992bc5b353ce39afb))


### Bugfixes

* form value setting for update case ([522eb6c](https://github.com/terrestris/shogun-admin/commit/522eb6c6235555d4572fa64b7725371ddcaf367c))
* make GenericEntityControler more failsafe ([439180f](https://github.com/terrestris/shogun-admin/commit/439180f232d5352b99a93170328495e3f32fe82d))

## [5.2.0](https://github.com/terrestris/shogun-admin/compare/v5.1.0...v5.2.0) (2022-04-07)


### Features

* introduce SecurityUtil for JWT authentication ([3ab45a5](https://github.com/terrestris/shogun-admin/commit/3ab45a5c72191520e7dd5e68f5a720fbacac90d6))


### Changes in configuration

* add --skipLibCheck to "npm run typecheck" ([ce57bbc](https://github.com/terrestris/shogun-admin/commit/ce57bbc7c1537fa28f96e3cb2e6fe2a2ff7a2c4d))


### Bugfixes

* remove dangling comma ([8f76167](https://github.com/terrestris/shogun-admin/commit/8f76167f1592cd3a4ec3131891621cadeeed51d8))

## [5.1.0](https://github.com/terrestris/shogun-admin/compare/v5.0.0...v5.1.0) (2022-04-01)


### Features

* add Select field to GeneralEntityForm ([043485d](https://github.com/terrestris/shogun-admin/commit/043485dc1a0028140b428cf82000456cf22a272a))
* setup webpack dev server for shogun-docker ([fb5b197](https://github.com/terrestris/shogun-admin/commit/fb5b1979e112f7da092028b085e9199180e46e20))


### Changes in configuration

* fix project name in build/push steps ([1163abe](https://github.com/terrestris/shogun-admin/commit/1163abead6c58810fd6af5d98f5a3701f52f4488))
* make version release conditional ([4b43c4f](https://github.com/terrestris/shogun-admin/commit/4b43c4fc4941c83b17400b177c2b0a1f19c1e667))
* remove https:// from DOCKER_REGISTRY ([18cfd14](https://github.com/terrestris/shogun-admin/commit/18cfd14588d9d16f503c32de98015c648741c0c6))


### Bugfixes

* disable webpack webSocketServer ([4239a8a](https://github.com/terrestris/shogun-admin/commit/4239a8aa67cd7dcd028fda3bdd022b69aacf12de))
* static modelPath in Portal ([2fc986c](https://github.com/terrestris/shogun-admin/commit/2fc986c1fadbd0722e5deaa2897523fd030e4de5))

## [5.0.0](https://github.com/terrestris/shogun-admin/compare/v4.0.1...v5.0.0) (2022-03-30)


### Features

* enhance general entity handling ([18beef5](https://github.com/terrestris/shogun-admin/commit/18beef5c653260fcff5c0c837e9dd5975856b9fb))
* introduce Dockerfile ([89ad842](https://github.com/terrestris/shogun-admin/commit/89ad842e2a4651f486e62713a0d5f00ef6c609be))


### Breaking changes

* adjust pathes ([be8b4bf](https://github.com/terrestris/shogun-admin/commit/be8b4bfdc4ffebd959c462ccfed67279f0923ed5))
* remove keycloak from fallbackConfig ([eddae10](https://github.com/terrestris/shogun-admin/commit/eddae105c7e8e87da9031d85ecdc6bf06006c947))
* remove keycloak from webpack ([45000af](https://github.com/terrestris/shogun-admin/commit/45000af7f3ae5b4007d32056c7c671a79987b00f))
* remove keycloak js ([6083777](https://github.com/terrestris/shogun-admin/commit/6083777e87ca13eed60b077d8da3415d1573af72))


### Dependencies

* update eslintrc ([3113113](https://github.com/terrestris/shogun-admin/commit/3113113b8eb23115799ac2905216c909f6951810))
* update packages ([6be3871](https://github.com/terrestris/shogun-admin/commit/6be38710538f0276192087f3a9eb1e46b059b286))


### Bugfixes

* add typing and stability enhancements ([93b67eb](https://github.com/terrestris/shogun-admin/commit/93b67ebc8c76d26e09941db99748114abb8bd866))


### Changes in configuration

* introduce @semantic-release/npm ([387d2ee](https://github.com/terrestris/shogun-admin/commit/387d2ee46d4168b7e328140fa0a082fe2a0aa1e4))
* only run node lint, typecheck test on PR ([b94fcea](https://github.com/terrestris/shogun-admin/commit/b94fceae8ef9268801ea798308e5ee0a202fd399))
* transform release script ([6b8eba6](https://github.com/terrestris/shogun-admin/commit/6b8eba624d3f0571a38ddfdbd32d2e0c47de5033))
* update nodejs.yml ([58338a7](https://github.com/terrestris/shogun-admin/commit/58338a7c0f975f57b76fb62a83b60cd2b890f363))

### [4.0.1](https://github.com/terrestris/shogun-admin/compare/v4.0.0...v4.0.1) (2022-01-28)


### Bugfixes

* configuration for webpack 5 ([b04cebb](https://github.com/terrestris/shogun-admin/commit/b04cebb9a70b84567a8d0134fd65cff48bbd0b95))
* formatting of application config json ([6fdf89a](https://github.com/terrestris/shogun-admin/commit/6fdf89aeed9e653d4f386025576f9a89d8f2402b))
* path to fallback config ([2bc59d0](https://github.com/terrestris/shogun-admin/commit/2bc59d02468d8289d75e02fb07905e69d6dea2f4))

## [4.0.0](https://github.com/terrestris/shogun-admin/compare/v3.0.0...v4.0.0) (2021-11-05)


### Features

* adds further proxy methods in controller ([fea6469](https://github.com/terrestris/shogun-admin/commit/fea6469ac63e265fc28abd6ad9841167b760391c))
* adds JSON as type for display field ([79b9df9](https://github.com/terrestris/shogun-admin/commit/79b9df975b098af8536f7dd9437d00d951baa54f))
* adds page header in form ([dbab50d](https://github.com/terrestris/shogun-admin/commit/dbab50d959bf050b6df933de97abd65be37d7724))


### Breaking changes

* make general entity table configurable via JSON config ([744a36d](https://github.com/terrestris/shogun-admin/commit/744a36dbf2d98ec8edc12d570f467167be9e5d73))


### Bugfixes

* set baseEntity as generic type in Portal component ([a262e3e](https://github.com/terrestris/shogun-admin/commit/a262e3ec230c53ee0ba3a7d85b2fa6a8ff7fc862))


### Dependencies

* fix dependencies ([#55](https://github.com/terrestris/shogun-admin/issues/55)) ([c0427c0](https://github.com/terrestris/shogun-admin/commit/c0427c08f2dc154b0dbba821b5724b9af2f72d90))
* update dependencies ([#53](https://github.com/terrestris/shogun-admin/issues/53)) ([4219f0f](https://github.com/terrestris/shogun-admin/commit/4219f0f09f2426eba029ce9840807176584738b7))

## [3.0.0](https://github.com/terrestris/shogun-admin/compare/v2.0.0...v3.0.0) (2021-10-19)


### Features

* load formconfigs from static assets that can be overwritten by backend ([bb01435](https://github.com/terrestris/shogun-admin/commit/bb0143511f598265a7d2aff8ad300928f8cf413d))


### Breaking changes

* load form configuration from backend ([fc9082c](https://github.com/terrestris/shogun-admin/commit/fc9082c51b0ed66190b894102a51f81e09a9f99c))
* move path of admin configutation to /config ([d5600a1](https://github.com/terrestris/shogun-admin/commit/d5600a1b75dc2d63ccdfc6bd858f18b64abb6abb))
* set admin client configuration path ([f3f4517](https://github.com/terrestris/shogun-admin/commit/f3f451784577579ce40138445c74440c46a6238c))


### Bugfixes

* improve variable naming :lipstick: ([6a0d601](https://github.com/terrestris/shogun-admin/commit/6a0d60176044b7f299f4765bd460faedaf6b07ca))
* initial load of user id ([d72c69e](https://github.com/terrestris/shogun-admin/commit/d72c69ecc63b4e3587ba63ed94c35ce2b6ca95cc))
* loading of configurations ([9b0ab2e](https://github.com/terrestris/shogun-admin/commit/9b0ab2ec0fdf01146de4467eb11628002d675219))
* remove unneeded return ([e2a4f1d](https://github.com/terrestris/shogun-admin/commit/e2a4f1d378a1e9ff3fa7e02906351f17151eedeb))
* use entity type as key ([dbc6137](https://github.com/terrestris/shogun-admin/commit/dbc613739f3cc96575f031f4bade640c7e20d3e9))

## [2.0.0](https://github.com/terrestris/shogun-admin/compare/v1.2.1...v2.0.0) (2021-10-06)


### Features

* adds models section to fallback config ([68c6253](https://github.com/terrestris/shogun-admin/commit/68c62538b6bb336e2541f865caba78bac4841515))


### Breaking changes

* create controller depending on entity type ([fb0cd69](https://github.com/terrestris/shogun-admin/commit/fb0cd69f74f9c86457d19d0b952e4e6cd296428a))
* introduce initial version of form config parser for admin panels / tables ([a408eeb](https://github.com/terrestris/shogun-admin/commit/a408eeb40a1717463ecb78363eac35e97b43e8f6))
* replace applikation form by corresponding generic one ([668d24b](https://github.com/terrestris/shogun-admin/commit/668d24be64a73501451cbad1166898fe60cec143))
* set correct class name for File model ([e63e6f9](https://github.com/terrestris/shogun-admin/commit/e63e6f9377c01bcc0adcdc7fd954af305cd37e4b))


### Bugfixes

* create of entities ([4ca4809](https://github.com/terrestris/shogun-admin/commit/4ca4809b8385b52143c43435e8b272c035a914b2))
* delete for single entity only and delete returning void on success not the entity ([7a0b097](https://github.com/terrestris/shogun-admin/commit/7a0b097cdefbb2beadde73d67e589731356e9633))
* load initial data only of both userInfo and appInfo are empty ([e290a65](https://github.com/terrestris/shogun-admin/commit/e290a651aa2d75ab1c17ef7dc7312c23d1492f33))
* use service directly from props ([0849566](https://github.com/terrestris/shogun-admin/commit/08495662986c0cd0b13dc1398efe213e2df2cb3b))

### [1.2.1](https://github.com/terrestris/shogun-admin/compare/v1.2.0...v1.2.1) (2021-10-06)


### Changes in configuration

* use dotenv only in dev mode ([fafe076](https://github.com/terrestris/shogun-admin/commit/fafe07696e841c01fd80d106add9de0cec2afab8))

## [1.2.0](https://github.com/terrestris/shogun-admin/compare/v1.1.0...v1.2.0) (2021-10-05)


### Features

* use dotenv for environment variables ([0eb7082](https://github.com/terrestris/shogun-admin/commit/0eb70824b7947cc5070957bc832449a0f3244dba))


### Changes in configuration

* ignore .env files and code-workspace ([4ac093e](https://github.com/terrestris/shogun-admin/commit/4ac093eba482559d75773fcbe195d8613bcf4857))


### Dependencies

* adds missing eslint dependencies ([e7591f4](https://github.com/terrestris/shogun-admin/commit/e7591f4a89d18a95904e3b754a3b5c66eccc6a58))

## [1.1.0](https://github.com/terrestris/shogun-admin/compare/v1.0.1...v1.1.0) (2021-10-04)


### Features

* make keyclokak realm configurable ([ce48b15](https://github.com/terrestris/shogun-admin/commit/ce48b15bb8cba6a1c539b094d5cd8b998424cf6f))


### Bugfixes

* use correct model in application service ([1970c1e](https://github.com/terrestris/shogun-admin/commit/1970c1e076f1970f7a301040d4ae3118696aadba))

### [1.0.1](https://github.com/terrestris/shogun-admin/compare/v1.0.0...v1.0.1) (2021-10-03)


### Bugfixes

* update maven release action version ([1f450b4](https://github.com/terrestris/shogun-admin/commit/1f450b4e9d4ac901192d12779a5628905a88cdd6))

## 1.0.0 (2021-10-03)


### Bugfixes

* fix versioning ([cf1bdcb](https://github.com/terrestris/shogun-admin/commit/cf1bdcbdc08bbe041fea67b324a4e993cc709049))
