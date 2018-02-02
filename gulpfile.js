// Basic Gulp File
//
var gulp = require('gulp')
  sass = require('gulp-sass')
  sourcemaps = require('gulp-sourcemaps')
  notify = require('gulp-notify') 
  nunjucksRender = require('gulp-nunjucks-render')
  gulpSequence = require('gulp-sequence')
  gutil = require('gulp-util')
  prompt = require('gulp-prompt')
  plumber = require('gulp-plumber')
  imagemin = require('gulp-imagemin')
  scssLint = require('gulp-scss-lint')
  browserSync = require('browser-sync').create()
  php = require('gulp-connect-php')
  litmus = require('gulp-litmus')
  flatten = require('gulp-flatten')
  emailBuilder = require('gulp-email-builder')
  ip = require('ip')
  del = require('del')
  path = require('path')
  os = require('os');

// GET YOUR IP AND HOLD IT
var whatip = ip.address();

// SEPERATE OUT THE PORTS
var portnumber1 = 8008
var portnumber2 = 8888

// RELOAD BROWSER
var reload  = browserSync.reload;

// CONFIGS
var config = {
  projectName: 'WireframeTest',
  brandPath: './brand',
  resourcePath: './resources',
  exportPath: './export',
  litmusPath: './litmus'
}

var paths = {
  sassPath: config.resourcePath + '/sass',
  moduleCSS: config.resourcePath + '/css',
  moduleImages: config.resourcePath + '/images',
  CSS: config.exportPath + '/css',
  HTML: config.exportPath + '/html',
  images: config.exportPath + '/images',
}

var filesToMove = [
  config.resourcePath + '/templates/partials/*.html'
];



//IMAGEMIN
gulp.task('imagemin', function() {
  return gulp.src(paths.moduleImages + '/**/*.*')
    .pipe(imagemin({
      verbose: true
    }))
    .pipe(gulp.dest(paths.images));
});

// LITMUS
var full_browser_list = [
  "ANDROID4",
  "ANDROID5",
  "ANDROID6",
  "ANDROIDGMAILAPP",
  "ANDROIDGMAILIMAP",
  "APPMAIL10",
  "APPMAIL9",
  "CHROMEGMAILNEW",
  "CHROMEGMXDE",
  "CHROMEGOOGLEAPPS",
  "CHROMEGOOGLEINBOX",
  "CHROMEMAILRU",
  "CHROMEOFFICE365",
  "CHROMEOUTLOOKCOM",
  "CHROMEYAHOO",
  "FFGMAILNEW",
  "FFGOOGLEAPPS",
  "FFGOOGLEINBOX",
  "FFOFFICE365",
  "FFOUTLOOKCOM",
  "FFTONLINEDE",
  "FFYAHOO",
  "GMAILNEW",
  "GOOGLEAPPS",
  "IPAD",
  "IPADMINI",
  "IPADPRO13IN",
  "IPHONE5S",
  "IPHONE5SIOS8",
  "IPHONE6",
  "IPHONE6PLUS",
  "IPHONE6S",
  "IPHONE6SPLUS",
  "IPHONE7",
  "IPHONE7PLUS",
  "OFFICE365",
  "OL2000",
  "OL2002",
  "OL2003",
  "OL2007",
  "OL2010",
  "OL2011",
  "OL2013",
  "OL2013DPI120",
  "OL2015",
  "OL2016",
  "OUTLOOKCOM",
  "THUNDERBIRDLATEST",
  "WEBDE",
  "WINDOWS10MAIL",
  "YAHOO"
]

var litmus_config = {
    subject: 'Testing Title for now', // Will be the name of the template in Litmus
    username: 'alexbirkett@rentalcars.com',
    password: 'rentalcars123',
    url: 'https://rentalcars3.litmus.com',
    applications: full_browser_list
}

// GULP SCSS LINT
gulp.task('sassLint', function() {
  return gulp.src([paths.sassPath + '/**/*.scss'])
    .pipe(scssLint({
        'maxBuffer': 614400
    }));
});

// GULP SASS
gulp.task('sassCompile', ['sassLint'], function() {
  var onError = function(err) {
    notify.onError({
      title:    "Gulp",
      subtitle: "SaSS Failure!",
      message:  "line " + err.line + " in " + err.file.replace(/^.*[\\\/]/, '') + "\n" + err.message,
      sound:    "Beep"
    })(err);
    this.emit('end');
  };
  
  return gulp.src(paths.sassPath + '/**/*.*')
  .pipe(sourcemaps.init({largeFile: true}))
  .pipe(plumber({errorHandler: onError}))
  .pipe(sass({
      outputStyle: 'expanded'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.moduleCSS))
  .pipe(notify({ // Add gulpif here
     title: 'Gulp',
     subtitle: 'SaSS Success!',
     message: 'SaSS has been compiled and browser reloaded',
     sound: "Pop"
  }));
});

// EMAIL BUILDING CONFIG
var b_options = { 
  encodeSpecialChars: true
}

// EMAIL SENDING CONFIG
var s_options = { 
  encodeSpecialChars: true,
  litmus : {
    // Optional, defaults to title of email or yyyy-mm-dd if <title> and options.subject not set
    subject : litmus_config.subject,
    // Litmus username
    username : litmus_config.username,
    // Litmus password
    password : litmus_config.password,
    // Url to your Litmus account
    url : litmus_config.url,
    applications : full_browser_list
  }
}

var builder = new emailBuilder(b_options);
var sender = new emailBuilder(s_options);

// MOVING  FILES 
gulp.task('moveFiles', ['imagemin', 'sassCompile'], function() {
  var onError = function(err) {
    notify.onError({
      title:    "Gulp",
      subtitle: "File Move Failure!",
      message:  err.message,
      sound:    "Beep"
    })(err);
    this.emit('end');
  };

  return gulp.src(filesToMove, { base: config.resourcePath })
  .pipe(builder.build())
  .pipe(plumber({errorHandler: onError}))
  .pipe(gulp.dest(config.exportPath))
  //.pipe(notify({message: 'Data copied!'}))
  .pipe(notify({ // Add gulpif here
    title: 'Gulp',
    subtitle: 'Files Moved Success!',
    message: 'All files have been moved to the site and browser restarted',
    sound: "Pop",
    onLast: true
  }))
  .pipe(browserSync.reload({stream:true}));
});

// Move Email 
gulp.task('moveEmail', ['imagemin', 'sassCompile'], function() {
  var onError = function(err) {
    notify.onError({
      title:    "Gulp",
      subtitle: "File Move Failure!",
      message:  err.message,
      sound:    "Beep"
    })(err);
    this.emit('end');
  };

  gulp.src('')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'filename',
        message: 'Please confirm email to be built. The name should not include the extension .html:',
        default: 'test-email'
    },
      function(response){
        // now send the email
        return gulp.src(config.resourcePath + response.filename + '.html', { base: config.resourcePath })
        .pipe(builder.build())
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulp.dest(config.exportPath))
        //.pipe(notify({message: 'Data copied!'}))
        .pipe(notify({ // Add gulpif here
          title: 'Gulp',
          subtitle: 'Files Moved Success!',
          message: 'All files have been moved to the site and browser restarted',
          sound: "Pop",
          onLast: true
        }))
        .pipe(browserSync.reload({stream:true}));
      })
    );
});






//PHP
gulp.task('php', function() {
    php.server({ base: config.exportPath, hostname:whatip, port: portnumber1, keepalive: true});
});

//BROWSER SYNC
gulp.task('browserSync',['php'], function() {
  browserSync.init({
    proxy: whatip + ':' + portnumber1,
    port: portnumber2,
    open: true,
    notify: true,
    startPath: '/index.html'
  });
});

//GULP CLEAN
// This will clean out the Bower, NPM and build directories - great for starting again.
gulp.task('clean', function() {

  return del([
    'node_modules',
    'export',
    'litmus',
    'brand'
  ]);

});

// Templating engine for partials and modules
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('export/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['export/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('export'))
});
// GULP build
// This is used to build the wireframe to bootstrap specifications , 'templates'

gulp.task('buildAll', [ 'moveFiles', 'browserSync', 'clearSnippets', 'snippets', ], function() {

// Runs the nunjucks AFTER the build all
gulp.start('nunjucks');


  //DO WE NEED WATCHES HERE?
  gulp.watch(paths.sassPath + "/**/*.scss", ['moveFiles']);
  gulp.watch(paths.imagePath + "/**/*.png", ['moveFiles']);
  gulp.watch(paths.imagePath + "/**/*.gif", ['moveFiles']);
  gulp.watch(paths.imagePath + "/**/*.jpg", ['moveFiles']);
  gulp.watch(config.resourcePath + "/*.html", ['moveFiles']);
});

// build single email - needs work
gulp.task('buildOne', ['moveEmail', 'browserSync'], function () {

  //DO WE NEED WATCHES HERE?
  gulp.watch(paths.sassPath + "/**/*.scss", ['moveEmail']);
  gulp.watch(paths.imagePath + "/**/*.png", ['moveEmail']);
  gulp.watch(paths.imagePath + "/**/*.gif", ['moveEmail']);
  gulp.watch(paths.imagePath + "/**/*.jpg", ['moveEmail']);
  gulp.watch(config.resourcePath + "/*.html", ['moveEmail']);
});


// SEND TEST EMAIL
// This is used to send the email off to litmus
gulp.task('test', function () {

  gulp.src('')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'emailName',
        message: 'Please confirm email to be tested (needs to be in the export folder). The name should not include the extension .html:',
        default: 'test-email'
    },
      function(response){
        // now send the email
        return gulp.src(config.exportPath + '/' + response.emailName + '.html')
          .pipe(sender.sendLitmusTest())
          .pipe(gulp.dest(config.litmusPath));
      })
    );
});


// MOVE SNIPPETS
// setting home dir
var homeDir = os.homedir();
// set location of snippets to move
var snippetsToMove = [
  config.resourcePath + '/snippets/*.sublime-snippet'
];

// delete current snippets in home directory
gulp.task('clearSnippets', function() {
  return del([
    homeDir + '/Library/Application Support/Sublime Text 3/Packages/User/*.sublime-snippet'], {force: true});

});

// This task is used to move snippets from the snippets folder
// and load them in you local folder. 
gulp.task('snippets', function () {
  var onError = function(err) {
    notify.onError({
      title:    "Snippets",
      subtitle: "Update fail!",
      message:  err.message,
      sound:    "Beep"
    })(err);
    this.emit('end');
  };

  return gulp.src(snippetsToMove, { base: homeDir })
  .pipe(plumber({errorHandler: onError}))
  .pipe(flatten())
  .pipe(gulp.dest(homeDir + '/Library/Application Support/Sublime Text 3/Packages/User'))
  .pipe(notify({ // Add gulpif here
    title: 'Snippets',
    subtitle: 'Files Moved!',
    message: 'All files have been moved to the sublime folder',
    sound: "Pop",
    onLast: true
  }));
});



