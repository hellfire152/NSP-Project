@echo off
rem This file installs all the modules our project depends on.
rem Author: Jin Kuan
call npm install socket.io
call npm install express
call npm install express-session
call npm install session-file-store
call npm install https
call npm install shortid
call npm install helmet
call npm install mysql
call npm install crypto
call npm install express-validator
call npm install body-parser
call npm install uuid
call npm install promise
call npm install cookie
call npm install pug
call npm install password-validator
cls
echo All required modules installed!
