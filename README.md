# Composer Drupal template

[![Build Status](https://travis-ci.org/drupal-composer/drupal-project.svg?branch=8.x)](https://travis-ci.org/drupal-composer/drupal-project)

# Dependencies
You will need node/npm and composer installed. The easiest/best way is to have them installed globally.

# Installation
This set-up uses the [drupal-project](https://github.com/drupal-composer/drupal-project) configuration
This means that Drupal is installed in /web folder, among other tweaks.

To install, clone repo. CD into it and run
```shell
npm run setup
```

This will run composer install and npm install.

After those are completed, go to localhost/REPO_NAME/web and run through the install process.
The process is similar to a wordpress install, so if you are familiar with that it should be straight forward.
Enter your DB name, user, and password when prompted.

**NOTE:** *because of potential conflict issues with installing modules, you should connect to a local database setup for this project and not one on funbox [or other shared db]. Drupals core currently does not support this feature. Check [this](https://www.drupal.org/node/1613424) issue.*

## Adding composer packages

### Drupal packages
```shell
composer require drupal/<package_name>
```

This will automatically add the file to web/modules/contrib/

### Third party packages
```shell
composer require <package_name>/<package_name>
```

The regular composer install method. Packages installed this way will be added to /vendor/


*notice the difference being the first parameter in the require package require statement*

### Adding NPM packages
Normal method

```shell
npm i -save <package_name>

or

npm i -save-dev <package_name>
```

depending on if the package is a development dependency or not.

## Setting Up Drupal

### Module installation
modules installed via composer are **not** automatically installed. To install them, go to admin -> extend. Selected all the modules you with to install and click the install button at the bottom. If you need to install a new module, do so with the `composer require` command and not by downloading the file manually.

### Setting up your content types
**TODO**: discovery

initial:

Asking someone with the correct settings to export them for you. They can do this by doing the following commands
```shell
cd PROJECT_ROOT
drush cex dev
```

They need to then go to the dev folder and copy/send you all the yml files in that folder relating to content types.

Once you have them, place them in the same folder on your site. (/dev) and run these commands
```shell
cd PROJECT_ROOT
drush cim dev
```

This will import the content types into your local site. :)
**NOTE:** *I have not actually tested this. Need to confirm or remove.*

# TODO:
1. Fix gulp scss, output file is .scss not .css
2. Ensure all babel, browserify, js stuff is set up correctly
3. Verify esdocs are functional *this is important for this project*
4. We-write gulp clean method to not clean entire dist folder. There are some static files there that need to remain. Unless, we could add them to *theme-src*? YML, etc.
5. Find proper procedure for writing + using drupal page templates (twig)
