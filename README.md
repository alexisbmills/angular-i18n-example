# Angular i18n Example

A simple example of i18n for Angular, using Angular CLI (1.2).

It also shows a basic strategy for persisting state between i18n contexts, using browser localStorage.

The example is guided by [Deploying an i18n Angular app with angular-cli](https://medium.com/@feloy/deploying-an-i18n-angular-app-with-angular-cli-fc788f17e358) and the [official i18n docs](https://angular.io/guide/i18n).

## Requirements
- Yarn package manager
- A web server such as Apache/Nginx to serve the each dist/locale.
 
An example virtual host configuration:

    <VirtualHost *:80>
      DocumentRoot /path/to/project/dist
      ServerName ng-i18n.your.local
      <Directory /path/to/project/dist>
        AllowOverride All
        Require local
        
        RewriteEngine on
        RewriteBase /
    	
        RewriteRule ^../index\.html$ - [L]
    	
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
    	
        RewriteRule (..) $1/index.html [L]
    	
        RewriteCond %{HTTP:Accept-Language} ^es [NC]
        RewriteRule ^$ /es/ [R]
    	
        RewriteCond %{HTTP:Accept-Language} !^en [NC]
        RewriteRule ^$ /en/ [R]
      </Directory>
    </VirtualHost>

## Installation

    yarn install
    
## Running the application
Build with:

    yarn run build
    
Browse to your `http://ng-i18n.your.local`
 
## Development

Developing against a locale is done using

`yarn start` for English

`yarn run start:es` for Espanol
    
The base definition file is  `src/messages.xlf` and locale translations located in `src/locale`

Managing translation files can be time consuming. The following scripts are to make life easier.
 
 `yarn run i18n:extract` to generate the base definition file
 
 `yarn run i18n:create "en, es, de"` to create new translation file/s
 
 `yarn run i18n:update` to extract as above, then add/update/delete definitions from each translation file based on your changes
  
 These scripts are taken from [Angular2 i18n Native Support](http://www.savethecode.com/angular2-i18n-native-support/).


