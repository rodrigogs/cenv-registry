# cenv-registry

[![Build Status](https://travis-ci.org/rodrigogs/cenv-registry.svg?branch=master)](https://travis-ci.org/rodrigogs/cenv-registry)
[![Code Climate](https://codeclimate.com/github/rodrigogs/cenv-registry/badges/gpa.svg)](https://codeclimate.com/github/rodrigogs/cenv-registry)
[![Test Coverage](https://codeclimate.com/github/rodrigogs/cenv-registry/badges/coverage.svg)](https://codeclimate.com/github/rodrigogs/cenv-registry/coverage)
[![Dependency Status](https://david-dm.org/rodrigogs/cenv-registry/status.svg)](https://david-dm.org/rodrigogs/cenv-registry#info=dependencies)
[![devDependency Status](https://david-dm.org/rodrigogs/cenv-registry/dev-status.svg)](https://david-dm.org/rodrigogs/cenv-registry#info=devDependencies)

**cenv-registry** implements an api to manage [cenv's](https://github.com/rodrigogs/cenv) environments.

Environment variables
---------------------
* **NODE_ENV**
  - default: **'development'**
* **PORT**
  - default: **3000**
* **HTTP_LOG_CONFIG**
  - default: **'dev'**
* **MONGO_DB**
  - default: **mongodb://localhost:27017/cenv**

Setup
-----
> Node.js **7.6.0** or higer is required

> Download or clone cenv-registry latest release at https://github.com/rodrigogs/cenv-registry/releases

> ```$ npm install```
or
> ```$ yarn install```

Development
-----------
> Have a mongodb instance running

> ```$ npm start```
or
> ```$ yarn start```

Production
----------
* Single instance
  > ```$ NODE_ENV=production node bin/www```

* Cluster
  > ```$ NODE_ENV=production node bin/fork```

Test
----
> Currently cenv-registry has only integration tests, so you need to have a running mongodb instance running to pass the tests
> ```$ npm test```
or
> ```$ yarn test```

License
-------
[Licence](https://github.com/rodrigogs/cenv-registry/blob/master/LICENSE) © Rodrigo Gomes da Silva
