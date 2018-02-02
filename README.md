# Email Build Automation

___

## Introduction
This is a **Gulp/Bower/NPM** project that allows the build and testing of HTML emails using gulp and harnessing tools like Litmus, SASS, HTML email frameworks and more. 

Speeding up the build to test process, increase reliability by creating sublime templates and speed up on boarding of email developers / designers.

The editable files are all in the **RESOURCES** folder and are then complied into the **EXPORT / LITMUS** folder depending on task being ran.

The **RESOURCES** folder also contains a selection of Sublime Text snippets. Snippets make use of `TAB` triggers to insert HTML snippets. See appendices for full documentation on snippets.

___

## Installation

1. Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) globally
2. Install [Node.js](https://nodejs.org/en/) globally
3. Install the gem [scss_lint](https://rubygems.org/gems/scss_lint) globally. **Note:** for any Ruby gems permission issues use sudo command
4. To test PHP works restart machine and open Terminal and type 'php -v' this should validate the version installed
5. Create folder to download this **repository** (recommend clone repository using HTTPS)
6. Open terminal at the repository folder and run the following tasks
7. Run **'npm install'**
8. Run **'npm install bower'** in the repository folder
9. Change the **port numbers** if you would like to run multiple instances (not always needed)
10. Run **'gulp task'** to do one of the following tasks.
11. Run npm install gulp-nunjucks-render within the build folder

___

## Gulp Tasks

### gulp clean

This will remove build and module files (you will need to run step 7 onwards again to use the system).


### gulp buildAll 

This will run the local browser services and allow you to code new emails and view them in the browser. It will also replace all snippets inside the sublime user folder with the snippets inside the resource folder.

### gulp nunjucks

This will combine all the modules inside the partials folder into an index.html file. index.nunjucks is used to declare the dynamic modules. layout.nunjucks is a boiler plate which pull in the dynamic modules in the place where specified. 

### gulp test

This sends the email to and tests it in litmus.

___

## Includes

To make life easier during development the following modules have been included:

### Snippets

#### How to use
  Edits to any add/edit/remove snippets should be done in the email-build/resources/snippets directory. Once ready to use, run the gulp buildAll command which will automatically populate the snippets from the email-build directory into the sublime snippets user folder.

### Node Modules

#### Nunjucks with Gulp 
  used as the engine behind the templating feature

#### browser-sync : &#94;2.18.8
  used to sync code with browsers so that testing can happen simultaneously

#### del : &#94;2.2.2
  used in the clean task to allow the deletion of files and folders

#### gulp : &#94;3.9.1
  used as an automation / task runner

#### gulp-connect-php : 0.0.8
  builds a server for viewing emails via browser-sync

#### gulp-cssmin : &#94;0.1.7
  used to minify css files mainly for plugins etc

#### gulp-email-builder : &#94;3.0.0
  email builder gives us the ability to inline css and also embed a css file in the head of the email

#### gulp-imagemin : &#94;3.1.1
  allows you to reduce the size of images that are put into the images folder

#### gulp-litmus : 0.0.7
  allows the sending of emails to litmus for testing using there API

#### gulp-notify : &#94;3.0.0
  pop up notifier for gulp so you know if the gulp script is broken

#### gulp-plumber : &#94;1.1.0
  providing more information for the notification task

#### gulp-rename : &#94;1.2.2
  allowing the rename of files within gulp tasks

#### gulp-sass : &#94;3.1.0
  SaSS compiling without having compass running

#### gulp-scss-lint : &#94;0.4.0
  SaSS linter making sure your code is written to a standard that makes reading easier

#### gulp-sourcemaps : &#94;2.4.1
  adds CSS sourcemaps to your SaSS files to make debugging in the browser easier

#### gulp-util : &#94;3.0.8
  gulp utilities

#### ip : &#94;1.1.4
  allows the getting of your local IP address so that it can be used within the gulp task


## To do
Run the SASS compiler on the partials inside the app/ directory before the nunjucks compiles the partials into the HTML allowing us to combine the 2 features.
