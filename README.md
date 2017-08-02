# Composer Drupal tempalate

[![Build Status](https://travis-ci.org/drupal-composer/drupal-project.svg?branch=8.x)](https://travis-ci.org/drupal-composer/drupal-project)

#Installation
Drupal is installed in /web folder

To install, clone repo. CD into it and run
```shell
npm run setup
```

This will run composer install and npm install.

After those are completed, go to localhost/REPO_NAME/web and run through the install process.
The process is similar to a wordpress install, so if you are familiar with that it should be
fairly straight forward. Enter your DB name, user, and password when prompted.

**NOTE:** because of potential conflict issues with installing modules, you should connect to a local database setup for this project and not one on funbox [or other shared db].

##Adding composer packages

### Drupal packages
```shell
composer require drupal/<package_name>
```

This will automatically add the file to web/modules/contrib/

###Third party packages
```shell
composer require <package_name>/<package_name>
```

The regular composer install method. Packages installed this way will be added to /vendor/


*notice the difference being the first parameter in the require package require statement*

###Adding NPM packages
Normal method

```shell
npm i -save <package_name>

or

npm i -save-dev <package_name>
```

depending on if the package is a development dependency or not.
