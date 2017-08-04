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

Ask someone with the correct settings to export them for you. They can do this by doing the following commands
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

**NOTE PT2 THE NOTE-ENING:** *Is this actually the best method? Should we have a 'staging' db and just do dumps / pulls from that instead?*

# Setting up your development environment
by default, Drupal caches a ton. To see new changes made to twig files, you need to go into admin -> congifuration -> performance and manually clear the cache. This needs to be done every single time you make an update to a twig, etc. file. As you can imagine, this gets annoying and tedious.

**THE SOLUTION**
To solve this issue, a few files need to be updated.

1. Copy /web/sites/default/example.settings.local.php to /web/sites/default/files.
	- once done, rename the file to simple settings.local.php
	- then, uncomment this line `$settings['cache']['bins']['render'] = 'cache.backend.null';`

2. In that same folder, open up settings.php
	- at the bottom of the file, just before your database settings, uncomment the 3 lines that look something like

```
	if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
	  include $app_root . '/' . $site_path . '/settings.local.php';
	}
```

3. Finally, open up development.services.yml in the sites folder
	- Add a parameters field (if one does not already exist) and add the following parameters

```
	twig.config:
		debug: true
		auto-reload: true
		cache: false
```

*This is a yml file, so indentation matters!*

Once you have done these steps, navigate to `localhost/SITE_URL/web/rebuild.php`.
Then clear you cache one final time.

and, bam! Go make a change to a twig file and reload, you should see the changes immediately. This helps with theme development, but should NOT ever be pushed to a live production environment.


# TODO:
1. improve gulp scss task
2. Ensure all babel, browserify, js stuff is set up correctly
3. Verify esdocs are functional **this is important for this project**
4. Re-write gulp clean method to not clean entire dist folder. There are some static files there that need to remain. Unless, we could add them to *theme-src*? YML, etc.
5. Find proper procedure for writing + using drupal page templates (twig)
6. Solve how we handle databases. funbox? local? etc?
