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